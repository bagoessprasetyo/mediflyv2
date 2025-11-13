'use client';

import { useUsageChartData } from "@/lib/queries/usage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertTriangle, IconChartArea } from "@tabler/icons-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{format(new Date(label || ''), 'MMM dd, yyyy')}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey === 'tokens' ? 'Tokens:' : 'Cost:'}</span>
              <span className="font-medium">
                {entry.dataKey === 'tokens' 
                  ? entry.value.toLocaleString() 
                  : `$${Number(entry.value).toFixed(4)}`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function EnhancedUsageChart({ days = 7 }: { days?: number }) {
  const { data: chartData, isLoading, error } = useUsageChartData(days);

  if (isLoading) {
    return <AreaChartSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="h-5 w-5" />
            Chart Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <IconAlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load usage chart data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartArea className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
          <CardDescription>
            Token consumption and cost trends over the last {days} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <IconChartArea className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No usage data available</p>
            <p className="text-sm">Start using the application to see analytics here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTokens = chartData.reduce((sum, item) => sum + item.tokens, 0);
  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0);
  const totalRequests = chartData.reduce((sum, item) => sum + item.requests, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconChartArea className="h-5 w-5" />
              Usage Analytics
            </CardTitle>
            <CardDescription>
              Token consumption and cost trends over the last {days} days
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              {totalTokens.toLocaleString()} tokens
            </Badge>
            <Badge variant="outline">
              ${totalCost.toFixed(4)} total
            </Badge>
            <Badge variant="outline">
              {totalRequests} requests
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              className="text-muted-foreground"
            />
            <YAxis 
              yAxisId="tokens"
              orientation="left"
              tickFormatter={(value) => value.toLocaleString()}
              className="text-muted-foreground"
            />
            <YAxis 
              yAxisId="cost"
              orientation="right"
              tickFormatter={(value) => `$${value.toFixed(3)}`}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="tokens"
              type="monotone"
              dataKey="tokens"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              name="Tokens Used"
            />
            <Area
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stackId="2"
              stroke="hsl(var(--destructive))"
              fill="hsl(var(--destructive))"
              fillOpacity={0.6}
              name="Cost (USD)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}