'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Re-export all hospital-related skeletons for easy access
export { HospitalTableSkeleton, HospitalPageSkeleton } from '@/components/skeletons/hospital-table-skeleton';
export { HospitalDetailSkeleton, HospitalDetailPageSkeleton } from '@/components/skeletons/hospital-detail-skeleton';
export { HospitalFormSkeleton, HospitalFormLoadingSkeleton } from '@/components/skeletons/hospital-form-skeleton';

// Card skeleton for hospital listings and grids
export function HospitalCardSkeleton() {
  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" /> {/* Hospital logo */}
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-36" /> {/* Hospital name */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full" /> {/* Type badge */}
            <Skeleton className="h-4 w-16 rounded-full" /> {/* Status badge */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded" /> {/* Location icon */}
            <Skeleton className="h-3 w-24" /> {/* City, State */}
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded" /> {/* Actions menu */}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-16 rounded-full" />
        ))}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" /> {/* Bed icon */}
            <Skeleton className="h-4 w-8" /> {/* Bed count */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" /> {/* Star icon */}
            <Skeleton className="h-4 w-6" /> {/* Rating */}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded" /> {/* Emergency icon */}
          <Skeleton className="h-4 w-12" /> {/* Emergency services */}
        </div>
      </div>
    </Card>
  );
}

// Stats cards skeleton for dashboard
export function HospitalStatsCardsSkeleton() {
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
                  <Skeleton className="h-3 w-3 rounded" /> {/* Trend icon */}
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

// Hospital type breakdown skeleton
export function HospitalTypeBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" /> {/* Title */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" /> {/* Type icon */}
                <Skeleton className="h-4 w-20" /> {/* Type name */}
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

// Semantic search skeleton for hospitals
export function HospitalSemanticSearchSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" /> {/* "Semantic Search" title */}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Skeleton className="h-10 w-full" /> {/* Search input */}
          <Skeleton className="h-8 w-8 absolute right-2 top-1 rounded" /> {/* Search button */}
        </div>

        {/* Search filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full rounded" />
          ))}
        </div>

        {/* Search results */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" /> {/* Hospital name */}
                  <Skeleton className="h-3 w-24" /> {/* Location */}
                </div>
                <Skeleton className="h-4 w-12" /> {/* Similarity score */}
              </div>
              <Skeleton className="h-3 w-full" /> {/* Description */}
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-16 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Embedding manager skeleton
export function EmbeddingManagerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" /> {/* "Embedding Status" title */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Status icon */}
            <Skeleton className="h-4 w-32" /> {/* Status text */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center space-y-1">
                <Skeleton className="h-6 w-8 mx-auto" /> {/* Stat value */}
                <Skeleton className="h-3 w-16 mx-auto" /> {/* Stat label */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" /> {/* "Actions" title */}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" /> {/* Start indexing button */}
            <Skeleton className="h-9 w-28" /> {/* Reset button */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Reindex label */}
            <Skeleton className="h-9 w-full" /> {/* Reindex input */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Navigation skeleton for hospital pages
export function HospitalNavigationSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" /> {/* Back button */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" /> {/* Logo */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
      </div>
    </div>
  );
}

// Operating hours skeleton
export function OperatingHoursSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" /> {/* "Operating Hours" title */}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" /> {/* Day of week */}
              <Skeleton className="h-4 w-28" /> {/* Hours */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}