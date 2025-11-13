import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" /> {/* Filter button */}
            <Skeleton className="h-8 w-24" /> {/* Export button */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-64" /> {/* Search input */}
            <Skeleton className="h-9 w-32" /> {/* Filter dropdown */}
            <Skeleton className="h-9 w-24" /> {/* Status filter */}
          </div>
          
          {/* Table header */}
          <div className="border-b">
            <div className="grid grid-cols-6 gap-4 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-20" />
              ))}
            </div>
          </div>
          
          {/* Table rows */}
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-6 gap-4 p-4 border-b border-border/50">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <div key={colIndex} className="flex items-center">
                    {colIndex === 0 ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ) : colIndex === 5 ? (
                      <Skeleton className="h-6 w-16 rounded-full" /> // Status badge
                    ) : (
                      <Skeleton className="h-4 w-16" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-32" /> {/* Results count */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" /> {/* Previous */}
              <Skeleton className="h-8 w-8" /> {/* Page 1 */}
              <Skeleton className="h-8 w-8" /> {/* Page 2 */}
              <Skeleton className="h-8 w-8" /> {/* Page 3 */}
              <Skeleton className="h-8 w-8" /> {/* Next */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}