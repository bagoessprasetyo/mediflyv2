'use client';

import { useState } from 'react';
import { ChevronDown, Filter, Star, MapPin, Clock, Stethoscope, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFiltersProps {
  filters: {
    specialty?: string;
    minRating?: number;
    emergency?: boolean;
    acceptingNewPatients?: boolean;
    telehealth?: boolean;
    sortBy?: string;
  };
  onFiltersChange: (filters: any) => void;
  specialties: string[];
}

export function SearchFilters({ filters, onFiltersChange, specialties }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete (newFilters as any)[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-medifly-teal"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-medifly-teal text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.specialty && (
            <FilterTag
              label={`Specialty: ${filters.specialty}`}
              onRemove={() => clearFilter('specialty')}
            />
          )}
          {filters.minRating && (
            <FilterTag
              label={`Rating: ${filters.minRating}+ stars`}
              onRemove={() => clearFilter('minRating')}
            />
          )}
          {filters.emergency && (
            <FilterTag
              label="Emergency Services"
              onRemove={() => clearFilter('emergency')}
            />
          )}
          {filters.acceptingNewPatients && (
            <FilterTag
              label="Accepting New Patients"
              onRemove={() => clearFilter('acceptingNewPatients')}
            />
          )}
          {filters.telehealth && (
            <FilterTag
              label="Telehealth Available"
              onRemove={() => clearFilter('telehealth')}
            />
          )}
          {filters.sortBy && (
            <FilterTag
              label={`Sort: ${getSortLabel(filters.sortBy)}`}
              onRemove={() => clearFilter('sortBy')}
            />
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Specialty Filter */}
          {specialties.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="h-4 w-4 inline mr-1" />
                Specialty
              </label>
              <select
                value={filters.specialty || ''}
                onChange={(e) => handleFilterChange('specialty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent text-sm"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="h-4 w-4 inline mr-1" />
              Minimum Rating
            </label>
            <select
              value={filters.minRating || ''}
              onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent text-sm"
            >
              <option value="">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Boolean Filters */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Services & Availability
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.emergency || false}
                  onChange={(e) => handleFilterChange('emergency', e.target.checked || undefined)}
                  className="h-4 w-4 text-medifly-teal focus:ring-medifly-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Emergency Services Available</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.acceptingNewPatients || false}
                  onChange={(e) => handleFilterChange('acceptingNewPatients', e.target.checked || undefined)}
                  className="h-4 w-4 text-medifly-teal focus:ring-medifly-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Accepting New Patients</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.telehealth || false}
                  onChange={(e) => handleFilterChange('telehealth', e.target.checked || undefined)}
                  className="h-4 w-4 text-medifly-teal focus:ring-medifly-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Telehealth Available</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-medifly-teal/10 text-medifly-teal text-xs rounded-full">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-medifly-teal/20 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function getSortLabel(sortBy: string): string {
  const labels: { [key: string]: string } = {
    rating: 'Highest Rated',
    distance: 'Nearest',
    name: 'Name A-Z'
  };
  return labels[sortBy] || sortBy;
}