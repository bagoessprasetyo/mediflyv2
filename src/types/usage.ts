// Token usage tracking types

export interface CostRate {
  id: string;
  model_name: string;
  input_cost_per_1k_tokens: number;
  output_cost_per_1k_tokens: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  session_id: string;
  action_type: string;
  endpoint: string | null;
  model_name: string | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_usd: number;
  request_data: Record<string, any> | null;
  response_data: Record<string, any> | null;
  duration_ms: number | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export interface UsageBudget {
  id: string;
  user_id: string;
  daily_limit_usd: number;
  monthly_limit_usd: number;
  current_daily_spend: number;
  current_monthly_spend: number;
  last_daily_reset: string;
  last_monthly_reset: string;
  notifications_enabled: boolean;
  warning_threshold_percent: number;
  created_at: string;
  updated_at: string;
}

export interface UsageSession {
  id: string;
  user_id: string;
  session_name: string | null;
  started_at: string;
  ended_at: string | null;
  total_tokens: number;
  total_cost_usd: number;
  request_count: number;
  metadata: Record<string, any> | null;
}

export interface UsageStats {
  total_tokens: number;
  total_cost: number;
  request_count: number;
  avg_tokens_per_request: number;
  most_used_action: string | null;
}

// Request tracking
export interface TokenTrackingRequest {
  action_type: string;
  endpoint?: string;
  model_name?: string;
  input_tokens?: number;
  output_tokens?: number;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
  duration_ms?: number;
  success?: boolean;
  error_message?: string;
}

// Context state
export interface TokenUsageState {
  currentSession: UsageSession | null;
  todayUsage: UsageStats | null;
  monthUsage: UsageStats | null;
  budget: UsageBudget | null;
  isTracking: boolean;
  recentUsage: TokenUsage[];
}

// Dashboard chart data
export interface UsageChartData {
  date: string;
  tokens: number;
  cost: number;
  requests: number;
}

export interface UsageByActionData {
  action: string;
  tokens: number;
  cost: number;
  requests: number;
  percentage: number;
}

export interface BudgetUsageData {
  daily: {
    used: number;
    limit: number;
    percentage: number;
  };
  monthly: {
    used: number;
    limit: number;
    percentage: number;
  };
}

// Form types
export interface BudgetUpdateForm {
  daily_limit_usd: number;
  monthly_limit_usd: number;
  notifications_enabled: boolean;
  warning_threshold_percent: number;
}

export interface UsageFilters {
  start_date?: string;
  end_date?: string;
  action_type?: string;
  model_name?: string;
  session_id?: string;
  success?: boolean;
  page?: number;
  per_page?: number;
}

// API responses
export interface UsageStatsResponse {
  today: UsageStats;
  yesterday: UsageStats;
  thisMonth: UsageStats;
  lastMonth: UsageStats;
  dailyChart: UsageChartData[];
  actionBreakdown: UsageByActionData[];
  budgetStatus: BudgetUsageData;
}

export interface UsageHistoryResponse {
  usage: TokenUsage[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Utility types
export type ModelName = 
  | 'gpt-4'
  | 'gpt-4-turbo' 
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'llama-2-70b'
  | 'default'
  | 'local'
  | 'supabase-query'
  | 'supabase-mutation';

export type ActionType = 
  | 'query'
  | 'create'
  | 'update'
  | 'delete'
  | 'search'
  | 'list'
  | 'export'
  | 'import'
  | 'auth'
  | 'file_upload'
  | 'file_process'
  | 'analysis'
  | 'generation'
  | 'other';

// Alert types
export interface UsageAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  percentage?: number;
  threshold?: number;
  action?: () => void;
  dismissible: boolean;
}