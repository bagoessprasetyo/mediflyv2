'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  IconCurrencyDollar,
  IconCalendar,
  IconBell,
  IconBellOff,
  IconPercentage,
  IconDeviceFloppy,
  IconArrowBack,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useUsageBudget, useUpdateBudget } from '@/lib/queries/usage';
import { useTokenUsage } from '@/contexts/token-usage-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';

const budgetSchema = z.object({
  daily_limit_usd: z.number().min(0.01, 'Daily limit must be at least $0.01').max(1000, 'Daily limit cannot exceed $1000'),
  monthly_limit_usd: z.number().min(0.01, 'Monthly limit must be at least $0.01').max(10000, 'Monthly limit cannot exceed $10000'),
  notifications_enabled: z.boolean(),
  warning_threshold_percent: z.number().min(50, 'Warning threshold must be at least 50%').max(95, 'Warning threshold cannot exceed 95%'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetManagerProps {
  className?: string;
}

export function BudgetManager({ className }: BudgetManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: budget, isLoading } = useUsageBudget();
  const updateBudget = useUpdateBudget();
  const { getBudgetPercentage } = useTokenUsage();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      daily_limit_usd: budget?.daily_limit_usd || 10.00,
      monthly_limit_usd: budget?.monthly_limit_usd || 300.00,
      notifications_enabled: budget?.notifications_enabled ?? true,
      warning_threshold_percent: budget?.warning_threshold_percent || 80,
    },
  });

  // Update form when budget data loads
  React.useEffect(() => {
    if (budget) {
      reset({
        daily_limit_usd: budget.daily_limit_usd,
        monthly_limit_usd: budget.monthly_limit_usd,
        notifications_enabled: budget.notifications_enabled,
        warning_threshold_percent: budget.warning_threshold_percent,
      });
    }
  }, [budget, reset]);

  const watchedValues = watch();
  const dailyPercentage = budget ? getBudgetPercentage('daily') : 0;
  const monthlyPercentage = budget ? getBudgetPercentage('monthly') : 0;

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await updateBudget.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleCancel = () => {
    if (budget) {
      reset({
        daily_limit_usd: budget.daily_limit_usd,
        monthly_limit_usd: budget.monthly_limit_usd,
        notifications_enabled: budget.notifications_enabled,
        warning_threshold_percent: budget.warning_threshold_percent,
      });
    }
    setIsEditing(false);
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'text-red-500', bg: 'bg-red-500', label: 'Over Budget', variant: 'destructive' as const };
    if (percentage >= watchedValues.warning_threshold_percent) return { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Warning', variant: 'secondary' as const };
    return { color: 'text-green-500', bg: 'bg-green-500', label: 'On Track', variant: 'default' as const };
  };

  const dailyStatus = getBudgetStatus(dailyPercentage);
  const monthlyStatus = getBudgetStatus(monthlyPercentage);

  // Preset budget options
  const presets = [
    { name: 'Conservative', daily: 5, monthly: 100 },
    { name: 'Moderate', daily: 15, monthly: 300 },
    { name: 'Aggressive', daily: 50, monthly: 1000 },
    { name: 'Enterprise', daily: 100, monthly: 2500 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setValue('daily_limit_usd', preset.daily);
    setValue('monthly_limit_usd', preset.monthly);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Budget Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Daily Budget</span>
              </div>
              <Badge variant={dailyStatus.variant}>
                {dailyStatus.label}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Used / Limit</span>
                <span className="text-sm font-mono">
                  ${budget?.current_daily_spend.toFixed(4) || '0.0000'} / ${budget?.daily_limit_usd.toFixed(2) || '0.00'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn('h-2 rounded-full transition-all duration-300', dailyStatus.bg)}
                    style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className={cn('text-sm font-medium', dailyStatus.color)}>
                    {dailyPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Monthly Budget</span>
              </div>
              <Badge variant={monthlyStatus.variant}>
                {monthlyStatus.label}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Used / Limit</span>
                <span className="text-sm font-mono">
                  ${budget?.current_monthly_spend.toFixed(4) || '0.0000'} / ${budget?.monthly_limit_usd.toFixed(2) || '0.00'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn('h-2 rounded-full transition-all duration-300', monthlyStatus.bg)}
                    style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className={cn('text-sm font-medium', monthlyStatus.color)}>
                    {monthlyPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconCurrencyDollar className="h-5 w-5" />
              Budget Settings
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Preset Buttons */}
            {isEditing && (
              <div className="space-y-3">
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs"
                    >
                      {preset.name}
                      <div className="text-xs text-muted-foreground ml-1">
                        ${preset.daily}/d
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="daily_limit_usd">Daily Limit (USD)</Label>
                <div className="relative">
                  <IconCurrencyDollar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="daily_limit_usd"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000"
                    placeholder="10.00"
                    className="pl-9"
                    disabled={!isEditing}
                    {...register('daily_limit_usd', { valueAsNumber: true })}
                  />
                </div>
                {errors.daily_limit_usd && (
                  <p className="text-sm text-destructive">{errors.daily_limit_usd.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_limit_usd">Monthly Limit (USD)</Label>
                <div className="relative">
                  <IconCurrencyDollar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthly_limit_usd"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10000"
                    placeholder="300.00"
                    className="pl-9"
                    disabled={!isEditing}
                    {...register('monthly_limit_usd', { valueAsNumber: true })}
                  />
                </div>
                {errors.monthly_limit_usd && (
                  <p className="text-sm text-destructive">{errors.monthly_limit_usd.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Warning Threshold */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="warning_threshold_percent">Warning Threshold</Label>
                <div className="flex items-center gap-2">
                  <IconPercentage className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">
                    {watchedValues.warning_threshold_percent}%
                  </span>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Slider
                    value={[watchedValues.warning_threshold_percent]}
                    onValueChange={([value]) => setValue('warning_threshold_percent', value)}
                    min={50}
                    max={95}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm">
                    Receive alerts when usage reaches {budget?.warning_threshold_percent}% of your budget
                  </div>
                </div>
              )}
              
              {errors.warning_threshold_percent && (
                <p className="text-sm text-destructive">{errors.warning_threshold_percent.message}</p>
              )}
            </div>

            <Separator />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications_enabled" className="flex items-center gap-2">
                  {watchedValues.notifications_enabled ? (
                    <IconBell className="h-4 w-4" />
                  ) : (
                    <IconBellOff className="h-4 w-4" />
                  )}
                  Budget Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when approaching budget limits
                </p>
              </div>
              <Switch
                id="notifications_enabled"
                checked={watchedValues.notifications_enabled}
                onCheckedChange={(checked) => setValue('notifications_enabled', checked)}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || updateBudget.isPending}
                  className="flex-1"
                >
                  <IconDeviceFloppy className="h-4 w-4 mr-2" />
                  {updateBudget.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateBudget.isPending}
                  className="flex-1"
                >
                  <IconArrowBack className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Budget Warnings */}
      {(dailyPercentage >= 80 || monthlyPercentage >= 80) && (
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {dailyPercentage >= 100 || monthlyPercentage >= 100 ? (
              <span>
                You have exceeded your budget limits. Consider increasing your limits or reducing usage.
              </span>
            ) : (
              <span>
                You're approaching your budget limits. 
                {dailyPercentage >= 80 && ` Daily: ${dailyPercentage.toFixed(1)}%`}
                {monthlyPercentage >= 80 && ` Monthly: ${monthlyPercentage.toFixed(1)}%`}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Info */}
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p>Budget limits help you control your AI usage costs.</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Budgets reset automatically (daily at midnight, monthly on the 1st)</li>
              <li>• Warnings are sent at your chosen threshold percentage</li>
              <li>• Usage continues even after exceeding limits (no automatic stopping)</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}