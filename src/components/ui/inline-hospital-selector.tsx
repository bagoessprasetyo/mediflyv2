'use client';

import { useState, useEffect } from 'react';
import { useHospitals } from '@/lib/queries/hospitals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  IconSearch, 
  IconPlus, 
  IconX,
  IconMapPin,
  IconBuilding,
  IconStar,
  IconUser
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface SelectedHospital {
  id: string;
  name: string;
  city?: string;
  type?: string;
  rating?: number;
}

interface InlineHospitalSelectorProps {
  value?: SelectedHospital[];
  onChange?: (hospitals: SelectedHospital[]) => void;
  disabled?: boolean;
  className?: string;
  maxSelection?: number;
}

export function InlineHospitalSelector({
  value = [],
  onChange,
  disabled = false,
  className,
  maxSelection = 20
}: InlineHospitalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  
  const { data: allHospitals, isLoading } = useHospitals({ 
    search: searchTerm
  });

  // Filter out already selected hospitals
  const availableHospitals = allHospitals?.filter(
    hospital => !value.find(selected => selected.id === hospital.id)
  ) || [];

  const handleAddHospital = (hospital: any) => {
    if (value.length >= maxSelection) return;
    
    const newHospital: SelectedHospital = {
      id: hospital.id,
      name: hospital.name,
      city: hospital.city,
      type: hospital.type,
      rating: hospital.rating,
    };
    
    onChange?.([...value, newHospital]);
  };

  const handleRemoveHospital = (hospitalId: string) => {
    onChange?.(value.filter(h => h.id !== hospitalId));
  };

  const handleClearAll = () => {
    onChange?.([]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected Hospitals Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Selected Hospitals</span>
            <Badge variant="secondary">
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
            >
              Clear All
            </Button>
          )}
        </div>

        {value.length === 0 ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <IconUser className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hospitals selected</p>
            <p className="text-xs text-muted-foreground">
              Add hospitals to feature in this content
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {value.map((hospital, index) => (
              <Card key={hospital.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{hospital.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {hospital.city && (
                          <span className="flex items-center gap-1">
                            <IconMapPin className="h-3 w-3" />
                            {hospital.city}
                          </span>
                        )}
                        {hospital.rating && (
                          <span className="flex items-center gap-1">
                            <IconStar className="h-3 w-3" />
                            {hospital.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHospital(hospital.id)}
                    disabled={disabled}
                    className="flex-shrink-0 h-6 w-6 p-0"
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Hospital Section */}
      <div className="space-y-2">
        {!showSelector ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSelector(true)}
            disabled={disabled || value.length >= maxSelection}
            className="w-full"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Hospitals {value.length > 0 && `(${maxSelection - value.length} remaining)`}
          </Button>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Add Hospitals</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSelector(false);
                    setSearchTerm('');
                  }}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={disabled}
                />
              </div>

              <ScrollArea className="h-[200px]">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}