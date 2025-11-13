'use client';

import { useState, useEffect } from 'react';
import { useFacilities } from '@/lib/queries/facilities';
import { useHospitals } from '@/lib/queries/hospitals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  X,
  Star,
  Building2,
  Activity,
  Zap,
  Microscope,
  ShieldCheck,
  Users,
  Stethoscope,
  Car,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FacilityRelationship {
  facility_id: string;
  primary_hospital: boolean;
  access_level: 'FULL' | 'LIMITED' | 'EMERGENCY_ONLY';
  cost_sharing_percentage: number;
  notes: string;
}

interface FacilityRelationshipManagerProps {
  value: FacilityRelationship[];
  onChange: (relationships: FacilityRelationship[]) => void;
  hospitalId?: string; // When editing an existing hospital
  className?: string;
}

// Icon mapping for facility categories
const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    EMERGENCY: Zap,
    DIAGNOSTIC: Activity,
    LABORATORY: Microscope,
    INTENSIVE_CARE: Users,
    OPERATING_ROOM: Stethoscope,
    PATIENT_ROOM: Building2,
    PHARMACY: ShieldCheck,
    PARKING: Car,
    CAFETERIA: Building2,
    ACCESSIBILITY: Users,
    OTHER: Building2,
  };
  return icons[category] || Building2;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    EMERGENCY: 'bg-red-100 text-red-800 border-red-200',
    DIAGNOSTIC: 'bg-blue-100 text-blue-800 border-blue-200',
    LABORATORY: 'bg-purple-100 text-purple-800 border-purple-200',
    INTENSIVE_CARE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    OPERATING_ROOM: 'bg-green-100 text-green-800 border-green-200',
    PATIENT_ROOM: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    PHARMACY: 'bg-pink-100 text-pink-800 border-pink-200',
    PARKING: 'bg-gray-100 text-gray-800 border-gray-200',
    CAFETERIA: 'bg-orange-100 text-orange-800 border-orange-200',
    ACCESSIBILITY: 'bg-teal-100 text-teal-800 border-teal-200',
    OTHER: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return colors[category] || colors.OTHER;
};

export function FacilityRelationshipManager({
  value = [],
  onChange,
  hospitalId,
  className
}: FacilityRelationshipManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  const { data: facilities, isLoading: facilitiesLoading } = useFacilities({
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
    is_available: showAvailableOnly ? true : undefined
  });
  const { data: hospitals } = useHospitals();

  // Filter facilities by search query and exclude already selected ones
  const availableFacilities = facilities?.filter(facility => {
    const isAlreadySelected = value.some(rel => rel.facility_id === facility.id);
    const matchesSearch = !searchQuery || 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.category.toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlreadySelected && matchesSearch;
  }) || [];

  const selectedFacilities = value.map(relationship => {
    const facility = facilities?.find(f => (f as any).facility_id === relationship.facility_id);
    return { ...relationship, facility };
  }).filter(item => item.facility);

  const addFacilityRelationship = (facilityId: string) => {
    const newRelationship: FacilityRelationship = {
      facility_id: facilityId,
      primary_hospital: value.length === 0, // First facility becomes primary
      access_level: 'FULL',
      cost_sharing_percentage: 100,
      notes: ''
    };
    onChange([...value, newRelationship]);
  };

  const removeFacilityRelationship = (facilityId: string) => {
    const updatedRelationships = value.filter(rel => rel.facility_id !== facilityId);
    
    // If we removed the primary facility, make the first remaining one primary
    if (updatedRelationships.length > 0) {
      const hadPrimary = value.find(rel => rel.facility_id === facilityId && rel.primary_hospital);
      if (hadPrimary && !updatedRelationships.some(rel => rel.primary_hospital)) {
        updatedRelationships[0].primary_hospital = true;
      }
    }
    
    onChange(updatedRelationships);
  };

  const updateRelationship = (facilityId: string, updates: Partial<FacilityRelationship>) => {
    const updatedRelationships = value.map(rel => 
      rel.facility_id === facilityId ? { ...rel, ...updates } : rel
    );
    
    // Handle primary hospital changes
    if (updates.primary_hospital === true) {
      // Set all others to false when making one primary
      updatedRelationships.forEach(rel => {
        if (rel.facility_id !== facilityId) {
          rel.primary_hospital = false;
        }
      });
    }
    
    onChange(updatedRelationships);
  };

  const clearAll = () => {
    onChange([]);
  };

  if (facilitiesLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Selected Facilities */}
      {selectedFacilities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Selected Facilities ({selectedFacilities.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFacilities.map((item) => {
              const facility = item.facility;
              if (!facility) return null;
              
              const CategoryIcon = getCategoryIcon(facility.category);
              const categoryColor = getCategoryColor(facility.category);
              
              return (
                <div key={facility.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <CategoryIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{facility.name}</h4>
                          {item.primary_hospital && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className={cn('text-xs', categoryColor)}>
                          {facility.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFacilityRelationship(facility.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Select
                        value={item.access_level}
                        onValueChange={(value: any) => 
                          updateRelationship(facility.id, { access_level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="full" value="FULL">Full Access</SelectItem>
                          <SelectItem key="limited" value="LIMITED">Limited Access</SelectItem>
                          <SelectItem key="emergency_only" value="EMERGENCY_ONLY">Emergency Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cost Sharing (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.cost_sharing_percentage}
                        onChange={(e) => 
                          updateRelationship(facility.id, { 
                            cost_sharing_percentage: parseFloat(e.target.value) || 0 
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`primary-${facility.id}`}
                          checked={item.primary_hospital}
                          onCheckedChange={(checked) =>
                            updateRelationship(facility.id, { primary_hospital: !!checked })
                          }
                        />
                        <Label htmlFor={`primary-${facility.id}`}>Primary Hospital</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Additional notes about this facility relationship..."
                      value={item.notes}
                      onChange={(e) => 
                        updateRelationship(facility.id, { notes: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Facilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="ALL">All categories</SelectItem>
                  <SelectItem key="diagnostic" value="DIAGNOSTIC">Diagnostic</SelectItem>
                  <SelectItem key="laboratory" value="LABORATORY">Laboratory</SelectItem>
                  <SelectItem key="pharmacy" value="PHARMACY">Pharmacy</SelectItem>
                  <SelectItem key="emergency" value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem key="intensive_care" value="INTENSIVE_CARE">Intensive Care</SelectItem>
                  <SelectItem key="operating_room" value="OPERATING_ROOM">Operating Room</SelectItem>
                  <SelectItem key="patient_room" value="PATIENT_ROOM">Patient Room</SelectItem>
                  <SelectItem key="cafeteria" value="CAFETERIA">Cafeteria</SelectItem>
                  <SelectItem key="parking" value="PARKING">Parking</SelectItem>
                  <SelectItem key="accessibility" value="ACCESSIBILITY">Accessibility</SelectItem>
                  <SelectItem key="other" value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available-only"
                  checked={showAvailableOnly}
                  onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
                />
                <Label htmlFor="available-only" className="text-sm">Available only</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Facility Grid */}
          {availableFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFacilities.map((facility) => {
                const CategoryIcon = getCategoryIcon(facility.category);
                const categoryColor = getCategoryColor(facility.category);
                
                return (
                  <Card 
                    key={facility.id}
                    className="cursor-pointer transition-colors border-2 hover:border-muted-foreground/25"
                    onClick={() => addFacilityRelationship(facility.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight">
                            {facility.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={cn('text-xs', categoryColor)}>
                              {facility.category.replace('_', ' ')}
                            </Badge>
                            {facility.is_available ? (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                          {facility.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                              {facility.description}
                            </p>
                          )}
                          {facility.capacity && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Capacity: {facility.capacity} units
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery || (selectedCategory && selectedCategory !== 'ALL') ? 'No facilities match your criteria' : 'No available facilities found'}
              </p>
              {(searchQuery || (selectedCategory && selectedCategory !== 'ALL')) && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}