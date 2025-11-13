// Hospital Skeleton Components Index
// Consolidates all hospital-related skeleton components for easy importing

export { HospitalFormSkeleton, HospitalFormLoadingSkeleton } from './hospital-form-skeleton';
export { HospitalTableSkeleton, HospitalPageSkeleton } from './hospital-table-skeleton';
export { HospitalDetailSkeleton } from './hospital-detail-skeleton';

// Additional skeleton components for specific hospital page layouts

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Additional specialized skeleton components

// Hospital card skeleton for grid layouts
export function HospitalCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-[60px]" />
          <Skeleton className="h-5 w-[50px]" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[90px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Search results skeleton
export function HospitalSearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-[160px]" />
        <Skeleton className="h-5 w-[100px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <HospitalCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Hospital navigation skeleton
export function HospitalNavigationSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" /> {/* Search bar */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hospital embedding skeleton for analytics pages
export function HospitalEmbeddingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[160px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-6 w-[60px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}