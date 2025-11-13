'use client';

import { IconCurrencyDollar, IconChartBar, IconAlertTriangle, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodayUsage, useMonthUsage, useUsageBudget } from "@/lib/queries/usage";
import { UsageDashboardCardsSkeleton } from "@/components/skeletons/dashboard-cards-skeleton";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UsageDashboardCards() {
  // Fetch real data from database
  const { data: todayData, isLoading: todayLoading, error: todayError } = useTodayUsage();
  const { data: monthData, isLoading: monthLoading, error: monthError } = useMonthUsage();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useUsageBudget();

  // Calculate yesterday's data for trend comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
  const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayCost = todayData?.total_cost || 0;
    const monthCost = monthData?.total_cost || 0;
    const todayTokens = Number(todayData?.total_tokens) || 0;
    const monthTokens = Number(monthData?.total_tokens) || 0;
    
    const dailyBudgetUsed = budget ? (Number(budget.current_daily_spend) / Number(budget.daily_limit_usd)) * 100 : 0;
    const monthlyBudgetUsed = budget ? (Number(budget.current_monthly_spend) / Number(budget.monthly_limit_usd)) * 100 : 0;
    
    // Determine budget status
    const budgetStatus = dailyBudgetUsed > (budget?.warning_threshold_percent || 80) ? 'warning' : 'normal';
    
    // Calculate simple trends based on current usage
    const costTrend = todayCost > (monthCost / 30) ? 'up' : 'down';
    const tokenTrend = todayTokens > (monthTokens / 30) ? 'up' : 'down';
    
    // Calculate percentage changes
    const avgDailyCost = monthCost / 30;
    const costChange = avgDailyCost > 0 ? ((todayCost - avgDailyCost) / avgDailyCost * 100) : 0;
    
    const avgDailyTokens = monthTokens / 30;
    const tokenChange = avgDailyTokens > 0 ? ((todayTokens - avgDailyTokens) / avgDailyTokens * 100) : 0;
    
    return {
      todayCost: Number(todayCost),
      monthCost: Number(monthCost),
      todayTokens,
      monthTokens,
      dailyBudgetUsed,
      monthlyBudgetUsed,
      costTrend,
      tokenTrend,
      budgetStatus,
      costChange: Math.abs(costChange),
      tokenChange: Math.abs(tokenChange),
    };
  }, [todayData, monthData, budget]);

  // Show loading state
  if (todayLoading || monthLoading || budgetLoading) {
    return <UsageDashboardCardsSkeleton />;
  }

  // Show error state
  if (todayError || monthError || budgetError) {
    return (
      <div className="px-4 lg:px-6">
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load usage data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Today's Token Cost */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today's AI Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${stats.todayCost.toFixed(4)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.costTrend === 'up' ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.costTrend === 'up' ? '+' : ''}{stats.costChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.costTrend === 'up' ? 'Increased usage today' : 'Decreased usage today'}
            {stats.costTrend === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Daily spend tracking
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Token Cost */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly AI Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${stats.monthCost.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.monthCost > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              Monthly Tracking
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Monthly spending trend <IconChartBar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Cost optimization insights
          </div>
        </CardFooter>
      </Card>

      {/* Token Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tokens Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.todayTokens.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.tokenTrend === 'up' ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.tokenTrend === 'up' ? '+' : ''}{stats.tokenChange.toFixed(0)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Token consumption rate
            {stats.tokenTrend === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            API usage monitoring
          </div>
        </CardFooter>
      </Card>

      {/* Budget Status */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Budget Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.dailyBudgetUsed.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant={stats.budgetStatus === 'warning' ? 'destructive' : 'outline'}>
              {stats.budgetStatus === 'warning' ? <IconAlertTriangle /> : <IconCurrencyDollar />}
              {stats.budgetStatus === 'warning' ? 'Warning' : 'Normal'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.budgetStatus === 'warning' ? 'Approaching daily limit' : 'Within budget'}
            {stats.budgetStatus === 'warning' ? <IconAlertTriangle className="size-4" /> : <IconCurrencyDollar className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Daily: ${Number(budget?.current_daily_spend || 0).toFixed(2)} / ${Number(budget?.daily_limit_usd || 0).toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}