'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function HospitalTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" /> {/* "Hospitals" title */}
            <Skeleton className="h-4 w-64" /> {/* Subtitle */}
          </div>
          <Skeleton className="h-10 w-36" /> {/* "Add Hospital" button */}
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-10 w-80" /> {/* Search input */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" /> {/* City filter */}
            <Skeleton className="h-10 w-28" /> {/* Type filter */}
            <Skeleton className="h-10 w-24" /> {/* Status filter */}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Stat label */}
                  <Skeleton className="h-8 w-12" /> {/* Stat value */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded" /> {/* Trend icon */}
                    <Skeleton className="h-3 w-16" /> {/* Trend text */}
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" /> {/* Stat icon */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main table card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" /> {/* "Hospitals" title */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" /> {/* Count badge */}
              <Skeleton className="h-8 w-20" /> {/* Export button */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 p-4 border-b font-medium text-sm">
              <Skeleton className="h-4 w-20" /> {/* Hospital */}
              <Skeleton className="h-4 w-16" /> {/* Type */}
              <Skeleton className="h-4 w-20" /> {/* Location */}
              <Skeleton className="h-4 w-16" /> {/* Beds */}
              <Skeleton className="h-4 w-20" /> {/* Emergency */}
              <Skeleton className="h-4 w-16" /> {/* Status */}
              <Skeleton className="h-4 w-16" /> {/* Actions */}
            </div>
            
            {/* Table rows */}
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-4 p-4 border-b border-border/30 hover:bg-muted/50">
                  {/* Hospital info */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" /> {/* Logo */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" /> {/* Hospital name */}
                      <Skeleton className="h-3 w-28" /> {/* Slug */}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-20 rounded-full" /> {/* Type badge */}
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded" /> {/* Location icon */}
                      <Skeleton className="h-4 w-24" /> {/* City, State */}
                    </div>
                    <Skeleton className="h-3 w-16" /> {/* Address */}
                  </div>

                  {/* Bed count */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" /> {/* Bed icon */}
                    <Skeleton className="h-4 w-8" /> {/* Bed count */}
                  </div>

                  {/* Emergency services */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" /> {/* Emergency icon */}
                    <Skeleton className="h-4 w-8" /> {/* Yes/No */}
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-5 w-12 rounded-full" /> {/* Active badge */}
                    <Skeleton className="h-5 w-16 rounded-full" /> {/* Verified badge */}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded" /> {/* View button */}
                    <Skeleton className="h-8 w-8 rounded" /> {/* More actions */}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Skeleton className="h-4 w-32" /> {/* Results count */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital type breakdown */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" /> {/* "Hospital Type Breakdown" title */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" /> {/* Type icon */}
                  <Skeleton className="h-4 w-20" /> {/* Type name */}
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
    </div>
  );
}

export function HospitalPageSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <HospitalTableSkeleton />
    </div>
  );
}