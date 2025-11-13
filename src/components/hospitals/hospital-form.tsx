'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hospitalSchema, HospitalFormData } from '@/lib/validations/hospital';
import { Hospital } from '@/types/database.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { FacilityRelationshipManager } from '@/components/facilities/facility-relationship-manager';

interface HospitalFormProps {
  defaultValues?: Partial<Hospital>;
  onSubmit: (data: HospitalFormData) => void;
  isLoading?: boolean;
}

export function HospitalForm({ defaultValues, onSubmit, isLoading }: HospitalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: defaultValues || {
      country: 'USA',
      is_active: true,
      is_verified: false,
      is_featured: false,
      emergency_services: false,
      facility_relationships: [],
      logo: '',
      images: [],
      virtual_tour: '',
    },
  });

  const watchedType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hospital Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g. Mount Sinai Hospital"
                {...register('name')} 
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register('slug')} placeholder="mount-sinai-hospital" />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Brief description of the hospital's services and specializations..."
              {...register('description')} 
              rows={4} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type *</Label>
              <Select
                defaultValue={defaultValues?.type}
                onValueChange={(value) => setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="SPECIALTY">Specialty</SelectItem>
                  <SelectItem value="TEACHING">Teaching</SelectItem>
                  <SelectItem value="CLINIC">Clinic</SelectItem>
                  <SelectItem value="URGENT_CARE">Urgent Care</SelectItem>
                  <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
                  <SelectItem value="PSYCHIATRIC">Psychiatric</SelectItem>
                  <SelectItem value="CHILDRENS">Children's</SelectItem>
                  <SelectItem value="MATERNITY">Maternity</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bed_count">Bed Count</Label>
              <Input
                id="bed_count"
                type="number"
                placeholder="e.g. 250"
                {...register('bed_count', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="info@hospital.com"
                {...register('email')} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                placeholder="(555) 123-4567"
                {...register('phone')} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                placeholder="https://www.hospital.com"
                {...register('website')} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input 
              id="address" 
              placeholder="1234 Medical Center Drive"
              {...register('address')} 
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input 
                id="city" 
                placeholder="New York"
                {...register('city')} 
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input 
                id="state" 
                placeholder="NY"
                {...register('state')} 
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code *</Label>
              <Input 
                id="zip_code" 
                placeholder="10001"
                {...register('zip_code')} 
              />
              {errors.zip_code && (
                <p className="text-sm text-destructive">{errors.zip_code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                placeholder="United States"
                {...register('country')} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="40.7128"
                {...register('latitude', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-74.0060"
                {...register('longitude', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trauma_level">Trauma Level</Label>
              <Select
                defaultValue={defaultValues?.trauma_level || undefined}
                onValueChange={(value) => setValue('trauma_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trauma level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Level I">Level I</SelectItem>
                  <SelectItem value="Level II">Level II</SelectItem>
                  <SelectItem value="Level III">Level III</SelectItem>
                  <SelectItem value="Level IV">Level IV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="established">Established Date</Label>
              <Input
                id="established"
                type="date"
                {...register('established')}
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency_services"
                checked={watch('emergency_services')}
                onCheckedChange={(checked) => setValue('emergency_services', !!checked)}
              />
              <Label htmlFor="emergency_services">Emergency Services Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', !!checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_verified"
                checked={watch('is_verified')}
                onCheckedChange={(checked) => setValue('is_verified', !!checked)}
              />
              <Label htmlFor="is_verified">Verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={watch('is_featured')}
                onCheckedChange={(checked) => setValue('is_featured', !!checked)}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle>Media & Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Hospital Logo</Label>
            <ImageUpload
              value={watch('logo') || ''}
              onChange={(value) => setValue('logo', Array.isArray(value) ? value[0] : value)}
              placeholder="Upload hospital logo"
              accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <ImageUpload
              value={watch('images') || []}
              onChange={(value) => setValue('images', Array.isArray(value) ? value : [value].filter(Boolean))}
              multiple
              maxFiles={10}
              placeholder="Upload hospital gallery images"
              accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="virtual_tour">Virtual Tour URL</Label>
            <Input
              id="virtual_tour"
              placeholder="https://tour.hospital.com"
              {...register('virtual_tour')}
            />
            <p className="text-xs text-muted-foreground">
              Link to 360° virtual tour or video walkthrough
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Facility Relationships Section */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Associations</CardTitle>
        </CardHeader>
        <CardContent>
          <FacilityRelationshipManager
            value={(watch('facility_relationships') || []) as any}
            onChange={(relationships) => setValue('facility_relationships', relationships)}
            hospitalId={defaultValues?.id}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Hospital'}
        </Button>
      </div>
    </form>
  );
}