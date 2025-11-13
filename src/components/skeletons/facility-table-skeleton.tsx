import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FacilityTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        
        {/* Filter bar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-64" /> {/* Search */}
          <Skeleton className="h-9 w-40" /> {/* Hospital filter */}
          <Skeleton className="h-9 w-32" /> {/* Category filter */}
          <Skeleton className="h-9 w-28" /> {/* Status filter */}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" /> {/* "Category Breakdown" title */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" /> {/* Category icon */}
                  <Skeleton className="h-4 w-20" /> {/* Category name */}
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-6 w-8" /> {/* Count */}
                  <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-6 gap-4 p-4 border-b">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-20" />
              ))}
            </div>
            
            {/* Table rows */}
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-6 gap-4 p-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" /> {/* Building icon */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-4 w-32" /> {/* Hospital name */}
                          <Skeleton className="h-3 w-3 rounded-full" /> {/* Star icon */}
                        </div>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-3 rounded-full" /> {/* Location icon */}
                          <Skeleton className="h-3 w-20" /> {/* City, State */}
                        </div>
                      </div>
                    </div>
                    {/* Additional hospitals badge */}
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-5 w-12 rounded-full" /> {/* "+X more" badge */}
                      <Skeleton className="h-3 w-16" /> {/* "hospitals" text */}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-18 rounded-full" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}