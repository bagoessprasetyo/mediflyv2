'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function FacilityFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" /> {/* "Basic Information" title */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Facility Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>

          {/* Category and Icon row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>

          {/* Availability and Capacity row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox */}
                <Skeleton className="h-4 w-24" /> {/* Text */}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Associations Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" /> {/* "Hospital Associations" title */}
            <Skeleton className="h-8 w-32" /> {/* "Add Hospital" button */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hospital relationship items */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" /> {/* Star icon placeholder */}
                  <Skeleton className="h-5 w-24" /> {/* "Primary Hospital" text */}
                </div>
                <Skeleton className="h-8 w-8 rounded" /> {/* Remove button */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hospital selection */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Select dropdown */}
                </div>

                {/* Access level */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Select dropdown */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost sharing */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" /> {/* Label */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 flex-1" /> {/* Input */}
                    <Skeleton className="h-4 w-4" /> {/* % symbol */}
                  </div>
                </div>

                {/* Primary hospital checkbox */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" /> {/* Label */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-32" /> {/* Text */}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" /> {/* Label */}
                <Skeleton className="h-20 w-full" /> {/* Textarea */}
              </div>

              {index < 1 && <Separator className="mt-4" />}
            </div>
          ))}

          {/* Empty state skeleton when no hospitals */}
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <Skeleton className="h-12 w-12 rounded mx-auto mb-3" /> {/* Icon */}
            <Skeleton className="h-4 w-48 mx-auto mb-2" /> {/* Main text */}
            <Skeleton className="h-3 w-64 mx-auto mb-4" /> {/* Description */}
            <Skeleton className="h-9 w-36 mx-auto" /> {/* "Add First Hospital" button */}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-6">
        <Skeleton className="h-10 w-full sm:w-32" /> {/* Submit button */}
        <Skeleton className="h-10 w-full sm:w-20" /> {/* Cancel button */}
      </div>

      {/* Validation Message Skeleton */}
      <div className="flex items-start gap-2 p-3 border border-orange-200 rounded-md bg-orange-50">
        <Skeleton className="h-4 w-4 rounded-full mt-0.5" /> {/* Alert icon */}
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-48" /> {/* Message line 1 */}
          <Skeleton className="h-3 w-72" /> {/* Message line 2 */}
        </div>
      </div>
    </div>
  );
}

export function FacilityFormLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      <FacilityFormSkeleton />
    </div>
  );
}