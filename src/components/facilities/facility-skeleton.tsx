'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Re-export all facility-related skeletons for easy access
export { FacilityTableSkeleton } from '@/components/skeletons/facility-table-skeleton';
export { FacilityDetailSkeleton } from '@/components/skeletons/facility-detail-skeleton';
export { FacilityFormSkeleton, FacilityFormLoadingSkeleton } from '@/components/skeletons/facility-form-skeleton';

// Card skeleton for facility listings and grids
export function FacilityCardSkeleton() {
  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" /> {/* Facility icon */}
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-32" /> {/* Facility name */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full" /> {/* Category badge */}
            <Skeleton className="h-4 w-16 rounded-full" /> {/* Status badge */}
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded" /> {/* Actions menu */}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Hospital info */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" /> {/* Building icon */}
        <Skeleton className="h-4 w-28" /> {/* Hospital name */}
        <Skeleton className="h-3 w-3 rounded-full" /> {/* Star for primary */}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" /> {/* Users icon */}
          <Skeleton className="h-4 w-12" /> {/* Capacity */}
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" /> {/* "+X more" badge */}
        </div>
      </div>
    </Card>
  );
}

// Stats cards skeleton for dashboard
export function FacilityStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-8 w-12" /> {/* Value */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" /> {/* Trend icon */}
                  <Skeleton className="h-3 w-16" /> {/* Trend text */}
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Category breakdown skeleton
export function FacilityCategoryBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" /> {/* Title */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" /> {/* Category icon */}
                <Skeleton className="h-4 w-20" /> {/* Category name */}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-8" /> {/* Count */}
                  <Skeleton className="h-3 w-8" /> {/* Percentage */}
                </div>
                <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hospital selection skeleton for forms
export function HospitalSelectSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" /> {/* Label */}
      <Skeleton className="h-10 w-full" /> {/* Select dropdown */}
      <div className="text-xs">
        <Skeleton className="h-3 w-24" /> {/* Loading hospitals text */}
      </div>
    </div>
  );
}

// Relationship metadata skeleton
export function RelationshipMetadataSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Access Level label */}
        <Skeleton className="h-10 w-full" /> {/* Select */}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Cost Sharing label */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1" /> {/* Input */}
          <Skeleton className="h-4 w-4" /> {/* % symbol */}
        </div>
      </div>
    </div>
  );
}

// Navigation skeleton for facility pages
export function FacilityNavigationSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" /> {/* Back button */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" /> {/* Icon */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
      </div>
    </div>
  );
}