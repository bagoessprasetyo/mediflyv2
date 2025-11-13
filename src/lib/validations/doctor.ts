import { z } from 'zod';

// Doctor Hospital Affiliation Schema
export const doctorHospitalSchema = z.object({
  hospital_id: z.string().uuid('Invalid hospital ID'),
  is_primary: z.boolean().default(false),
  position_title: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const doctorSchema = z.object({
  first_name: z.string().min(2, 'First name is required').max(50, 'First name is too long'),
  last_name: z.string().min(2, 'Last name is required').max(50, 'Last name is too long'),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  title: z.string().max(20, 'Title is too long').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  date_of_birth: z.date().optional().nullable(),

  // Contact
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number is too long').optional(),

  // Professional
  license_number: z.string().min(5, 'License number is required').max(50, 'License number is too long'),
  years_of_experience: z.number().int().min(0, 'Experience cannot be negative').max(70, 'Experience seems too high').optional().nullable(),
  biography: z.string().max(2000, 'Biography is too long').optional(),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required').max(100, 'Degree is too long'),
    school: z.string().min(1, 'School is required').max(200, 'School name is too long'),
    year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  })).optional().default([]),
  languages: z.array(z.string().min(1).max(50)).min(1, 'At least one language is required').default(['English']),

  // Media
  profile_image: z.string().optional().nullable().refine((val) => !val || z.string().url().safeParse(val).success, 'Invalid image URL'),
  video_intro: z.string().url('Invalid video URL').optional().nullable(),
  credentials: z.array(z.string().url('Invalid credential URL')).optional().nullable(),

  // Multiple Hospitals Support (handled separately in form)
  // Note: hospitals field is transformed to doctor_hospitals in form submission

  // Consultation
  consultation_fee: z.number().positive('Consultation fee must be positive').max(10000, 'Fee seems too high').optional().nullable(),
  consultation_duration: z.number().int().positive('Duration must be positive').min(15, 'Minimum 15 minutes').max(240, 'Maximum 4 hours').default(30),

  // Status
  is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  is_accepting_new_patients: z.boolean().default(true),
  is_telehealth_available: z.boolean().default(false),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
export type DoctorHospitalFormData = z.infer<typeof doctorHospitalSchema>;

export const doctorSpecialtySchema = z.object({
  specialty_id: z.string().uuid('Invalid specialty ID'),
  is_primary: z.boolean().default(false),
  years_in_specialty: z.number().int().min(0, 'Years cannot be negative').max(70, 'Years seems too high').optional().nullable(),
  board_certified: z.boolean().default(false),
  certification_date: z.date().optional().nullable(),
});

export type DoctorSpecialtyFormData = z.infer<typeof doctorSpecialtySchema>;

export const availabilitySchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  slot_duration: z.number().int().positive().default(30),
  location_type: z.enum(['IN_PERSON', 'TELEHEALTH', 'HOME_VISIT', 'HYBRID']).default('IN_PERSON'),
  location: z.string().optional().nullable(),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

// Helper functions
export function generateDoctorSlug(firstName: string, lastName: string): string {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  return fullName
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function validateDoctorSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 100;
}

// Form data transformation helpers
export function transformDoctorFormData(data: DoctorFormData) {
  // Convert legacy hospital_id to hospitals array if needed
  const dataWithLegacy = data as DoctorFormData & { hospital_id?: string; hospitals?: any[] };
  if (dataWithLegacy.hospital_id && (!dataWithLegacy.hospitals || dataWithLegacy.hospitals.length === 0)) {
    dataWithLegacy.hospitals = [{
      hospital_id: dataWithLegacy.hospital_id,
      is_primary: true,
      is_active: true,
      position_title: null,
      department: null,
      start_date: null,
      end_date: null,
    }];
  }
  
  // Remove legacy hospital_id
  delete dataWithLegacy.hospital_id;
  
  return data;
}
