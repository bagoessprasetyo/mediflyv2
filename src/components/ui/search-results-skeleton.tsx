import * as React from 'react';
import { Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { HealthcareCardSkeleton } from './healthcare-card-skeleton';

interface SearchResultsSkeletonProps {
  cardCount?: number;
  className?: string;
}

export const SearchResultsSkeleton = ({ 
  cardCount = 12,
  className 
}: SearchResultsSkeletonProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Tab Navigation Skeleton */}
      <div className="border rounded-md bg-muted p-1 w-fit">
        <div className="flex gap-1">
          {/* Hospitals Tab Skeleton */}
          <div className="px-4 py-2 rounded-sm bg-background shadow-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
              <Skeleton className="h-5 w-8 rounded-full bg-gray-200" />
            </div>
          </div>
          
          {/* Doctors Tab Skeleton */}
          <div className="px-4 py-2 rounded-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-5 w-8 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: cardCount }).map((_, index) => (
          <HealthcareCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};