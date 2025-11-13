'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorSchema, DoctorFormData } from '@/lib/validations/doctor';
import { SpecialtySelector } from './specialty-selector';
import { DoctorHospitalSelector } from './doctor-hospital-selector';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  IconPlus, 
  IconTrash, 
  IconUser,
  IconBriefcase,
  IconMail,
  IconSchool,
  IconLanguage,
  IconCurrencyDollar,
  IconSettings,
  IconStethoscope,
  IconBuildingHospital
} from '@tabler/icons-react';

interface DoctorFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DoctorForm({ defaultValues, onSubmit, isLoading }: DoctorFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<any>({
    resolver: zodResolver(doctorSchema),
    defaultValues: defaultValues || {
      is_active: true,
      is_verified: false,
      is_accepting_new_patients: true,
      is_telehealth_available: false,
      consultation_duration: 30,
      languages: ['English'],
      education: [],
    },
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education' as any,
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages' as any,
  });

  const [specialties, setSpecialties] = useState(defaultValues?.doctor_specialties?.map((ds: any) => ({
    specialty_id: ds.specialty.id,
    is_primary: ds.is_primary,
    years_in_specialty: ds.years_in_specialty,
    board_certified: ds.board_certified,
    certification_date: ds.certification_date,
    specialty: {
      id: ds.specialty.id,
      name: ds.specialty.name,
      category: ds.specialty.category,
      color_code: ds.specialty.color_code,
      requires_certification: ds.specialty.requires_certification
    }
  })) || []);

  const [hospitals, setHospitals] = useState(defaultValues?.doctor_hospitals?.map((dh: any) => ({
    hospital_id: dh.hospital_id,
    is_primary: dh.is_primary,
    position_title: dh.position_title,
    department: dh.department,
    start_date: dh.start_date,
    end_date: dh.end_date,
    is_active: dh.is_active,
    hospital: {
      id: dh.hospital.id,
      name: dh.hospital.name,
      city: dh.hospital.city,
      type: dh.hospital.type,
      rating: dh.hospital.rating
    }
  })) || []);

  const handleFormSubmit = (data: any) => {
    // Validate required relationships
    if (hospitals.length === 0) {
      alert('At least one hospital affiliation is required');
      return;
    }

    if (specialties.length === 0) {
      alert('At least one specialty is required');
      return;
    }

    // Validate only one primary hospital
    const primaryHospitals = hospitals.filter((h: { is_primary: any; }) => h.is_primary);
    if (primaryHospitals.length > 1) {
      alert('Only one hospital can be marked as primary');
      return;
    }

    // Validate only one primary specialty
    const primarySpecialties = specialties.filter((s: { is_primary: any; }) => s.is_primary);
    if (primarySpecialties.length > 1) {
      alert('Only one specialty can be marked as primary');
      return;
    }

    // Transform data for new many-to-many schema
    const transformedData = {
      ...data,
      specialties,
      doctor_hospitals: hospitals.map((h: { hospital_id: any; is_primary: any; position_title: any; department: any; start_date: any; end_date: any; is_active: any; }) => ({
        hospital_id: h.hospital_id,
        is_primary: h.is_primary,
        position_title: h.position_title,
        department: h.department,
        start_date: h.start_date,
        end_date: h.end_date,
        is_active: h.is_active
      }))
    };

    // Remove legacy fields that are no longer needed
    delete transformedData.hospitals;
    delete transformedData.hospital_id;
    
    console.log('Submitting doctor data:', transformedData);
    onSubmit(transformedData);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Form Header */}
        

        {/* Profile Image Upload */}
        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto">
              <ImageUpload
                value={watch('profile_image') || ''}
                onChange={(url) => setValue('profile_image', url as string)}
                placeholder="Upload doctor's profile photo"
                accept="image/*"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Recommended size: 400x400px. Supports JPG, PNG, and WebP formats.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium flex items-center gap-1">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="first_name" 
                  {...register('first_name')} 
                  placeholder="Enter doctor's first name"
                  className="h-10"
                />
                {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium flex items-center gap-1">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="last_name" 
                  {...register('last_name')} 
                  placeholder="Enter doctor's last name"
                  className="h-10"
                />
                {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input 
                  id="title" 
                  {...register('title')} 
                  placeholder="MD, PhD, DO, etc."
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium flex items-center gap-1">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="slug" 
                  {...register('slug')} 
                  placeholder="e.g., john-smith-cardiologist"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Used in the doctor's profile URL</p>
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message as any}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number" className="text-sm font-medium flex items-center gap-1">
                  Medical License Number <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="license_number" 
                  {...register('license_number')} 
                  placeholder="Enter medical license number"
                  className="h-10"
                />
                {errors.license_number && <p className="text-xs text-destructive">{errors.license_number.message as any}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select defaultValue={defaultValues?.gender} onValueChange={(value) => setValue('gender', value as any)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="NON_BINARY">Non-binary</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-sm font-medium">Date of Birth</Label>
                <Input 
                  id="date_of_birth" 
                  type="date" 
                  {...register('date_of_birth')}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience" className="text-sm font-medium">Years of Experience</Label>
                <Input 
                  id="years_of_experience" 
                  type="number" 
                  {...register('years_of_experience', { valueAsNumber: true })} 
                  placeholder="e.g., 10" 
                  min="0" 
                  max="70"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography" className="text-sm font-medium">Professional Biography</Label>
              <RichTextEditor 
                value={watch('biography') || ''} 
                onChange={(value) => setValue('biography', value)}
                placeholder="Write a detailed biography about the doctor's background, experience, and expertise..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Include information about medical training, areas of expertise, and professional achievements
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconBuildingHospital className="h-5 w-5" />
              Hospital Affiliations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DoctorHospitalSelector 
              value={hospitals} 
              onChange={setHospitals}
              maxSelection={10}
            />
            {hospitals.length === 0 && <p className="text-sm text-destructive mt-2">At least one hospital affiliation is required</p>}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconStethoscope className="h-5 w-5" />
              Medical Specialties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SpecialtySelector 
              value={specialties} 
              onChange={setSpecialties}
              maxSelection={5}
            />
            {specialties.length === 0 && <p className="text-sm text-destructive mt-2">At least one specialty is required</p>}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconMail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email')} 
                  placeholder="doctor@example.com"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input 
                  id="phone" 
                  {...register('phone')} 
                  placeholder="+1 (555) 123-4567"
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Media */}
        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconBriefcase className="h-5 w-5" />
              Additional Media & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video_intro" className="text-sm font-medium">Video Introduction URL</Label>
              <Input 
                id="video_intro" 
                type="url"
                {...register('video_intro')} 
                placeholder="https://youtube.com/watch?v=..."
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Link to a video introduction or welcome message from the doctor
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Credential Documents</Label>
              <ImageUpload
                value={watch('credentials') || []}
                onChange={(urls) => setValue('credentials', urls as string[])}
                placeholder="Upload medical certificates, diplomas, etc."
                accept="image/*,.pdf"
                multiple={true}
                maxFiles={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Upload certificates, diplomas, licenses, and other professional credentials
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconLanguage className="h-5 w-5" />
                Languages
                <Badge variant="secondary">{languageFields.length}</Badge>
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => appendLanguage('')}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Language
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <Input 
                  {...register(`languages.${index}` as any)} 
                  placeholder="e.g., English, Spanish, French"
                  className="h-10"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeLanguage(index)}
                  className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {languageFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No languages added. Click "Add Language" to get started.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconSchool className="h-5 w-5" />
                Education
                <Badge variant="secondary">{educationFields.length}</Badge>
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ degree: '', school: '', year: undefined })}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Degree</Label>
                    <Input 
                      {...register(`education.${index}.degree` as any)} 
                      placeholder="e.g., MD, PhD, DO"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Institution</Label>
                    <Input 
                      {...register(`education.${index}.school` as any)} 
                      placeholder="University/Medical School"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Year</Label>
                    <Input 
                      type="number" 
                      {...register(`education.${index}.year` as any, { valueAsNumber: true })} 
                      placeholder="Graduation Year" 
                      min="1950" 
                      max={new Date().getFullYear()}
                      className="h-10"
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeEducation(index)}
                  className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {educationFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No education records added. Click "Add Education" to get started.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconCurrencyDollar className="h-5 w-5" />
              Consultation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="consultation_fee" className="text-sm font-medium">Consultation Fee (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="consultation_fee" 
                    type="number" 
                    step="0.01" 
                    {...register('consultation_fee', { valueAsNumber: true })} 
                    placeholder="150.00" 
                    min="0" 
                    max="10000"
                    className="h-10 pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Standard consultation fee for patients</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation_duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Input 
                  id="consultation_duration" 
                  type="number" 
                  {...register('consultation_duration', { valueAsNumber: true })} 
                  placeholder="30" 
                  min="15" 
                  max="240"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Typical appointment duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <IconSettings className="h-5 w-5" />
              Status & Availability Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_active" className="text-sm font-medium">Active Status</Label>
                    <p className="text-xs text-muted-foreground">Doctor profile is visible to patients</p>
                  </div>
                  <Checkbox 
                    id="is_active" 
                    checked={watch('is_active')} 
                    onCheckedChange={(checked) => setValue('is_active', !!checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_verified" className="text-sm font-medium">Verified Doctor</Label>
                    <p className="text-xs text-muted-foreground">Medical credentials have been verified</p>
                  </div>
                  <Checkbox 
                    id="is_verified" 
                    checked={watch('is_verified')} 
                    onCheckedChange={(checked) => setValue('is_verified', !!checked)} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_accepting_new_patients" className="text-sm font-medium">Accepting New Patients</Label>
                    <p className="text-xs text-muted-foreground">Available for new patient appointments</p>
                  </div>
                  <Checkbox 
                    id="is_accepting_new_patients" 
                    checked={watch('is_accepting_new_patients')} 
                    onCheckedChange={(checked) => setValue('is_accepting_new_patients', !!checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_telehealth_available" className="text-sm font-medium">Telehealth Available</Label>
                    <p className="text-xs text-muted-foreground">Offers virtual consultations</p>
                  </div>
                  <Checkbox 
                    id="is_telehealth_available" 
                    checked={watch('is_telehealth_available')} 
                    onCheckedChange={(checked) => setValue('is_telehealth_available', !!checked)} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || specialties.length === 0 || hospitals.length === 0}
            size="lg"
            className="w-full sm:w-auto min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </div>
            ) : (
              defaultValues?.id ? 'Update Doctor' : 'Create Doctor'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
