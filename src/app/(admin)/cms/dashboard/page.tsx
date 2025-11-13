'use client';

import { Suspense } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { EnhancedUsageChart } from "@/components/enhanced-usage-chart";
import { DataTable } from "@/components/data-table";
import { DashboardUsageHeader } from "@/components/dashboard-usage-header";
import { HealthcareMetricsCards } from "@/components/healthcare-metrics-cards";
import { UsageDashboardCards } from "@/components/usage-dashboard-cards";
import { DashboardSkeleton, QuickDashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { AreaChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { DashboardNavigation } from "@/components/accessible/dashboard-navigation";
import { SkipLinks } from "@/components/accessible/skip-links";
import { OptimizedUsageDashboardCards } from "@/components/optimized/memo-dashboard-cards";

import data from "./data.json";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="px-4 lg:px-6">
      <Alert>
        <IconAlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Something went wrong loading the dashboard: {error.message}</span>
          <Button 
            onClick={resetErrorBoundary} 
            size="sm" 
            variant="outline"
            className="ml-4"
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SkipLinks />
      <DashboardNavigation />
      <main role="main" aria-label="Dashboard" className="space-y-6" tabIndex={-1}>
        {/* Usage Summary Header */}
        

        {/* Healthcare Metrics Cards */}
        <Suspense fallback={<QuickDashboardSkeleton />}>
          <HealthcareMetricsCards />
        </Suspense>

        {/* AI Usage Cards */}
        <Suspense fallback={<QuickDashboardSkeleton />}>
          <OptimizedUsageDashboardCards />
        </Suspense>

        {/* Usage Analytics Chart */}
        <div className="px-4 lg:px-6">
          <Suspense fallback={<AreaChartSkeleton />}>
            <EnhancedUsageChart days={14} />
          </Suspense>
        </div>

        {/* Interactive Chart */}
        <div className="px-4 lg:px-6">
          <Suspense fallback={<AreaChartSkeleton />}>
            <ChartAreaInteractive />
          </Suspense>
        </div>

        {/* Data Table */}
        <div className="px-4 lg:px-6">
          <Suspense fallback={<DataTableSkeleton />}>
            <DataTable data={data} />
          </Suspense>
        </div>
      </main>
    </ErrorBoundary>
  );
}
