import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FacilityDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>

              {/* Associated Hospitals */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" /> {/* Building icon */}
                    <Skeleton className="h-6 w-48" /> {/* "Associated Hospitals (X)" title */}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hospital associations */}
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" /> {/* Hospital icon */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-32" /> {/* Hospital name */}
                            {index === 0 && (
                              <div className="flex items-center gap-1">
                                <Skeleton className="h-4 w-4 rounded-full" /> {/* Star icon */}
                                <Skeleton className="h-5 w-16 rounded-full" /> {/* Primary badge */}
                              </div>
                            )}
                            <Skeleton className="h-5 w-20 rounded-full" /> {/* Access level badge */}
                          </div>
                          <Skeleton className="h-4 w-28" /> {/* City, State */}
                          <Skeleton className="h-5 w-24 rounded-full" /> {/* Hospital type badge */}
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-4 w-20" /> {/* Cost sharing percentage */}
                          <Skeleton className="h-3 w-32" /> {/* Notes */}
                        </div>
                      </div>
                      
                      {/* Primary hospital details */}
                      {index === 0 && (
                        <>
                          <Skeleton className="h-px w-full" /> {/* Separator */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-28" /> {/* Emergency Services label */}
                              <Skeleton className="h-4 w-16" /> {/* Available/Not available */}
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-12" /> {/* Contact label */}
                              <Skeleton className="h-4 w-24" /> {/* Phone number */}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Empty state skeleton */}
                  <div className="text-center py-8 text-muted-foreground hidden">
                    <Skeleton className="h-12 w-12 mx-auto mb-2 rounded-full" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="text-center space-y-2">
                          <Skeleton className="h-8 w-12 mx-auto" />
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full rounded" />
                  ))}
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-18" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Facilities */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}