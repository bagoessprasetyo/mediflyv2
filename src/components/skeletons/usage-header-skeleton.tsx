import { Skeleton } from "@/components/ui/skeleton";

export function UsageHeaderSkeleton() {
  return (
    <div className="border-border bg-card/50 mb-6 rounded-lg border p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Description */}
        </div>
        <div className="flex items-center gap-4">
          {/* Token Counter Skeleton */}
          <div className="flex items-center gap-6 rounded-lg border bg-card p-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" /> {/* Label */}
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-20" /> {/* Value */}
                <Skeleton className="h-4 w-12" /> {/* Unit */}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" /> {/* Cost label */}
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-16" /> {/* Cost value */}
                <Skeleton className="h-4 w-8" /> {/* Currency */}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-14" /> {/* Budget label */}
              <div className="space-y-1">
                <Skeleton className="h-2 w-24" /> {/* Progress bar */}
                <Skeleton className="h-3 w-20" /> {/* Budget text */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}