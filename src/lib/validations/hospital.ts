import { z } from 'zod';

export const hospitalSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().nullable().optional(),
  
  // Contact
  email: z.string().email().nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  
  // Address
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(5, 'Zip code is required'),
  country: z.string(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  
  // Hospital Type
  type: z.enum([
    'GENERAL',
    'SPECIALTY',
    'TEACHING',
    'CLINIC',
    'URGENT_CARE',
    'REHABILITATION',
    'PSYCHIATRIC',
    'CHILDRENS',
    'MATERNITY',
    'MILITARY',
    'VETERANS'
  ]),
  
  // Details
  bed_count: z.number().int().positive().nullable().optional(),
  established: z.string().nullable().optional(),
  emergency_services: z.boolean(),
  trauma_level: z.string().nullable().optional(),
  
  // Media
  logo: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).nullable().optional(),
  virtual_tour: z.string().url().nullable().optional(),
  
  // Operating Hours
  operating_hours: z.record(z.string(), z.string()).nullable().optional(),
  
  // Status
  is_active: z.boolean(),
  is_verified: z.boolean(),
  is_featured: z.boolean(),
  
  // Facility Relationships (for form only, processed separately)
  facility_relationships: z.array(z.object({
    facility_id: z.string(),
    primary_hospital: z.boolean(),
    access_level: z.enum(['FULL', 'LIMITED', 'EMERGENCY_ONLY']),
    cost_sharing_percentage: z.number().min(0).max(100),
    notes: z.string().optional()
  })).optional(),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;