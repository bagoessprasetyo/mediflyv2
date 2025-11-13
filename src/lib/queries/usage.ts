'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  TokenUsage, 
  UsageBudget, 
  UsageSession, 
  UsageStats,
  UsageFilters,
  BudgetUpdateForm,
  UsageChartData,
  UsageByActionData,
  CostRate
} from '@/types/usage';
import { useQueryTracker } from '@/hooks/use-token-tracker';

// Query Keys
export const usageKeys = {
  all: ['usage'] as const,
  stats: () => [...usageKeys.all, 'stats'] as const,
  statsDateRange: (start: string, end: string) => [...usageKeys.stats(), start, end] as const,
  budget: () => [...usageKeys.all, 'budget'] as const,
  history: () => [...usageKeys.all, 'history'] as const,
  historyFiltered: (filters: UsageFilters) => [...usageKeys.history(), filters] as const,
  sessions: () => [...usageKeys.all, 'sessions'] as const,
  charts: () => [...usageKeys.all, 'charts'] as const,
  chartsDailyRange: (start: string, end: string) => [...usageKeys.charts(), 'daily', start, end] as const,
  costRates: () => [...usageKeys.all, 'cost-rates'] as const,
};

// Get usage stats for a date range
export function useUsageStats(startDate?: string, endDate?: string) {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  const today = new Date().toISOString().split('T')[0];
  const actualStartDate = startDate || today;
  const actualEndDate = endDate || today;

  return useQuery({
    queryKey: usageKeys.statsDateRange(actualStartDate, actualEndDate),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_usage_stats', {
            p_user_id: (await supabase.auth.getUser()).data.user?.id,
            p_start_date: actualStartDate,
            p_end_date: actualEndDate
          });

        if (error) throw error;

        await trackTanStackQuery(['usage', 'stats'], data);
        
        return data?.[0] as UsageStats || {
          total_tokens: 0,
          total_cost: 0,
          request_count: 0,
          avg_tokens_per_request: 0,
          most_used_action: null
        };
      } catch (error) {
        await trackTanStackQuery(['usage', 'stats'], null, error as Error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get today's usage stats
export function useTodayUsage() {
  const today = new Date().toISOString().split('T')[0];
  return useUsageStats(today, today);
}

// Get this month's usage stats
export function useMonthUsage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date().toISOString().split('T')[0];
  
  return useUsageStats(monthStart, monthEnd);
}

// Get user's budget information
export function useUsageBudget() {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  return useQuery({
    queryKey: usageKeys.budget(),
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('usage_budgets')
          .select('*')
          .eq('user_id', user.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Not found error
          throw error;
        }

        await trackTanStackQuery(['usage', 'budget'], data);
        
        return data as UsageBudget | null;
      } catch (error) {
        await trackTanStackQuery(['usage', 'budget'], null, error as Error);
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get usage history with optional filters
export function useUsageHistory(
  filters: UsageFilters = {},
  page: number = 1,
  perPage: number = 50
) {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  return useQuery({
    queryKey: usageKeys.historyFiltered({ ...filters, page, per_page: perPage }),
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        let query = supabase
          .from('token_usage')
          .select('*, cost_rates(model_name, description)')
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false });

        // Apply filters
        if (filters.start_date) {
          query = query.gte('created_at', filters.start_date);
        }
        if (filters.end_date) {
          query = query.lte('created_at', `${filters.end_date}T23:59:59.999Z`);
        }
        if (filters.action_type) {
          query = query.eq('action_type', filters.action_type);
        }
        if (filters.model_name) {
          query = query.eq('model_name', filters.model_name);
        }
        if (filters.session_id) {
          query = query.eq('session_id', filters.session_id);
        }
        if (filters.success !== undefined) {
          query = query.eq('success', filters.success);
        }

        // Apply pagination
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        await trackTanStackQuery(['usage', 'history', 'filtered'], data);

        return {
          usage: data as TokenUsage[],
          total: count || 0,
          page,
          per_page: perPage,
          total_pages: Math.ceil((count || 0) / perPage),
        };
      } catch (error) {
        await trackTanStackQuery(['usage', 'history', 'filtered'], null, error as Error);
        throw error;
      }
    },
    staleTime: 10 * 1000, // 10 seconds
  });
}

// Get usage chart data for dashboard
export function useUsageChartData(days: number = 7) {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  return useQuery({
    queryKey: usageKeys.chartsDailyRange(startDateStr, endDateStr),
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('token_usage')
          .select('created_at, total_tokens, cost_usd')
          .eq('user_id', user.user.id)
          .gte('created_at', startDateStr)
          .lte('created_at', `${endDateStr}T23:59:59.999Z`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        await trackTanStackQuery(['usage', 'charts', 'daily'], data);

        // Group by date and sum values
        const chartData: Record<string, { tokens: number; cost: number; requests: number }> = {};

        data?.forEach((record) => {
          const date = record.created_at.split('T')[0];
          if (!chartData[date]) {
            chartData[date] = { tokens: 0, cost: 0, requests: 0 };
          }
          chartData[date].tokens += record.total_tokens || 0;
          chartData[date].cost += record.cost_usd || 0;
          chartData[date].requests += 1;
        });

        // Fill in missing dates
        const result: UsageChartData[] = [];
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          
          result.push({
            date: dateStr,
            tokens: chartData[dateStr]?.tokens || 0,
            cost: chartData[dateStr]?.cost || 0,
            requests: chartData[dateStr]?.requests || 0,
          });
        }

        return result;
      } catch (error) {
        await trackTanStackQuery(['usage', 'charts', 'daily'], null, error as Error);
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get usage breakdown by action type
export function useUsageByAction(days: number = 30) {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  return useQuery({
    queryKey: [...usageKeys.all, 'by-action', days],
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('token_usage')
          .select('action_type, total_tokens, cost_usd')
          .eq('user_id', user.user.id)
          .gte('created_at', startDateStr);

        if (error) throw error;

        await trackTanStackQuery(['usage', 'by-action'], data);

        // Group by action type
        const actionData: Record<string, { tokens: number; cost: number; requests: number }> = {};
        let totalTokens = 0;
        let totalCost = 0;
        let totalRequests = 0;

        data?.forEach((record) => {
          const action = record.action_type;
          if (!actionData[action]) {
            actionData[action] = { tokens: 0, cost: 0, requests: 0 };
          }
          actionData[action].tokens += record.total_tokens || 0;
          actionData[action].cost += record.cost_usd || 0;
          actionData[action].requests += 1;

          totalTokens += record.total_tokens || 0;
          totalCost += record.cost_usd || 0;
          totalRequests += 1;
        });

        const result: UsageByActionData[] = Object.entries(actionData).map(([action, data]) => ({
          action,
          tokens: data.tokens,
          cost: data.cost,
          requests: data.requests,
          percentage: totalTokens > 0 ? (data.tokens / totalTokens) * 100 : 0,
        }));

        return result.sort((a, b) => b.tokens - a.tokens);
      } catch (error) {
        await trackTanStackQuery(['usage', 'by-action'], null, error as Error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get usage sessions
export function useUsageSessions(limit: number = 10) {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  return useQuery({
    queryKey: [...usageKeys.sessions(), limit],
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('usage_sessions')
          .select('*')
          .eq('user_id', user.user.id)
          .order('started_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        await trackTanStackQuery(['usage', 'sessions'], data);
        
        return data as UsageSession[];
      } catch (error) {
        await trackTanStackQuery(['usage', 'sessions'], null, error as Error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get cost rates
export function useCostRates() {
  const supabase = createClient();
  const { trackTanStackQuery } = useQueryTracker();

  return useQuery({
    queryKey: usageKeys.costRates(),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cost_rates')
          .select('*')
          .eq('is_active', true)
          .order('model_name');

        if (error) throw error;

        await trackTanStackQuery(['usage', 'cost-rates'], data);
        
        return data as CostRate[];
      } catch (error) {
        await trackTanStackQuery(['usage', 'cost-rates'], null, error as Error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutations

// Update budget
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (budget: Partial<BudgetUpdateForm>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('usage_budgets')
        .upsert({
          user_id: user.user.id,
          ...budget,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usageKeys.budget() });
      toast.success('Budget settings updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
}

// Export usage data
export function useExportUsage() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (filters: UsageFilters & { format: 'csv' | 'json' }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      let query = supabase
        .from('token_usage')
        .select('*, cost_rates(model_name, description)')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('created_at', `${filters.end_date}T23:59:59.999Z`);
      }
      if (filters.action_type) {
        query = query.eq('action_type', filters.action_type);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Format data based on requested format
      if (filters.format === 'csv') {
        const csvHeaders = [
          'Date',
          'Action Type',
          'Endpoint',
          'Model',
          'Input Tokens',
          'Output Tokens',
          'Total Tokens',
          'Cost (USD)',
          'Duration (ms)',
          'Success',
          'Session ID'
        ].join(',');

        const csvRows = data?.map(row => [
          new Date(row.created_at).toISOString(),
          row.action_type,
          row.endpoint || '',
          row.model_name || '',
          row.input_tokens,
          row.output_tokens,
          row.total_tokens,
          row.cost_usd,
          row.duration_ms || '',
          row.success,
          row.session_id
        ].join(',')) || [];

        return [csvHeaders, ...csvRows].join('\n');
      }

      return JSON.stringify(data, null, 2);
    },
    onSuccess: (data, variables) => {
      // Create and download file
      const blob = new Blob([data], { 
        type: variables.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usage-export-${new Date().toISOString().split('T')[0]}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Usage data exported successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to export data: ${error.message}`);
    },
  });
}

// Delete usage session
export function useDeleteSession() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('usage_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usageKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: usageKeys.history() });
      toast.success('Session deleted');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete session: ${error.message}`);
    },
  });
}