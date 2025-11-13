import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {/* Chart area skeleton */}
          <div className="flex h-full items-end justify-between gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Skeleton 
                  className="w-8 rounded-sm" 
                  style={{ 
                    height: `${Math.random() * 100 + 50}px` 
                  }} 
                />
                <Skeleton className="h-3 w-6" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AreaChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Area chart skeleton with curved lines */}
          <div className="relative h-full w-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-8" />
              ))}
            </div>
            {/* Chart area */}
            <div className="ml-12 h-full">
              <div className="flex h-full items-end justify-between">
                {/* Simulated area chart points */}
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Skeleton 
                      className="w-1 rounded-full bg-primary/20" 
                      style={{ 
                        height: `${Math.random() * 200 + 50}px` 
                      }} 
                    />
                  </div>
                ))}
              </div>
              {/* X-axis labels */}
              <div className="mt-2 flex justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-3 w-8" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}