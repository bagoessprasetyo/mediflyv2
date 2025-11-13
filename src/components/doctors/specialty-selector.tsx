'use client';

import { useState, useEffect } from 'react';
import { useSpecialties } from '@/lib/queries/specialties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  IconStar,
  IconStethoscope,
  IconCertificate,
  IconChevronDown,
  IconMedicalCross
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { specialtyCategories } from '@/lib/validations/specialty';
import type { DoctorSpecialtyFormData } from '@/lib/validations/doctor';

interface SelectedSpecialty extends DoctorSpecialtyFormData {
  id?: string;
  specialty?: {
    id: string;
    name: string;
    category: string;
    color_code?: string;
    requires_certification?: boolean;
  };
}

interface SpecialtySelectorProps {
  value?: SelectedSpecialty[];
  onChange?: (specialties: SelectedSpecialty[]) => void;
  disabled?: boolean;
  className?: string;
  maxSelection?: number;
}

export function SpecialtySelector({
  value = [],
  onChange,
  disabled = false,
  className,
  maxSelection = 5
}: SpecialtySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showSelector, setShowSelector] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { data: allSpecialties, isLoading } = useSpecialties({
    search: searchTerm,
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
    is_active: true
  });

  // Filter out already selected specialties
  const availableSpecialties = allSpecialties?.filter(
    (specialty: any) => !value.find((selected: any) => selected.specialty_id === specialty.id)
  ) || [];

  // Group specialties by category for better organization
  const specialtiesByCategory = availableSpecialties.reduce((acc: any, specialty: any) => {
    const category = specialty.category || 'OTHER';
    if (!acc[category]) acc[category] = [];
    acc[category].push(specialty);
    return acc;
  }, {} as Record<string, any[]>);

  const handleAddSpecialty = (specialty: any) => {
    if (value.length >= maxSelection) return;
    
    const newSpecialtyAssociation: SelectedSpecialty = {
      specialty_id: specialty.id,
      is_primary: value.length === 0, // First specialty is primary by default
      years_in_specialty: null,
      board_certified: false,
      certification_date: null,
      specialty: {
        id: specialty.id,
        name: specialty.name,
        category: specialty.category,
        color_code: specialty.color_code,
        requires_certification: specialty.requires_certification
      }
    };
    
    onChange?.([...value, newSpecialtyAssociation]);
    setShowSelector(false);
  };

  const handleRemoveSpecialty = (specialtyId: string) => {
    const updatedSpecialties = value.filter(s => s.specialty_id !== specialtyId);
    
    // If we removed the primary specialty and there are others, make the first one primary
    if (updatedSpecialties.length > 0 && !updatedSpecialties.some(s => s.is_primary)) {
      updatedSpecialties[0].is_primary = true;
    }
    
    onChange?.(updatedSpecialties);
  };

  const handleUpdateSpecialty = (specialtyId: string, updates: Partial<SelectedSpecialty>) => {
    const updatedSpecialties = value.map(specialty => 
      specialty.specialty_id === specialtyId ? { ...specialty, ...updates } : specialty
    );
    
    // If setting a specialty as primary, unset others
    if (updates.is_primary) {
      updatedSpecialties.forEach(s => {
        if (s.specialty_id !== specialtyId) {
          s.is_primary = false;
        }
      });
    }
    
    onChange?.(updatedSpecialties);
  };

  const handleClearAll = () => {
    onChange?.([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MEDICAL':
        return <IconStethoscope className="h-4 w-4" />;
      case 'SURGICAL':
        return <IconMedicalCross className="h-4 w-4" />;
      case 'EMERGENCY':
        return <IconMedicalCross className="h-4 w-4 text-red-500" />;
      default:
        return <IconStethoscope className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    return specialtyCategories.find(c => c.value === category)?.label || category;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected Specialties Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Medical Specialties</Label>
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
            <IconStethoscope className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No specialties selected</p>
            <p className="text-xs text-muted-foreground">
              Add medical specialties for this doctor
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {value.map((specialtyAssociation, index) => (
              <Card key={specialtyAssociation.specialty_id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base truncate">
                            {specialtyAssociation.specialty?.name}
                          </CardTitle>
                          {specialtyAssociation.is_primary && (
                            <Badge variant="default" className="text-xs">
                              Primary
                            </Badge>
                          )}
                          {specialtyAssociation.board_certified && (
                            <Badge variant="outline" className="text-xs">
                              <IconCertificate className="h-3 w-3 mr-1" />
                              Certified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(specialtyAssociation.specialty?.category || '')}
                            {getCategoryLabel(specialtyAssociation.specialty?.category || '')}
                          </span>
                          {specialtyAssociation.years_in_specialty && (
                            <span className="flex items-center gap-1">
                              <IconStar className="h-3 w-3" />
                              {specialtyAssociation.years_in_specialty} years
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
                        onClick={() => setExpandedCard(expandedCard === specialtyAssociation.specialty_id ? null : specialtyAssociation.specialty_id)}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                      >
                        <IconChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          expandedCard === specialtyAssociation.specialty_id && "rotate-180"
                        )} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpecialty(specialtyAssociation.specialty_id)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {expandedCard === specialtyAssociation.specialty_id && (
                  <CardContent className="pt-0 space-y-4 border-t bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`years-${specialtyAssociation.specialty_id}`} className="text-xs">
                          Years in Specialty
                        </Label>
                        <Input
                          id={`years-${specialtyAssociation.specialty_id}`}
                          type="number"
                          placeholder="e.g., 5"
                          value={specialtyAssociation.years_in_specialty || ''}
                          onChange={(e) => handleUpdateSpecialty(specialtyAssociation.specialty_id, { 
                            years_in_specialty: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          disabled={disabled}
                          className="h-8"
                          min="0"
                          max="70"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cert-date-${specialtyAssociation.specialty_id}`} className="text-xs">
                          Certification Date
                        </Label>
                        <Input
                          id={`cert-date-${specialtyAssociation.specialty_id}`}
                          type="date"
                          value={specialtyAssociation.certification_date ? 
                            new Date(specialtyAssociation.certification_date).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleUpdateSpecialty(specialtyAssociation.specialty_id, { 
                            certification_date: e.target.value ? new Date(e.target.value) : null 
                          })}
                          disabled={disabled}
                          className="h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`primary-${specialtyAssociation.specialty_id}`}
                          checked={specialtyAssociation.is_primary}
                          onCheckedChange={(checked) => handleUpdateSpecialty(specialtyAssociation.specialty_id, { is_primary: checked })}
                          disabled={disabled}
                        />
                        <Label htmlFor={`primary-${specialtyAssociation.specialty_id}`} className="text-xs">
                          Primary Specialty
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`certified-${specialtyAssociation.specialty_id}`}
                          checked={specialtyAssociation.board_certified}
                          onCheckedChange={(checked) => handleUpdateSpecialty(specialtyAssociation.specialty_id, { board_certified: checked })}
                          disabled={disabled}
                        />
                        <Label htmlFor={`certified-${specialtyAssociation.specialty_id}`} className="text-xs">
                          Board Certified
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

      {/* Add Specialty Button */}
      {!disabled && value.length < maxSelection && (
        <Dialog open={showSelector} onOpenChange={setShowSelector}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <IconPlus className="mr-2 h-4 w-4" />
              Add Medical Specialty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Medical Specialty</DialogTitle>
              <DialogDescription>
                Choose medical specialties for this doctor
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search specialties..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" 
                />
              </div>
              
              {/* Category Tabs */}
              <div>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="border rounded-md bg-muted p-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors whitespace-nowrap",
                          selectedCategory === 'ALL'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        All Categories
                      </button>
                      {specialtyCategories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setSelectedCategory(category.value)}
                          className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors whitespace-nowrap",
                            selectedCategory === category.value
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                
                <div className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Loading specialties...
                        </div>
                      ) : selectedCategory === 'ALL' ? (
                        // Show all categories when "ALL" is selected
                        Object.entries(specialtiesByCategory).map(([category, categorySpecialties]) => (
                          <div key={category}>
                            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                              {getCategoryIcon(category)}
                              {getCategoryLabel(category)} ({(categorySpecialties as any[]).length})
                            </h4>
                            <div className="grid grid-cols-1 gap-2 mb-6">
                              {(categorySpecialties as any[]).map((specialty) => (
                                <Card 
                                  key={specialty.id} 
                                  className="p-3 cursor-pointer hover:bg-accent transition-colors"
                                  onClick={() => handleAddSpecialty(specialty)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-sm">{specialty.name}</h5>
                                        {specialty.requires_certification && (
                                          <Badge variant="outline" className="text-xs">
                                            <IconCertificate className="h-3 w-3 mr-1" />
                                            Certification Required
                                          </Badge>
                                        )}
                                      </div>
                                      {specialty.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {specialty.description}
                                        </p>
                                      )}
                                    </div>
                                    <Button 
                                      type="button" 
                                      size="sm" 
                                      disabled={value.length >= maxSelection}
                                      className="ml-4"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show filtered specialties for specific category
                        availableSpecialties.length === 0 ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            {searchTerm ? 'No specialties found' : 'All specialties have been added'}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            {availableSpecialties.map((specialty: any) => (
                              <Card 
                                key={specialty.id} 
                                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => handleAddSpecialty(specialty)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium text-sm">{specialty.name}</h5>
                                      {specialty.requires_certification && (
                                        <Badge variant="outline" className="text-xs">
                                          <IconCertificate className="h-3 w-3 mr-1" />
                                          Certification Required
                                        </Badge>
                                      )}
                                    </div>
                                    {specialty.description && (
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {specialty.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    disabled={value.length >= maxSelection}
                                    className="ml-4"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                {value.length}/{maxSelection} specialties selected
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
