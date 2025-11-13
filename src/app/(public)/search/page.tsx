'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAI } from './layout';
import { useSearchParams } from 'next/navigation';
// AI Chat functionality now available in sidebar
import { SearchResults } from './components/search-results';
import { SearchFilters } from './components/search-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SearchHeaderSkeleton, SearchFiltersSkeletonDesktop, SearchFiltersSkeletonMobile } from '@/components/ui/search-header-skeleton';
import { SearchResultsSkeleton } from '@/components/ui/search-results-skeleton';
import { AlertCircle, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface SearchData {
  query: string;
  location?: string;
  hospitals: any[];
  doctors: any[];
  metadata: {
    hospitalCount: number;
    doctorCount: number;
    relevantSpecialties: string[];
    searchPerformed: boolean;
    timestamp: string;
  };
}

interface SearchFilters {
  specialty?: string;
  minRating?: number;
  emergency?: boolean;
  acceptingNewPatients?: boolean;
  telehealth?: boolean;
  sortBy?: string;
}

// AI Chat functionality is now integrated into the sidebar

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { setSearchContext } = useAI();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filtersLoading, setFiltersLoading] = useState(false);

  const query = searchParams.get('q') || searchParams.get('concern') || '';
  const location = searchParams.get('location') || '';

  // Perform initial search
  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }

    performSearch(query, location, filters);
  }, [query, location]);

  // Perform search with filters
  const performSearch = async (searchQuery: string, searchLocation: string, searchFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/search/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location: searchLocation,
          filters: {
            ...searchFilters,
            hospitalLimit: 20,
            doctorLimit: 15
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchData(data);
      
      // Update AI context with search data
      setSearchContext({
        query: searchQuery,
        location: searchLocation,
        hospitalCount: data.metadata.hospitalCount,
        doctorCount: data.metadata.doctorCount,
        relevantSpecialties: data.metadata.relevantSpecialties
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query) {
      setFiltersLoading(true);
      await performSearch(query, location, newFilters);
      setFiltersLoading(false);
    }
  };

  // Search metadata for display
  const searchMetadata = searchData ? {
    totalResults: searchData.metadata.hospitalCount + searchData.metadata.doctorCount,
    hospitalCount: searchData.metadata.hospitalCount,
    doctorCount: searchData.metadata.doctorCount,
    specialties: searchData.metadata.relevantSpecialties
  } : null;

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-premium py-16">
          <div className="text-center space-content-sm">
            <Search className="h-16 w-16 text-gray-400 mx-auto" />
            <h1 className="text-section-title text-gray-900">
              Start Your Healthcare Search
            </h1>
            <p className="text-body text-gray-600">
              Please provide a health concern or search query to find hospitals and specialists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        {/* Search Header Skeleton */}
        <SearchHeaderSkeleton />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-1 flex-col">
            {/* Filters Bar Skeleton */}
            <SearchFiltersSkeletonDesktop />

            {/* Results Skeleton */}
            <div className="flex-1 overflow-y-auto p-6">
              <SearchResultsSkeleton cardCount={12} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-1 flex-col">
            {/* Filters Bar for Mobile */}
            <SearchFiltersSkeletonMobile />

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
              {/* Tab Navigation for Mobile - skeleton version */}
              <div className="bg-white border-b border-gray-200 px-4 py-2">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <div className="flex-1 py-2 px-3 bg-white rounded-md shadow-sm">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 py-2 px-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <SearchResultsSkeleton cardCount={8} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-premium py-16">
          <div className="text-center space-content-sm">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h1 className="text-section-title text-gray-900">
              Search Error
            </h1>
            <p className="text-body text-gray-600">
              {error}
            </p>
            <button
              onClick={() => performSearch(query, location, filters)}
              className="btn-premium-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0">
        <SidebarTrigger />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {query ? `"${query}"` : 'Search Results'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {location && <span>in {location}</span>}
                {searchMetadata && (
                  <span>
                    {searchMetadata.totalResults} results 
                    ({searchMetadata.hospitalCount} hospitals, {searchMetadata.doctorCount} doctors)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 flex-col">
          {/* Filters Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
            <SearchFilters 
              filters={filters}
              onFiltersChange={handleFilterChange}
              specialties={searchData?.metadata.relevantSpecialties || []}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {searchData && (
              <SearchResults
                hospitals={searchData.hospitals}
                doctors={searchData.doctors}
                query={query}
                location={location}
                filters={filters}
                loading={filtersLoading}
              />
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-1 flex-col">
          {/* Filters Bar for Mobile */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
            <SearchFilters 
              filters={filters}
              onFiltersChange={handleFilterChange}
              specialties={searchData?.metadata.relevantSpecialties || []}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Tab Navigation for Mobile */}
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  className="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 bg-white text-gray-900 shadow-sm"
                >
                  Results
                </button>
                <button
                  className="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 text-gray-600"
                >
                  AI Assistant
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {searchData && (
                <SearchResults
                  hospitals={searchData.hospitals}
                  doctors={searchData.doctors}
                  query={query}
                  location={location}
                  filters={filters}
                  loading={filtersLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container-premium py-16">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-body text-gray-600">
              Loading search...
            </span>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

