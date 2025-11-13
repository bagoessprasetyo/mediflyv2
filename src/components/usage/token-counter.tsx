'use client';

import React, { useState } from 'react';
import { 
  IconCoin, 
  IconEye, 
  IconEyeOff, 
  IconTrendingUp, 
  IconTrendingDown,
  IconActivity,
  IconCurrencyDollar,
  IconClock,
  IconSettings,
  IconX
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useTokenUsage } from '@/contexts/token-usage-context';
import { useTodayUsage, useUsageBudget } from '@/lib/queries/usage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenCounterProps {
  variant?: 'compact' | 'expanded' | 'minimal';
  showBudget?: boolean;
  className?: string;
}

export function TokenCounter({ 
  variant = 'compact', 
  showBudget = true,
  className 
}: TokenCounterProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { 
    todayUsage: contextUsage, 
    budget: contextBudget,
    isRealTimeEnabled,
    toggleRealTime,
    getBudgetPercentage
  } = useTokenUsage();
  
  // Fallback to query data if context doesn't have data yet
  const { data: queryUsage } = useTodayUsage();
  const { data: queryBudget } = useUsageBudget();
  
  const usage = contextUsage || queryUsage;
  const budget = contextBudget || queryBudget;

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Calculate budget status
  const dailyPercentage = budget ? getBudgetPercentage('daily') : 0;
  const monthlyPercentage = budget ? getBudgetPercentage('monthly') : 0;

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBudgetBgColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500/10 border-red-500/20';
    if (percentage >= 80) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('flex items-center gap-2', className)}>
              <div className="flex items-center gap-1">
                <IconCoin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">
                  {isVisible ? (usage?.total_tokens || 0).toLocaleString() : '***'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconCurrencyDollar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-mono">
                  {isVisible ? `$${(usage?.total_cost || 0).toFixed(4)}` : '***'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <IconEye className="h-3 w-3" />
                ) : (
                  <IconEyeOff className="h-3 w-3" />
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Today's usage: {(usage?.total_tokens || 0).toLocaleString()} tokens</p>
            <p>Cost: ${(usage?.total_cost || 0).toFixed(4)}</p>
            {budget && (
              <p>Daily budget: {dailyPercentage.toFixed(1)}% used</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('w-fit', className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-4">
            {/* Tokens */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded">
                <IconCoin className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tokens</div>
                <div className="text-sm font-mono font-semibold">
                  {isVisible ? (usage?.total_tokens || 0).toLocaleString() : '***'}
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/10 rounded">
                <IconCurrencyDollar className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Cost</div>
                <div className="text-sm font-mono font-semibold">
                  {isVisible ? `$${(usage?.total_cost || 0).toFixed(4)}` : '***'}
                </div>
              </div>
            </div>

            {/* Requests */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded">
                <IconActivity className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Requests</div>
                <div className="text-sm font-mono font-semibold">
                  {isVisible ? (usage?.request_count || 0).toLocaleString() : '***'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 pl-2 border-l">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <IconEye className="h-3 w-3" />
                ) : (
                  <IconEyeOff className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={toggleRealTime}
              >
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'
                )} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded variant
  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Today's Usage</h3>
            <Badge variant={isRealTimeEnabled ? 'default' : 'secondary'}>
              <div className={cn(
                'w-2 h-2 rounded-full mr-1',
                isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'
              )} />
              {isRealTimeEnabled ? 'Live' : 'Static'}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="h-8"
            >
              {isVisible ? (
                <>
                  <IconEye className="h-4 w-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <IconEyeOff className="h-4 w-4 mr-1" />
                  Show
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRealTime}
              className="h-8"
            >
              <IconSettings className="h-4 w-4 mr-1" />
              {isRealTimeEnabled ? 'Disable' : 'Enable'} Live
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tokens */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <IconCoin className="h-5 w-5 text-blue-500" />
              <div className="flex items-center gap-1">
                <IconTrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+12%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Tokens</div>
              <div className="text-xl font-mono font-bold">
                {isVisible ? (usage?.total_tokens || 0).toLocaleString() : '***'}
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <IconCurrencyDollar className="h-5 w-5 text-green-500" />
              <div className="flex items-center gap-1">
                <IconTrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">-5%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Cost</div>
              <div className="text-xl font-mono font-bold">
                {isVisible ? `$${(usage?.total_cost || 0).toFixed(4)}` : '***'}
              </div>
            </div>
          </div>

          {/* Request Count */}
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <IconActivity className="h-5 w-5 text-purple-500" />
              <div className="flex items-center gap-1">
                <IconTrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+8%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Requests</div>
              <div className="text-xl font-mono font-bold">
                {isVisible ? (usage?.request_count || 0).toLocaleString() : '***'}
              </div>
            </div>
          </div>

          {/* Average Tokens */}
          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <IconClock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Avg per Request</div>
              <div className="text-xl font-mono font-bold">
                {isVisible ? Math.round(usage?.avg_tokens_per_request || 0).toLocaleString() : '***'}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Status */}
        {showBudget && budget && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium">Budget Status</h4>
            
            {/* Daily Budget */}
            <div className={cn(
              'p-3 rounded-lg border',
              getBudgetBgColor(dailyPercentage)
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Budget</span>
                <span className={cn('text-sm font-mono', getBudgetColor(dailyPercentage))}>
                  {dailyPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      dailyPercentage >= 100 ? 'bg-red-500' :
                      dailyPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  ${budget.current_daily_spend.toFixed(4)} / ${budget.daily_limit_usd.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className={cn(
              'p-3 rounded-lg border',
              getBudgetBgColor(monthlyPercentage)
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Budget</span>
                <span className={cn('text-sm font-mono', getBudgetColor(monthlyPercentage))}>
                  {monthlyPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      monthlyPercentage >= 100 ? 'bg-red-500' :
                      monthlyPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  ${budget.current_monthly_spend.toFixed(4)} / ${budget.monthly_limit_usd.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Most Used Action */}
        {usage?.most_used_action && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Most Used Action Today</div>
            <div className="font-medium capitalize">
              {usage.most_used_action.replace(/_/g, ' ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Usage alerts component
export function UsageAlerts() {
  const { alerts, dismissAlert } = useTokenUsage();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            'p-3 rounded-lg border flex items-start justify-between',
            alert.type === 'danger' && 'bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-100',
            alert.type === 'warning' && 'bg-yellow-500/10 border-yellow-500/20 text-yellow-900 dark:text-yellow-100',
            alert.type === 'info' && 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-100'
          )}
        >
          <div className="flex-1">
            <div className="font-medium text-sm">{alert.title}</div>
            <div className="text-sm mt-1">{alert.message}</div>
          </div>
          {alert.dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-2"
              onClick={() => dismissAlert(alert.id)}
            >
              <IconX className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}