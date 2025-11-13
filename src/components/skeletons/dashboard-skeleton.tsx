import { DashboardCardsSkeleton, UsageDashboardCardsSkeleton } from "./dashboard-cards-skeleton";
import { UsageHeaderSkeleton } from "./usage-header-skeleton";
import { AreaChartSkeleton } from "./chart-skeleton";
import { DataTableSkeleton } from "./data-table-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Usage header skeleton */}
      <div className="px-4 lg:px-6">
        <UsageHeaderSkeleton />
      </div>
      
      {/* Main metrics cards skeleton */}
      <DashboardCardsSkeleton />
      
      {/* Usage cards skeleton */}
      <UsageDashboardCardsSkeleton />
      
      {/* Chart skeleton */}
      <div className="px-4 lg:px-6">
        <AreaChartSkeleton />
      </div>
      
      {/* Data table skeleton */}
      <div className="px-4 lg:px-6">
        <DataTableSkeleton />
      </div>
    </div>
  );
}

export function QuickDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="px-4 lg:px-6">
        <UsageHeaderSkeleton />
      </div>
      <DashboardCardsSkeleton />
    </div>
  );
}