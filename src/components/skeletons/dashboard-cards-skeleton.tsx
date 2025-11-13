import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCardsSkeleton() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-20" />
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-3 w-28" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function UsageDashboardCardsSkeleton() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-28" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-24" />
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-3 w-32" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}