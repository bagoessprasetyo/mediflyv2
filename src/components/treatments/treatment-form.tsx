'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { treatmentSchema, TreatmentFormData } from '@/lib/validations/treatment';
import { useHospitals } from '@/lib/queries/hospitals';
import { useDoctors } from '@/lib/queries/doctors';
import { useSpecialties } from '@/lib/queries/specialties';
import { IncludesEditor } from './includes-editor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// RadioGroup component not available in this workspace; use native radios
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';

interface TreatmentFormProps {
  defaultValues?: any;
  onSubmit: (data: TreatmentFormData) => void;
  isLoading?: boolean;
}

export function TreatmentForm({ defaultValues, onSubmit, isLoading }: TreatmentFormProps) {
  const { data: hospitals } = useHospitals();
  const { data: specialties } = useSpecialties();

  const [selectedHospitalId, setSelectedHospitalId] = useState(defaultValues?.hospital_id);
  const { data: doctors } = useDoctors({ hospital_id: selectedHospitalId });

  const [pricingType, setPricingType] = useState<'fixed' | 'range'>(
    defaultValues?.price ? 'fixed' : 'range'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<any>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: defaultValues || {
      currency: 'USD',
      is_available: true,
      is_featured: false,
      sessions_required: 1,
      includes: [],
      requirements: [],
      contraindications: [],
    },
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control,
    name: 'requirements' as any,
  });

  const { fields: contraindicationFields, append: appendContraindication, remove: removeContraindication } = useFieldArray({
    control,
    name: 'contraindications' as any,
  });

  const handleFormSubmit = (data: TreatmentFormData) => {
    if (pricingType === 'fixed') {
      data.price_range_min = null;
      data.price_range_max = null;
    } else {
      data.price = null;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Treatment Name *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message as any}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register('slug')} placeholder="heart-health-package" />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message as any}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select defaultValue={defaultValues?.category} onValueChange={(v) => setValue('category', v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SURGERY">Surgery</SelectItem>
                  <SelectItem value="THERAPY">Therapy</SelectItem>
                  <SelectItem value="DIAGNOSTIC">Diagnostic</SelectItem>
                  <SelectItem value="WELLNESS">Wellness</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                  <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
                  <SelectItem value="COSMETIC">Cosmetic</SelectItem>
                  <SelectItem value="DENTAL">Dental</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category.message as any}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessions_required">Sessions Required</Label>
              <Input id="sessions_required" type="number" {...register('sessions_required', { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital, Doctor, Specialty */}
      <Card>
        <CardHeader>
          <CardTitle>Hospital & Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospital_id">Hospital *</Label>
            <Select defaultValue={defaultValues?.hospital_id} onValueChange={(value) => { setValue('hospital_id', value); setSelectedHospitalId(value); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals?.map((hospital: any) => (
                  <SelectItem key={hospital.id} value={String(hospital.id)}>{hospital.name} - {hospital.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hospital_id && <p className="text-sm text-destructive">{errors.hospital_id.message as any}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor_id">Doctor (Optional)</Label>
              <Select defaultValue={defaultValues?.doctor_id} onValueChange={(value) => setValue('doctor_id', value === 'NONE' ? null : value)} disabled={!selectedHospitalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    {doctors?.map((doctor: any) => (
                      <SelectItem key={doctor.id} value={String(doctor.id)}>{doctor.first_name} {doctor.last_name}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty_id">Specialty (Optional)</Label>
              <Select defaultValue={defaultValues?.specialty_id} onValueChange={(value) => setValue('specialty_id', value === 'NONE' ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    {specialties?.map((specialty: any) => (
                      <SelectItem key={specialty.id} value={String(specialty.id)}>{specialty.name}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                checked={pricingType === 'fixed'}
                onChange={() => setPricingType('fixed')}
              />
              <span>Fixed Price</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="pricing"
                checked={pricingType === 'range'}
                onChange={() => setPricingType('range')}
              />
              <span>Price Range</span>
            </label>
          </div>

          <Separator />

          {pricingType === 'fixed' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register('currency')} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_range_min">Minimum Price *</Label>
                <Input id="price_range_min" type="number" step="0.01" {...register('price_range_min', { valueAsNumber: true })} />
                {errors.price_range_min && <p className="text-sm text-destructive">{errors.price_range_min.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_range_max">Maximum Price *</Label>
                <Input id="price_range_max" type="number" step="0.01" {...register('price_range_max', { valueAsNumber: true })} />
                {errors.price_range_max && <p className="text-sm text-destructive">{errors.price_range_max.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register('currency')} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="success_rate">Success Rate (%)</Label>
            <Input id="success_rate" type="number" step="0.1" min="0" max="100" {...register('success_rate', { valueAsNumber: true })} />
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <IncludesEditor value={watch('includes') || []} onChange={(v) => setValue('includes', v)} />
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Requirements</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => appendRequirement('')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {requirementFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`requirements.${index}` as any)} placeholder="e.g., Fasting required for 8 hours" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contraindications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contraindications</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => appendContraindication('')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contraindication
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {contraindicationFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`contraindications.${index}` as any)} placeholder="e.g., Not for pregnant women" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeContraindication(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Status Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="is_available" checked={watch('is_available')} onCheckedChange={(checked) => setValue('is_available', !!checked)} />
            <Label htmlFor="is_available">Available</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" checked={watch('is_featured')} onCheckedChange={(checked) => setValue('is_featured', !!checked)} />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Treatment'}</Button>
      </div>
    </form>
  );
}
