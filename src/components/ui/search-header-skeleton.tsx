import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface SearchHeaderSkeletonProps {
  className?: string;
}

export const SearchHeaderSkeleton = ({ className }: SearchHeaderSkeletonProps) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0", className)}>
      <SidebarTrigger />
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-1 bg-gray-200" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-4 w-32 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SearchFiltersSkeletonProps {
  className?: string;
}

export const SearchFiltersSkeletonDesktop = ({ className }: SearchFiltersSkeletonProps) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-6 py-4 shrink-0", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32 bg-gray-200" />
        <Skeleton className="h-10 w-28 bg-gray-200" />
        <Skeleton className="h-10 w-24 bg-gray-200" />
        <Skeleton className="h-10 w-36 bg-gray-200" />
        <Skeleton className="h-10 w-28 bg-gray-200" />
      </div>
    </div>
  );
};

export const SearchFiltersSkeletonMobile = ({ className }: SearchFiltersSkeletonProps) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-4 py-3 shrink-0", className)}>
      <div className="flex items-center gap-2 overflow-x-auto">
        <Skeleton className="h-8 w-24 flex-shrink-0 bg-gray-200" />
        <Skeleton className="h-8 w-20 flex-shrink-0 bg-gray-200" />
        <Skeleton className="h-8 w-18 flex-shrink-0 bg-gray-200" />
        <Skeleton className="h-8 w-28 flex-shrink-0 bg-gray-200" />
      </div>
    </div>
  );
};