import { z } from 'zod';

export const facilitySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.enum([
    'DIAGNOSTIC',
    'LABORATORY',
    'PHARMACY',
    'EMERGENCY',
    'INTENSIVE_CARE',
    'OPERATING_ROOM',
    'PATIENT_ROOM',
    'CAFETERIA',
    'PARKING',
    'ACCESSIBILITY',
    'OTHER',
  ]),
  is_available: z.boolean().default(true),
  capacity: z.number().int().positive().optional().nullable(),
});

export const hospitalFacilityRelationshipSchema = z.object({
  hospital_id: z.string().uuid('Hospital is required'),
  facility_id: z.string().uuid('Facility is required'),
  primary_hospital: z.boolean().default(false),
  access_level: z.enum(['FULL', 'LIMITED', 'EMERGENCY_ONLY']).default('FULL'),
  cost_sharing_percentage: z.number().min(0).max(100).default(100),
  notes: z.string().optional().nullable(),
});

export const facilityWithHospitalsSchema = facilitySchema.extend({
  hospital_relationships: z.array(hospitalFacilityRelationshipSchema).min(1, 'At least one hospital is required'),
});

export const facilityUpdateSchema = facilitySchema.partial();

export type FacilityFormData = z.infer<typeof facilitySchema>;
export type HospitalFacilityRelationship = z.infer<typeof hospitalFacilityRelationshipSchema>;
export type FacilityWithHospitals = z.infer<typeof facilityWithHospitalsSchema>;

// Helper schemas for API requests
export const createFacilityRequestSchema = z.object({
  facility: facilitySchema,
  hospital_relationships: z.array(hospitalFacilityRelationshipSchema).min(1),
});

export const updateFacilityHospitalsSchema = z.object({
  hospital_relationships: z.array(hospitalFacilityRelationshipSchema),
});

export type CreateFacilityRequest = z.infer<typeof createFacilityRequestSchema>;
export type UpdateFacilityHospitalsRequest = z.infer<typeof updateFacilityHospitalsSchema>;
