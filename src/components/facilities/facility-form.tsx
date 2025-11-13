'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  facilityWithHospitalsSchema, 
  FacilityWithHospitals,
  CreateFacilityRequest
} from '@/lib/validations/facility';
import { useHospitals } from '@/lib/queries/hospitals';
import { FacilityWithHospitals as FacilityType } from '@/types/database.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FacilityFormSkeleton } from '@/components/skeletons/facility-form-skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Activity,
  Zap,
  Microscope,
  ShieldCheck,
  Users,
  Stethoscope,
  Car,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FacilityFormProps {
  defaultValues?: FacilityType;
  onSubmit: (data: CreateFacilityRequest) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

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
    EMERGENCY: 'bg-red-50 text-red-700 border-red-200',
    DIAGNOSTIC: 'bg-blue-50 text-blue-700 border-blue-200',
    LABORATORY: 'bg-purple-50 text-purple-700 border-purple-200',
    INTENSIVE_CARE: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    OPERATING_ROOM: 'bg-green-50 text-green-700 border-green-200',
    PATIENT_ROOM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PHARMACY: 'bg-pink-50 text-pink-700 border-pink-200',
    PARKING: 'bg-gray-50 text-gray-700 border-gray-200',
    CAFETERIA: 'bg-orange-50 text-orange-700 border-orange-200',
    ACCESSIBILITY: 'bg-teal-50 text-teal-700 border-teal-200',
    OTHER: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return colors[category] || colors.OTHER;
};

export function FacilityForm({ 
  defaultValues, 
  onSubmit, 
  isLoading = false,
  mode = 'create'
}: FacilityFormProps) {
  const { data: hospitals, isLoading: hospitalsLoading } = useHospitals();

  // Transform default values for the form
  const getInitialValues = () => {
    if (!defaultValues) {
      return {
        name: '',
        description: '',
        icon: '',
        category: undefined,
        is_available: true,
        capacity: undefined,
        hospital_relationships: [{
          hospital_id: '',
          facility_id: '',
          primary_hospital: true,
          access_level: 'FULL',
          cost_sharing_percentage: 100,
          notes: ''
        }]
      };
    }

    // Transform existing facility data
    const relationships = defaultValues.hospitals?.map(hospital => ({
      hospital_id: hospital.id,
      facility_id: defaultValues.id,
      primary_hospital: hospital.relationship.primary_hospital,
      access_level: hospital.relationship.access_level,
      cost_sharing_percentage: hospital.relationship.cost_sharing_percentage,
      notes: hospital.relationship.notes || ''
    })) || [];

    return {
      name: defaultValues.name,
      description: defaultValues.description || '',
      icon: defaultValues.icon || '',
      category: defaultValues.category,
      is_available: defaultValues.is_available,
      capacity: defaultValues.capacity,
      hospital_relationships: relationships.length > 0 ? relationships : [{
        hospital_id: '',
        facility_id: defaultValues.id,
        primary_hospital: true,
        access_level: 'FULL',
        cost_sharing_percentage: 100,
        notes: ''
      }]
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    trigger,
    control
  } = useForm<FacilityWithHospitals>({
    resolver: zodResolver(facilityWithHospitalsSchema) as any,
    defaultValues: getInitialValues() as any,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hospital_relationships'
  });

  const selectedCategory = watch('category');
  const hospitalRelationships = watch('hospital_relationships');
  const isFormLoading = isLoading || isSubmitting;
  
  const CategoryIcon = getCategoryIcon(selectedCategory);
  const categoryColorClass = getCategoryColor(selectedCategory);

  const handleFormSubmit = (data: FacilityWithHospitals) => {
    const request: CreateFacilityRequest = {
      facility: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category,
        is_available: data.is_available,
        capacity: data.capacity,
      },
      hospital_relationships: data.hospital_relationships
    };
    onSubmit(request);
  };

  const addHospitalRelationship = () => {
    append({
      hospital_id: '',
      facility_id: defaultValues?.id || '',
      primary_hospital: false,
      access_level: 'FULL',
      cost_sharing_percentage: 100,
      notes: ''
    });
  };

  const removeHospitalRelationship = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const setPrimaryHospital = (index: number) => {
    hospitalRelationships.forEach((_, i) => {
      setValue(`hospital_relationships.${i}.primary_hospital`, i === index);
    });
  };

  if (hospitalsLoading) {
    return <FacilityFormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Facility Information */}
      <Card className={cn('transition-all', isFormLoading && 'opacity-60')}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle>Facility Information</CardTitle>
            {isFormLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Facility Name *
              </Label>
              <Input 
                id="name" 
                {...register('name')} 
                placeholder="e.g., MRI Scanner, Emergency Room" 
                disabled={isFormLoading}
                className={cn(
                  'transition-colors',
                  errors.name && 'border-destructive focus:ring-destructive'
                )}
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                {selectedCategory && <CategoryIcon className="h-4 w-4" />}
                Category *
              </Label>
              <Select 
                defaultValue={defaultValues?.category} 
                onValueChange={(value) => {
                  setValue('category', value as any);
                  trigger('category');
                }}
                disabled={isFormLoading}
              >
                <SelectTrigger className={cn(
                  'transition-colors',
                  errors.category && 'border-destructive focus:ring-destructive',
                  selectedCategory && categoryColorClass
                )}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="diagnostic" value="DIAGNOSTIC">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Diagnostic
                    </div>
                  </SelectItem>
                  <SelectItem key="laboratory" value="LABORATORY">
                    <div className="flex items-center gap-2">
                      <Microscope className="h-4 w-4" />
                      Laboratory
                    </div>
                  </SelectItem>
                  <SelectItem key="pharmacy" value="PHARMACY">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Pharmacy
                    </div>
                  </SelectItem>
                  <SelectItem key="emergency" value="EMERGENCY">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Emergency
                    </div>
                  </SelectItem>
                  <SelectItem key="intensive_care" value="INTENSIVE_CARE">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Intensive Care
                    </div>
                  </SelectItem>
                  <SelectItem key="operating_room" value="OPERATING_ROOM">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Operating Room
                    </div>
                  </SelectItem>
                  <SelectItem key="patient_room" value="PATIENT_ROOM">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Patient Room
                    </div>
                  </SelectItem>
                  <SelectItem key="cafeteria" value="CAFETERIA">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Cafeteria
                    </div>
                  </SelectItem>
                  <SelectItem key="parking" value="PARKING">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Parking
                    </div>
                  </SelectItem>
                  <SelectItem key="accessibility" value="ACCESSIBILITY">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Accessibility
                    </div>
                  </SelectItem>
                  <SelectItem key="other" value="OTHER">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.category.message}</span>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-xs', categoryColorClass)}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {selectedCategory.replace('_', ' ')}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              rows={3} 
              placeholder="Provide additional details about this facility..."
              disabled={isFormLoading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add equipment details, availability hours, or special requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacity
              </Label>
              <Input 
                id="capacity" 
                type="number" 
                {...register('capacity', { valueAsNumber: true })} 
                placeholder="e.g., 4 (for scanners), 50 (for rooms)"
                disabled={isFormLoading}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of patients or units this facility can accommodate.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Display Icon (optional)</Label>
              <Input 
                id="icon" 
                {...register('icon')} 
                placeholder="e.g., 🏥, ⚕️, 🚑"
                disabled={isFormLoading}
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Single emoji or icon character to display alongside the facility name.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Availability Status</Label>
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="is_available" 
                checked={watch('is_available')} 
                onCheckedChange={(checked) => setValue('is_available', !!checked)}
                disabled={isFormLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="is_available" className="cursor-pointer">
                  Mark as available
                </Label>
                <p className="text-xs text-muted-foreground">
                  Uncheck if facility is temporarily unavailable due to maintenance or other issues.
                </p>
              </div>
              {watch('is_available') && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Available</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Associations */}
      <Card className={cn('transition-all', isFormLoading && 'opacity-60')}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Hospital Associations</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHospitalRelationship}
              disabled={isFormLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hospital
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">
                    Hospital {index + 1}
                    {hospitalRelationships[index]?.primary_hospital && (
                      <Star className="h-4 w-4 text-yellow-500 ml-2 inline" />
                    )}
                  </Label>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHospitalRelationship(index)}
                    disabled={isFormLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hospital *</Label>
                  <Select
                    value={hospitalRelationships[index]?.hospital_id || ''}
                    onValueChange={(value) => {
                      setValue(`hospital_relationships.${index}.hospital_id`, value);
                      trigger(`hospital_relationships.${index}.hospital_id`);
                    }}
                    disabled={isFormLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {!hospitals?.length ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No hospitals available
                        </div>
                      ) : (
                        hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{hospital.name}</span>
                              <span className="text-muted-foreground">- {hospital.city}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.hospital_relationships?.[index]?.hospital_id && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.hospital_relationships[index]?.hospital_id?.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select
                    value={hospitalRelationships[index]?.access_level || 'FULL'}
                    onValueChange={(value) => {
                      setValue(`hospital_relationships.${index}.access_level`, value as any);
                    }}
                    disabled={isFormLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="full-access" value="FULL">Full Access</SelectItem>
                      <SelectItem key="limited-access" value="LIMITED">Limited Access</SelectItem>
                      <SelectItem key="emergency-only" value="EMERGENCY_ONLY">Emergency Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Sharing (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hospitalRelationships[index]?.cost_sharing_percentage || 100}
                    onChange={(e) => {
                      setValue(`hospital_relationships.${index}.cost_sharing_percentage`, Number(e.target.value));
                    }}
                    disabled={isFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={hospitalRelationships[index]?.primary_hospital || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPrimaryHospital(index);
                        }
                      }}
                      disabled={isFormLoading}
                    />
                    <Label className="text-sm">Primary Hospital</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The main hospital responsible for this facility
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Additional notes about this relationship..."
                  value={hospitalRelationships[index]?.notes || ''}
                  onChange={(e) => {
                    setValue(`hospital_relationships.${index}.notes`, e.target.value);
                  }}
                  disabled={isFormLoading}
                />
              </div>
            </div>
          ))}

          {errors.hospital_relationships && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>At least one hospital association is required</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={isFormLoading}
          className="order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isFormLoading || !isValid}
          className="order-1 sm:order-2 min-w-[140px]"
        >
          {isFormLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'create' ? 'Create' : 'Save'} Facility
            </>
          )}
        </Button>
      </div>
    </form>
  );
}