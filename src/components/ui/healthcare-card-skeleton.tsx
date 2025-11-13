import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthcareCardSkeletonProps {
  className?: string;
}

export const HealthcareCardSkeleton = ({ className }: HealthcareCardSkeletonProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-lg',
        className
      )}
    >
      {/* Image Carousel Section Skeleton - 264px height to match real card */}
      <div className="relative h-64 bg-gray-100">
        <Skeleton className="absolute inset-0 rounded-none bg-gray-300" />
        
        {/* Top Badges Skeleton */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
          <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
        
        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-12 rounded-full bg-gray-200" />
        </div>

        {/* Pagination Dots Skeleton */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <Skeleton className="h-1.5 w-4 rounded-full bg-gray-200" />
          <Skeleton className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          <Skeleton className="h-1.5 w-1.5 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-5 space-y-4">
        {/* Title and Top Rated Badge */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-7 w-48 bg-gray-200" />
          <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
        </div>

        {/* Date Range and Host Type */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24 bg-gray-200" />
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-3/4 bg-gray-200" />
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <Skeleton className="h-5 w-28 bg-gray-200" />
            <Skeleton className="h-3 w-20 mt-1 bg-gray-200" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
};