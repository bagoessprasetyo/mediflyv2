'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AIChatAssistant } from './components/ai-chat';
import { AIChatAssistantAnimated } from './components/ai-chat-animated';
import { SearchResults } from './components/search-results';
import { SearchFilters } from './components/search-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, Search } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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

// Configuration: Set to true to use animated chat interface, false for original
const USE_ANIMATED_CHAT = true;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

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
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query) {
      performSearch(query, location, newFilters);
    }
  };

  // Prepare context for AI chat
  const chatContext = {
    query,
    location,
    hasSearched: !!searchData,
    resultsCount: searchData ? searchData.metadata.hospitalCount + searchData.metadata.doctorCount : 0,
    hospitalCount: searchData?.metadata.hospitalCount || 0,
    doctorCount: searchData?.metadata.doctorCount || 0,
    relevantSpecialties: searchData?.metadata.relevantSpecialties || []
  };

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
      <div className="min-h-screen bg-gray-50">
        <div className="container-premium py-16">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-body text-gray-600">
              Searching for healthcare options...
            </span>
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      

      {/* Main resizable content */}
      <div className="h-screen">
        {/* Desktop Layout with Resizable Panels */}
        <div className="hidden lg:block h-full">
          <ResizablePanelGroup direction="horizontal" className="min-h-full">
            {/* Left Panel - AI Chat Assistant */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="min-w-0">
              <div className="h-full bg-white border-r border-gray-200 flex flex-col">
                {USE_ANIMATED_CHAT ? (
                  <AIChatAssistantAnimated 
                    searchContext={chatContext}
                    onFilterSuggestion={handleFilterChange}
                  />
                ) : (
                  <AIChatAssistant 
                    searchContext={chatContext}
                    onFilterSuggestion={handleFilterChange}
                  />
                )}
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors" />

            {/* Right Panel - Search Results */}
            <ResizablePanel defaultSize={65} minSize={50} className="min-w-0">
              <div className="h-full flex flex-col bg-gray-50">
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
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-full flex flex-col">
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

