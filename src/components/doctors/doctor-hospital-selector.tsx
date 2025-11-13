'use client';

import { useState, useEffect } from 'react';
import { useHospitals } from '@/lib/queries/hospitals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  IconSearch, 
  IconPlus, 
  IconX,
  IconMapPin,
  IconBuilding,
  IconStar,
  IconBuildingHospital,
  IconChevronDown
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { DoctorHospitalFormData } from '@/lib/validations/doctor';

interface SelectedHospital extends DoctorHospitalFormData {
  id?: string;
  hospital?: {
    id: string;
    name: string;
    city: string;
    type: string;
    rating?: number;
  };
}

interface DoctorHospitalSelectorProps {
  value?: SelectedHospital[];
  onChange?: (hospitals: SelectedHospital[]) => void;
  disabled?: boolean;
  className?: string;
  maxSelection?: number;
}

export function DoctorHospitalSelector({
  value = [],
  onChange,
  disabled = false,
  className,
  maxSelection = 10
}: DoctorHospitalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const { data: allHospitals, isLoading } = useHospitals({ 
    search: searchTerm
  });

  // Filter out already selected hospitals
  const availableHospitals = allHospitals?.filter(
    hospital => !value.find(selected => selected.hospital_id === hospital.id)
  ) || [];

  const handleAddHospital = (hospital: any) => {
    if (value.length >= maxSelection) return;
    
    const newHospitalAffiliation: SelectedHospital = {
      hospital_id: hospital.id,
      is_primary: value.length === 0, // First hospital is primary by default
      position_title: '',
      department: '',
      start_date: null,
      end_date: null,
      is_active: true,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        city: hospital.city,
        type: hospital.type,
        rating: hospital.rating,
      }
    };
    
    onChange?.([...value, newHospitalAffiliation]);
    setShowSelector(false);
  };

  const handleRemoveHospital = (hospitalId: string) => {
    const updatedHospitals = value.filter(h => h.hospital_id !== hospitalId);
    
    // If we removed the primary hospital and there are others, make the first one primary
    if (updatedHospitals.length > 0 && !updatedHospitals.some(h => h.is_primary)) {
      updatedHospitals[0].is_primary = true;
    }
    
    onChange?.(updatedHospitals);
  };

  const handleUpdateHospital = (hospitalId: string, updates: Partial<SelectedHospital>) => {
    const updatedHospitals = value.map(hospital => 
      hospital.hospital_id === hospitalId ? { ...hospital, ...updates } : hospital
    );
    
    // If setting a hospital as primary, unset others
    if (updates.is_primary) {
      updatedHospitals.forEach(h => {
        if (h.hospital_id !== hospitalId) {
          h.is_primary = false;
        }
      });
    }
    
    onChange?.(updatedHospitals);
  };

  const handleClearAll = () => {
    onChange?.([]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected Hospitals Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Hospital Affiliations</Label>
            <Badge variant="secondary" className="text-xs">
              {value.length}/{maxSelection}
            </Badge>
          </div>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={disabled}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {value.length === 0 ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <IconBuildingHospital className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hospital affiliations</p>
            <p className="text-xs text-muted-foreground">
              Add hospitals where this doctor practices
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {value.map((hospitalAffiliation, index) => (
              <Card key={hospitalAffiliation.hospital_id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base truncate">
                            {hospitalAffiliation.hospital?.name}
                          </CardTitle>
                          {hospitalAffiliation.is_primary && (
                            <Badge variant="default" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <IconMapPin className="h-3 w-3" />
                            {hospitalAffiliation.hospital?.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconBuilding className="h-3 w-3" />
                            {hospitalAffiliation.hospital?.type || 'Hospital'}
                          </span>
                          {hospitalAffiliation.hospital?.rating && (
                            <span className="flex items-center gap-1">
                              <IconStar className="h-3 w-3" />
                              {hospitalAffiliation.hospital.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedCard(expandedCard === hospitalAffiliation.hospital_id ? null : hospitalAffiliation.hospital_id)}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                      >
                        <IconChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          expandedCard === hospitalAffiliation.hospital_id && "rotate-180"
                        )} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHospital(hospitalAffiliation.hospital_id)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {expandedCard === hospitalAffiliation.hospital_id && (
                  <CardContent className="pt-0 space-y-4 border-t bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`position-${hospitalAffiliation.hospital_id}`} className="text-xs">
                          Position Title
                        </Label>
                        <Input
                          id={`position-${hospitalAffiliation.hospital_id}`}
                          placeholder="e.g., Chief of Cardiology"
                          value={hospitalAffiliation.position_title || ''}
                          onChange={(e) => handleUpdateHospital(hospitalAffiliation.hospital_id, { position_title: e.target.value })}
                          disabled={disabled}
                          className="h-8"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`department-${hospitalAffiliation.hospital_id}`} className="text-xs">
                          Department
                        </Label>
                        <Input
                          id={`department-${hospitalAffiliation.hospital_id}`}
                          placeholder="e.g., Cardiology"
                          value={hospitalAffiliation.department || ''}
                          onChange={(e) => handleUpdateHospital(hospitalAffiliation.hospital_id, { department: e.target.value })}
                          disabled={disabled}
                          className="h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`primary-${hospitalAffiliation.hospital_id}`}
                          checked={hospitalAffiliation.is_primary}
                          onCheckedChange={(checked) => handleUpdateHospital(hospitalAffiliation.hospital_id, { is_primary: checked })}
                          disabled={disabled}
                        />
                        <Label htmlFor={`primary-${hospitalAffiliation.hospital_id}`} className="text-xs">
                          Primary Hospital
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`active-${hospitalAffiliation.hospital_id}`}
                          checked={hospitalAffiliation.is_active}
                          onCheckedChange={(checked) => handleUpdateHospital(hospitalAffiliation.hospital_id, { is_active: checked })}
                          disabled={disabled}
                        />
                        <Label htmlFor={`active-${hospitalAffiliation.hospital_id}`} className="text-xs">
                          Active
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Hospital Button */}
      {!disabled && value.length < maxSelection && (
        <Dialog open={showSelector} onOpenChange={setShowSelector}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <IconPlus className="mr-2 h-4 w-4" />
              Add Hospital Affiliation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Hospital Affiliation</DialogTitle>
              <DialogDescription>
                Choose hospitals where this doctor practices
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search hospitals..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" 
                />
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Loading hospitals...
                    </div>
                  ) : availableHospitals.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      {searchTerm ? 'No hospitals found' : 'All hospitals have been added'}
                    </div>
                  ) : (
                    availableHospitals.map((hospital) => (
                      <Card 
                        key={hospital.id} 
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleAddHospital(hospital)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{hospital.name}</h4>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <IconMapPin className="h-3 w-3" />
                                {hospital.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <IconBuilding className="h-3 w-3" />
                                {hospital.type || 'Hospital'}
                              </span>
                              {hospital.rating && (
                                <span className="flex items-center gap-1">
                                  <IconStar className="h-3 w-3" />
                                  {hospital.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            size="sm" 
                            disabled={value.length >= maxSelection}
                          >
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="text-xs text-muted-foreground text-center">
                {value.length}/{maxSelection} hospitals selected
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}