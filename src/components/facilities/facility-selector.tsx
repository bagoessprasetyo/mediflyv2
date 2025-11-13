'use client';

import React, { useState } from 'react';
import { 
  IconStethoscope, 
  IconTestPipe, 
  IconPill, 
  IconAmbulance, 
  IconHeart, 
  IconMedicalCross, 
  IconBed, 
  IconCoffee, 
  IconCar, 
  IconWheelchair,
  IconPlus,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const facilityIcons = {
  DIAGNOSTIC: IconStethoscope,
  LABORATORY: IconTestPipe,
  PHARMACY: IconPill,
  EMERGENCY: IconAmbulance,
  INTENSIVE_CARE: IconHeart,
  OPERATING_ROOM: IconMedicalCross,
  PATIENT_ROOM: IconBed,
  CAFETERIA: IconCoffee,
  PARKING: IconCar,
  ACCESSIBILITY: IconWheelchair,
  OTHER: IconPlus,
};

const facilityCategories = [
  { 
    id: 'DIAGNOSTIC', 
    name: 'Diagnostic Services', 
    description: 'X-ray, MRI, CT scan, ultrasound' 
  },
  { 
    id: 'LABORATORY', 
    name: 'Laboratory Services', 
    description: 'Blood tests, pathology, microbiology' 
  },
  { 
    id: 'PHARMACY', 
    name: 'Pharmacy', 
    description: 'Prescription medications, consultations' 
  },
  { 
    id: 'EMERGENCY', 
    name: 'Emergency Department', 
    description: '24/7 emergency medical services' 
  },
  { 
    id: 'INTENSIVE_CARE', 
    name: 'Intensive Care Unit', 
    description: 'Critical care monitoring and treatment' 
  },
  { 
    id: 'OPERATING_ROOM', 
    name: 'Operating Rooms', 
    description: 'Surgical procedures and recovery' 
  },
  { 
    id: 'PATIENT_ROOM', 
    name: 'Patient Rooms', 
    description: 'Private and shared accommodation' 
  },
  { 
    id: 'CAFETERIA', 
    name: 'Cafeteria', 
    description: 'Food services for patients and visitors' 
  },
  { 
    id: 'PARKING', 
    name: 'Parking Facilities', 
    description: 'Patient and visitor parking areas' 
  },
  { 
    id: 'ACCESSIBILITY', 
    name: 'Accessibility Services', 
    description: 'Wheelchair access, disability support' 
  },
];

const hospitalTypeTemplates = {
  GENERAL: ['EMERGENCY', 'DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'PATIENT_ROOM', 'CAFETERIA', 'PARKING'],
  SPECIALTY: ['DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'PATIENT_ROOM'],
  TEACHING: ['EMERGENCY', 'DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'INTENSIVE_CARE', 'OPERATING_ROOM', 'PATIENT_ROOM', 'CAFETERIA', 'PARKING'],
  CLINIC: ['DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'PARKING'],
  URGENT_CARE: ['EMERGENCY', 'DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'PARKING'],
  REHABILITATION: ['PATIENT_ROOM', 'CAFETERIA', 'PARKING', 'ACCESSIBILITY'],
  PSYCHIATRIC: ['PATIENT_ROOM', 'CAFETERIA', 'PARKING', 'ACCESSIBILITY'],
  CHILDRENS: ['EMERGENCY', 'DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'INTENSIVE_CARE', 'OPERATING_ROOM', 'PATIENT_ROOM', 'CAFETERIA', 'PARKING'],
  MATERNITY: ['EMERGENCY', 'DIAGNOSTIC', 'LABORATORY', 'PHARMACY', 'OPERATING_ROOM', 'PATIENT_ROOM', 'CAFETERIA', 'PARKING'],
};

interface FacilitySelectorProps {
  value: string[];
  onChange: (facilities: string[]) => void;
  hospitalType?: string;
  className?: string;
}

export function FacilitySelector({ 
  value = [], 
  onChange, 
  hospitalType,
  className 
}: FacilitySelectorProps) {
  const [showTemplates, setShowTemplates] = useState(true);

  const toggleFacility = (facilityId: string) => {
    const isSelected = value.includes(facilityId);
    if (isSelected) {
      onChange(value.filter(id => id !== facilityId));
    } else {
      onChange([...value, facilityId]);
    }
  };

  const applyTemplate = (templateFacilities: string[]) => {
    onChange(templateFacilities);
    setShowTemplates(false);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(facilityCategories.map(f => f.id));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Templates Section */}
      {showTemplates && hospitalType && hospitalTypeTemplates[hospitalType as keyof typeof hospitalTypeTemplates] && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Quick Start Templates</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(false)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Apply common facilities for {hospitalType.toLowerCase()} hospitals
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(hospitalTypeTemplates[hospitalType as keyof typeof hospitalTypeTemplates])}
            >
              Apply {hospitalType} Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Facilities Summary */}
      {value.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Selected Facilities ({value.length})</h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {value.map(facilityId => {
                const facility = facilityCategories.find(f => f.id === facilityId);
                return facility ? (
                  <Badge 
                    key={facilityId} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {React.createElement(facilityIcons[facility.id as keyof typeof facilityIcons], { className: 'h-3 w-3' })}
                    {facility.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => toggleFacility(facilityId)}
                    >
                      <IconX className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facility Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Available Facilities</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={selectAll}
          >
            Select All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilityCategories.map((facility) => {
            const Icon = facilityIcons[facility.id as keyof typeof facilityIcons];
            const isSelected = value.includes(facility.id);
            
            return (
              <Card 
                key={facility.id}
                className={cn(
                  'cursor-pointer transition-colors border-2',
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-muted-foreground/25'
                )}
                onClick={() => toggleFacility(facility.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm leading-tight">
                          {facility.name}
                        </h5>
                        {isSelected && (
                          <div className="p-1 bg-primary rounded-full">
                            <IconCheck className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {value.length === 0 && (
        <div className="text-center py-8">
          <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <IconPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No facilities selected yet. Choose from the options above.
          </p>
        </div>
      )}
    </div>
  );
}