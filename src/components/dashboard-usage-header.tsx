'use client';

import { TokenCounter } from '@/components/usage/token-counter';
import { UsageHeaderSkeleton } from '@/components/skeletons/usage-header-skeleton';
import { useTodayUsage, useUsageBudget } from '@/lib/queries/usage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertTriangle } from '@tabler/icons-react';

export function DashboardUsageHeader() {
  const { data: todayData, isLoading: todayLoading, error: todayError } = useTodayUsage();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useUsageBudget();

  // Show loading state
  if (todayLoading || budgetLoading) {
    return <UsageHeaderSkeleton />;
  }

  // Show error state
  if (todayError || budgetError) {
    return (
      <Alert className="mb-6">
        <IconAlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load usage summary. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border-border bg-card/50 mb-6 rounded-lg border p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Usage Summary</h3>
          <p className="text-muted-foreground text-sm">
            Real-time token consumption and cost tracking
            {todayData && Number(todayData.total_tokens) > 0 && (
              <span className="ml-2 text-primary font-medium">
                {Number(todayData.total_tokens).toLocaleString()} tokens today
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TokenCounter variant="expanded" showBudget={true} />
        </div>
      </div>
    </div>
  );
}