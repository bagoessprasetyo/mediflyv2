'use client';

import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './user-context';
import { 
  TokenUsageState, 
  TokenTrackingRequest, 
  UsageSession, 
  UsageStats, 
  UsageBudget,
  TokenUsage,
  UsageAlert
} from '@/types/usage';

interface TokenUsageContextType extends TokenUsageState {
  // Session management
  startSession: (sessionName?: string) => Promise<string>;
  endSession: () => Promise<void>;
  
  // Usage tracking
  trackUsage: (request: TokenTrackingRequest) => Promise<void>;
  
  // Data refresh
  refreshStats: () => Promise<void>;
  refreshBudget: () => Promise<void>;
  
  // Alerts
  alerts: UsageAlert[];
  dismissAlert: (alertId: string) => void;
  
  // Real-time tracking
  isRealTimeEnabled: boolean;
  toggleRealTime: () => void;
  
  // Quick stats
  getTodayTokens: () => number;
  getTodayCost: () => number;
  getBudgetPercentage: (type: 'daily' | 'monthly') => number;
}

const TokenUsageContext = createContext<TokenUsageContextType | undefined>(undefined);

interface TokenUsageProviderProps {
  children: ReactNode;
}

export function TokenUsageProvider({ children }: TokenUsageProviderProps) {
  // Handle cases where UserProvider might not be available yet
  let user: any = null;
  try {
    const userContext = useUser();
    user = userContext.user;
  } catch (error) {
    // UserProvider not available - this is fine, we'll handle it gracefully
    user = null;
  }
  
  const supabase = createClient();
  
  // State
  const [currentSession, setCurrentSession] = useState<UsageSession | null>(null);
  const [todayUsage, setTodayUsage] = useState<UsageStats | null>(null);
  const [monthUsage, setMonthUsage] = useState<UsageStats | null>(null);
  const [budget, setBudget] = useState<UsageBudget | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [recentUsage, setRecentUsage] = useState<TokenUsage[]>([]);
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session-${user?.id || 'anonymous'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, [user?.id]);

  // Start a new usage session
  const startSession = useCallback(async (sessionName?: string): Promise<string> => {
    if (!user?.id) {
      // Return a mock session ID for non-authenticated users
      return `local-session-${Date.now()}`;
    }
    
    const sessionId = generateSessionId();
    const session: Partial<UsageSession> = {
      id: sessionId,
      user_id: user.id,
      session_name: sessionName || `Session ${new Date().toLocaleString()}`,
      started_at: new Date().toISOString(),
      total_tokens: 0,
      total_cost_usd: 0,
      request_count: 0,
      metadata: { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server' }
    };

    const { error } = await supabase
      .from('usage_sessions')
      .insert(session);

    if (error) throw error;

    setCurrentSession(session as UsageSession);
    return sessionId;
  }, [user?.id, supabase, generateSessionId]);

  // End current session
  const endSession = useCallback(async () => {
    if (!currentSession) return;

    const { error } = await supabase
      .from('usage_sessions')
      .update({ 
        ended_at: new Date().toISOString() 
      })
      .eq('id', currentSession.id);

    if (error) console.error('Error ending session:', error);
    
    setCurrentSession(null);
  }, [currentSession, supabase]);

  // Track token usage
  const trackUsage = useCallback(async (request: TokenTrackingRequest) => {
    if (!isTracking) return;

    // Skip database operations if no user
    if (!user?.id) {
      // For non-authenticated users, we could store usage in localStorage
      // or simply skip tracking. For now, we'll skip to avoid errors.
      console.log('Tracking skipped - no authenticated user');
      return;
    }

    // Get or create session
    let sessionId = currentSession?.id;
    if (!sessionId) {
      sessionId = await startSession();
    }

    const totalTokens = (request.input_tokens || 0) + (request.output_tokens || 0);
    
    // Calculate cost
    let cost = 0;
    if (request.model_name && request.input_tokens && request.output_tokens) {
      const { data: costRate } = await supabase
        .from('cost_rates')
        .select('input_cost_per_1k_tokens, output_cost_per_1k_tokens')
        .eq('model_name', request.model_name)
        .eq('is_active', true)
        .single();

      if (costRate) {
        cost = (request.input_tokens / 1000) * costRate.input_cost_per_1k_tokens +
               (request.output_tokens / 1000) * costRate.output_cost_per_1k_tokens;
      }
    }

    const usage: Partial<TokenUsage> = {
      user_id: user.id,
      session_id: sessionId,
      action_type: request.action_type,
      endpoint: request.endpoint,
      model_name: request.model_name || 'unknown',
      input_tokens: request.input_tokens || 0,
      output_tokens: request.output_tokens || 0,
      total_tokens: totalTokens,
      cost_usd: cost,
      request_data: request.request_data,
      response_data: request.response_data,
      duration_ms: request.duration_ms,
      success: request.success ?? true,
      error_message: request.error_message,
    };

    const { error } = await supabase
      .from('token_usage')
      .insert(usage);

    if (error) {
      console.error('Error tracking usage:', error);
      return;
    }

    // Update local state
    if (isRealTimeEnabled) {
      await refreshStats();
      await refreshBudget();
    }

    // Check for budget alerts
    await checkBudgetAlerts();

  }, [user?.id, isTracking, currentSession, startSession, supabase, isRealTimeEnabled]);

  // Refresh today's stats
  const refreshStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData } = await supabase
        .rpc('get_usage_stats', {
          p_user_id: user.id,
          p_start_date: today,
          p_end_date: today
        });

      if (todayData && todayData.length > 0) {
        setTodayUsage(todayData[0]);
      }

      // Get month stats
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];
      const monthEnd = new Date().toISOString().split('T')[0];
      
      const { data: monthData } = await supabase
        .rpc('get_usage_stats', {
          p_user_id: user.id,
          p_start_date: monthStart,
          p_end_date: monthEnd
        });

      if (monthData && monthData.length > 0) {
        setMonthUsage(monthData[0]);
      }

      // Get recent usage
      const { data: recent } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recent) {
        setRecentUsage(recent);
      }

    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, [user?.id, supabase]);

  // Refresh budget info
  const refreshBudget = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('usage_budgets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setBudget(data);
      } else {
        // Create default budget if none exists
        const defaultBudget = {
          user_id: user.id,
          daily_limit_usd: 10.00,
          monthly_limit_usd: 300.00
        };

        const { data: newBudget } = await supabase
          .from('usage_budgets')
          .insert(defaultBudget)
          .select()
          .single();

        if (newBudget) {
          setBudget(newBudget);
        }
      }
    } catch (error) {
      console.error('Error refreshing budget:', error);
    }
  }, [user?.id, supabase]);

  // Check for budget alerts
  const checkBudgetAlerts = useCallback(async () => {
    if (!budget || !budget.notifications_enabled) return;

    const newAlerts: UsageAlert[] = [];

    // Daily budget check
    const dailyPercentage = (budget.current_daily_spend / budget.daily_limit_usd) * 100;
    if (dailyPercentage >= budget.warning_threshold_percent) {
      newAlerts.push({
        id: 'daily-warning',
        type: dailyPercentage >= 100 ? 'danger' : 'warning',
        title: 'Daily Budget Alert',
        message: `You've used ${dailyPercentage.toFixed(1)}% of your daily budget ($${budget.current_daily_spend.toFixed(4)} / $${budget.daily_limit_usd})`,
        percentage: dailyPercentage,
        threshold: budget.warning_threshold_percent,
        dismissible: true
      });
    }

    // Monthly budget check
    const monthlyPercentage = (budget.current_monthly_spend / budget.monthly_limit_usd) * 100;
    if (monthlyPercentage >= budget.warning_threshold_percent) {
      newAlerts.push({
        id: 'monthly-warning',
        type: monthlyPercentage >= 100 ? 'danger' : 'warning',
        title: 'Monthly Budget Alert',
        message: `You've used ${monthlyPercentage.toFixed(1)}% of your monthly budget ($${budget.current_monthly_spend.toFixed(4)} / $${budget.monthly_limit_usd})`,
        percentage: monthlyPercentage,
        threshold: budget.warning_threshold_percent,
        dismissible: true
      });
    }

    setAlerts(prev => {
      // Remove old alerts and add new ones
      const filtered = prev.filter(alert => 
        !alert.id.includes('daily-warning') && !alert.id.includes('monthly-warning')
      );
      return [...filtered, ...newAlerts];
    });
  }, [budget]);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Toggle real-time tracking
  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled(prev => !prev);
  }, []);

  // Quick stats getters
  const getTodayTokens = useCallback(() => {
    return todayUsage?.total_tokens || 0;
  }, [todayUsage]);

  const getTodayCost = useCallback(() => {
    return todayUsage?.total_cost || 0;
  }, [todayUsage]);

  const getBudgetPercentage = useCallback((type: 'daily' | 'monthly') => {
    if (!budget) return 0;
    
    if (type === 'daily') {
      return (budget.current_daily_spend / budget.daily_limit_usd) * 100;
    } else {
      return (budget.current_monthly_spend / budget.monthly_limit_usd) * 100;
    }
  }, [budget]);

  // Initialize data when user loads
  useEffect(() => {
    if (user?.id) {
      refreshStats();
      refreshBudget();
      
      // Start a session if none exists
      if (!currentSession) {
        startSession();
      }
    }
  }, [user?.id, refreshStats, refreshBudget, currentSession, startSession]);

  // Auto-refresh every 30 seconds if real-time is enabled
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      refreshStats();
      refreshBudget();
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, refreshStats, refreshBudget]);

  const value: TokenUsageContextType = {
    // State
    currentSession,
    todayUsage,
    monthUsage,
    budget,
    isTracking,
    recentUsage,
    
    // Actions
    startSession,
    endSession,
    trackUsage,
    refreshStats,
    refreshBudget,
    
    // Alerts
    alerts,
    dismissAlert,
    
    // Real-time
    isRealTimeEnabled,
    toggleRealTime,
    
    // Quick stats
    getTodayTokens,
    getTodayCost,
    getBudgetPercentage,
  };

  return (
    <TokenUsageContext.Provider value={value}>
      {children}
    </TokenUsageContext.Provider>
  );
}

export function useTokenUsage() {
  const context = useContext(TokenUsageContext);
  if (context === undefined) {
    throw new Error('useTokenUsage must be used within a TokenUsageProvider');
  }
  return context;
}