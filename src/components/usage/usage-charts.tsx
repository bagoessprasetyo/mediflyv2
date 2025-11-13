'use client';

import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconEqual,
  IconCalendar,
  IconChartArea,
  IconChartBar,
  IconChartPie,
  IconRefresh,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useUsageChartData, useUsageByAction } from '@/lib/queries/usage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UsageChartsProps {
  className?: string;
  defaultPeriod?: number;
}

export function UsageCharts({ className, defaultPeriod = 7 }: UsageChartsProps) {
  const [period, setPeriod] = useState(defaultPeriod);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  
  const { data: chartData, isLoading: chartLoading, refetch: refetchChart } = useUsageChartData(period);
  const { data: actionData, isLoading: actionLoading, refetch: refetchAction } = useUsageByAction(30);

  const handleRefresh = () => {
    refetchChart();
    refetchAction();
  };

  // Calculate trend
  const getTrend = () => {
    if (!chartData || chartData.length < 2) return null;
    
    const recent = chartData.slice(-3).reduce((sum, day) => sum + day.cost, 0) / 3;
    const previous = chartData.slice(-6, -3).reduce((sum, day) => sum + day.cost, 0) / 3;
    
    if (previous === 0) return null;
    
    const change = ((recent - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const trend = getTrend();

  // Chart colors
  const colors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    muted: '#6b7280',
  };

  const actionColors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
  ];

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-mono">
                {entry.dataKey === 'cost' 
                  ? `$${entry.value.toFixed(4)}`
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1 capitalize">
            {data.action.replace(/_/g, ' ')}
          </p>
          <div className="space-y-1 text-xs">
            <div>Tokens: {data.tokens.toLocaleString()}</div>
            <div>Cost: ${data.cost.toFixed(4)}</div>
            <div>Requests: {data.requests.toLocaleString()}</div>
            <div>Share: {data.percentage.toFixed(1)}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartLoading || actionLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-64 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Usage Analytics</h2>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' && <IconTrendingUp className="h-4 w-4 text-red-500" />}
              {trend.direction === 'down' && <IconTrendingDown className="h-4 w-4 text-green-500" />}
              {trend.direction === 'neutral' && <IconEqual className="h-4 w-4 text-muted-foreground" />}
              <span className={cn(
                'text-sm font-medium',
                trend.direction === 'up' && 'text-red-500',
                trend.direction === 'down' && 'text-green-500',
                trend.direction === 'neutral' && 'text-muted-foreground'
              )}>
                {trend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={period.toString()} onValueChange={(value) => setPeriod(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <IconRefresh className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Usage Over Time */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Usage Over Time</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant={chartType === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                >
                  <IconChartArea className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <IconChartBar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    />
                    <YAxis 
                      yAxisId="left"
                      fontSize={12} 
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toFixed(3)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="tokens"
                      stroke={colors.primary}
                      fill={colors.primary}
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="Tokens"
                      yAxisId="left"
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke={colors.success}
                      fill={colors.success}
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="Cost (USD)"
                      yAxisId="right"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="tokens" fill={colors.primary} name="Tokens" />
                    <Bar dataKey="requests" fill={colors.secondary} name="Requests" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage by Action */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <IconChartPie className="h-5 w-5" />
              Usage by Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionData?.slice(0, 8)} // Show top 8 actions
                    dataKey="tokens"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ action, percentage }) => 
                      percentage > 5 ? `${action.replace(/_/g, ' ')}` : ''
                    }
                    labelLine={false}
                  >
                    {actionData?.slice(0, 8).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={actionColors[index % actionColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Action Legend */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {actionData?.slice(0, 8).map((action, index) => (
                <div key={action.action} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: actionColors[index % actionColors.length] }}
                    />
                    <span className="capitalize">{action.action.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{action.percentage.toFixed(1)}%</span>
                    <Badge variant="secondary" className="text-xs">
                      {action.requests}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded">
                <IconTrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Peak Day</div>
                <div className="text-sm font-semibold">
                  {chartData && chartData.length > 0 
                    ? new Date(
                        chartData.reduce((max, day) => 
                          day.tokens > max.tokens ? day : max
                        ).date
                      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded">
                <IconCalendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Daily Cost</div>
                <div className="text-sm font-semibold font-mono">
                  ${chartData && chartData.length > 0 
                    ? (chartData.reduce((sum, day) => sum + day.cost, 0) / chartData.length).toFixed(4)
                    : '0.0000'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded">
                <IconChartBar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Actions</div>
                <div className="text-sm font-semibold">
                  {actionData?.length || 0} types
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded">
                <IconTrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Efficiency</div>
                <div className="text-sm font-semibold">
                  {chartData && chartData.length > 0
                    ? (chartData.reduce((sum, day) => sum + day.tokens, 0) / 
                       chartData.reduce((sum, day) => sum + day.requests, 0)).toFixed(0)
                    : '0'
                  } tok/req
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}