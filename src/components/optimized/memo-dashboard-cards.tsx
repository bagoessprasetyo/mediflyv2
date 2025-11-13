'use client';

import { memo, useMemo } from 'react';
import { IconCurrencyDollar, IconChartBar, IconAlertTriangle, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodayUsage, useMonthUsage, useUsageBudget } from "@/lib/queries/usage";
import { UsageDashboardCardsSkeleton } from "@/components/skeletons/dashboard-cards-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UsageStats, UsageBudget } from '@/types/usage';

interface UsageCardData {
  todayCost: number;
  monthCost: number;
  todayTokens: number;
  monthTokens: number;
  dailyBudgetUsed: number;
  monthlyBudgetUsed: number;
  costTrend: 'up' | 'down';
  tokenTrend: 'up' | 'down';
  budgetStatus: 'warning' | 'normal';
  costChange: number;
  tokenChange: number;
}

interface UsageCardProps {
  title: string;
  value: string;
  badge: {
    variant: "outline" | "default" | "destructive";
    icon: any;
    text: string;
  };
  footer: {
    main: string;
    sub: string;
    icon: any;
  };
}

const UsageCard = memo(({ title, value, badge, footer }: UsageCardProps) => (
  <Card className="@container/card">
    <CardHeader>
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value}
      </CardTitle>
      <CardAction>
        <Badge variant={badge.variant}>
          <badge.icon />
          {badge.text}
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        {footer.main}
        <footer.icon className="size-4" />
      </div>
      <div className="text-muted-foreground">
        {footer.sub}
      </div>
    </CardFooter>
  </Card>
));
UsageCard.displayName = 'UsageCard';

function calculateUsageStats(
  todayData: UsageStats | null | undefined,
  monthData: UsageStats | null | undefined,
  budget: UsageBudget | null | undefined
): UsageCardData {
  const todayCost = Number(todayData?.total_cost) || 0;
  const monthCost = Number(monthData?.total_cost) || 0;
  const todayTokens = Number(todayData?.total_tokens) || 0;
  const monthTokens = Number(monthData?.total_tokens) || 0;
  
  const dailyBudgetUsed = budget ? (Number(budget.current_daily_spend) / Number(budget.daily_limit_usd)) * 100 : 0;
  const monthlyBudgetUsed = budget ? (Number(budget.current_monthly_spend) / Number(budget.monthly_limit_usd)) * 100 : 0;
  
  const budgetStatus = dailyBudgetUsed > (budget?.warning_threshold_percent || 80) ? 'warning' : 'normal';
  
  const costTrend = todayCost > (monthCost / 30) ? 'up' : 'down';
  const tokenTrend = todayTokens > (monthTokens / 30) ? 'up' : 'down';
  
  const avgDailyCost = monthCost / 30;
  const costChange = avgDailyCost > 0 ? Math.abs((todayCost - avgDailyCost) / avgDailyCost * 100) : 0;
  
  const avgDailyTokens = monthTokens / 30;
  const tokenChange = avgDailyTokens > 0 ? Math.abs((todayTokens - avgDailyTokens) / avgDailyTokens * 100) : 0;
  
  return {
    todayCost,
    monthCost,
    todayTokens,
    monthTokens,
    dailyBudgetUsed,
    monthlyBudgetUsed,
    costTrend,
    tokenTrend,
    budgetStatus,
    costChange,
    tokenChange,
  };
}

export const OptimizedUsageDashboardCards = memo(() => {
  const { data: todayData, isLoading: todayLoading, error: todayError } = useTodayUsage();
  const { data: monthData, isLoading: monthLoading, error: monthError } = useMonthUsage();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useUsageBudget();

  const stats = useMemo(() => 
    calculateUsageStats(todayData, monthData, budget),
    [todayData, monthData, budget]
  );

  const cardData = useMemo(() => [
    {
      title: "Today's AI Cost",
      value: `$${stats.todayCost.toFixed(4)}`,
      badge: {
        variant: "outline" as const,
        icon: stats.costTrend === 'up' ? IconTrendingUp : IconTrendingDown,
        text: `${stats.costTrend === 'up' ? '+' : ''}${stats.costChange.toFixed(1)}%`
      },
      footer: {
        main: stats.costTrend === 'up' ? 'Increased usage today' : 'Decreased usage today',
        sub: 'Daily spend tracking',
        icon: stats.costTrend === 'up' ? IconTrendingUp : IconTrendingDown
      }
    },
    {
      title: "Monthly AI Cost",
      value: `$${stats.monthCost.toFixed(2)}`,
      badge: {
        variant: "outline" as const,
        icon: stats.monthCost > 0 ? IconTrendingUp : IconTrendingDown,
        text: 'Monthly Tracking'
      },
      footer: {
        main: 'Monthly spending trend',
        sub: 'Cost optimization insights',
        icon: IconChartBar
      }
    },
    {
      title: "Tokens Today",
      value: stats.todayTokens.toLocaleString(),
      badge: {
        variant: "outline" as const,
        icon: stats.tokenTrend === 'up' ? IconTrendingUp : IconTrendingDown,
        text: `${stats.tokenTrend === 'up' ? '+' : ''}${stats.tokenChange.toFixed(0)}%`
      },
      footer: {
        main: 'Token consumption rate',
        sub: 'API usage monitoring',
        icon: stats.tokenTrend === 'up' ? IconTrendingUp : IconTrendingDown
      }
    },
    {
      title: "Budget Usage",
      value: `${stats.dailyBudgetUsed.toFixed(1)}%`,
      badge: {
        variant: stats.budgetStatus === 'warning' ? 'destructive' as const : 'outline' as const,
        icon: stats.budgetStatus === 'warning' ? IconAlertTriangle : IconCurrencyDollar,
        text: stats.budgetStatus === 'warning' ? 'Warning' : 'Normal'
      },
      footer: {
        main: stats.budgetStatus === 'warning' ? 'Approaching daily limit' : 'Within budget',
        sub: `Daily: $${Number(budget?.current_daily_spend || 0).toFixed(2)} / $${Number(budget?.daily_limit_usd || 0).toFixed(2)}`,
        icon: stats.budgetStatus === 'warning' ? IconAlertTriangle : IconCurrencyDollar
      }
    }
  ], [stats, budget]);

  if (todayLoading || monthLoading || budgetLoading) {
    return <UsageDashboardCardsSkeleton />;
  }

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
      {cardData.map((card, index) => (
        <UsageCard key={`${card.title}-${index}`} {...card} />
      ))}
    </div>
  );
});

OptimizedUsageDashboardCards.displayName = 'OptimizedUsageDashboardCards';