'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useFacilities } from '@/lib/queries/facilities';
import { useHospitals } from '@/lib/queries/hospitals';
import { FacilityTable } from '@/components/facilities/facility-table';
import { FacilityStatsCards, FacilityCategoryBreakdown } from '@/components/facilities/facility-stats-cards';
import { FacilityTableSkeleton } from '@/components/skeletons/facility-table-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Building2,
  Activity
} from 'lucide-react';

function FacilitiesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const { data: facilities, isLoading } = useFacilities({
    hospital_id: hospitalFilter,
    category: categoryFilter,
    is_available: statusFilter === 'available' ? true : statusFilter === 'unavailable' ? false : undefined,
  });

  const { data: hospitals } = useHospitals();

  // Filter facilities by search query
  const filteredFacilities = facilities?.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.hospitals?.[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const clearFilters = () => {
    setSearchQuery('');
    setHospitalFilter(undefined);
    setCategoryFilter(undefined);
    setStatusFilter(undefined);
  };

  const hasActiveFilters = searchQuery || hospitalFilter || categoryFilter || statusFilter;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Facilities Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage facilities across all hospitals in your network
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button asChild>
            <Link href="/cms/facilities/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <FacilityStatsCards facilities={facilities || []} />
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search facilities, hospitals, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All hospitals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>All hospitals</SelectItem>
                {hospitals?.map((hospital: any) => (
                  <SelectItem key={hospital.id} value={String(hospital.id)}>
                    {hospital.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>All categories</SelectItem>
                <SelectItem value="DIAGNOSTIC">Diagnostic</SelectItem>
                <SelectItem value="LABORATORY">Laboratory</SelectItem>
                <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                <SelectItem value="INTENSIVE_CARE">Intensive Care</SelectItem>
                <SelectItem value="OPERATING_ROOM">Operating Room</SelectItem>
                <SelectItem value="PATIENT_ROOM">Patient Room</SelectItem>
                <SelectItem value="CAFETERIA">Cafeteria</SelectItem>
                <SelectItem value="PARKING">Parking</SelectItem>
                <SelectItem value="ACCESSIBILITY">Accessibility</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>All status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {filteredFacilities.length} of {facilities?.length || 0} facilities
            </span>
            {searchQuery && <span>• Search: "{searchQuery}"</span>}
            {hospitalFilter && (
              <span>• Hospital: {hospitals?.find(h => h.id === hospitalFilter)?.name}</span>
            )}
            {categoryFilter && <span>• Category: {categoryFilter}</span>}
            {statusFilter && <span>• Status: {statusFilter}</span>}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {!isLoading && (
        <FacilityCategoryBreakdown facilities={facilities || []} />
      )}

      {/* Table */}
      {isLoading ? (
        <FacilityTableSkeleton />
      ) : (
        <FacilityTable facilities={filteredFacilities} showHospital={true} />
      )}

      {/* Empty State */}
      {!isLoading && filteredFacilities.length === 0 && facilities?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No facilities found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first facility to a hospital.
          </p>
          <Button asChild>
            <Link href="/cms/facilities/new">
              <Plus className="h-4 w-4 mr-2" />
              Add First Facility
            </Link>
          </Button>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredFacilities.length === 0 && (facilities?.length ?? 0) > 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No facilities match your search</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function FacilitiesPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<FacilityTableSkeleton />}>
        <FacilitiesContent />
      </Suspense>
    </div>
  );
}
