import { z } from 'zod';

export const treatmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),

  hospital_id: z.string().uuid('Hospital is required'),
  doctor_id: z.string().uuid().optional().nullable(),
  specialty_id: z.string().uuid().optional().nullable(),

  category: z.enum([
    'SURGERY',
    'THERAPY',
    'DIAGNOSTIC',
    'WELLNESS',
    'EMERGENCY',
    'PREVENTIVE',
    'REHABILITATION',
    'COSMETIC',
    'DENTAL',
    'OTHER',
  ]),
  duration_minutes: z.number().int().positive().optional().nullable(),
  sessions_required: z.number().int().positive().default(1),

  price: z.number().positive().optional().nullable(),
  price_range_min: z.number().positive().optional().nullable(),
  price_range_max: z.number().positive().optional().nullable(),
  currency: z.string().default('USD'),

  includes: z.array(z.object({ item: z.string(), description: z.string().optional() })).optional().nullable(),

  requirements: z.array(z.string()).optional().nullable(),
  contraindications: z.array(z.string()).optional().nullable(),

  images: z.array(z.string().url()).optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  brochure_url: z.string().url().optional().nullable(),

  is_available: z.boolean().default(true),
  waiting_time_days: z.number().int().min(0).optional().nullable(),
  is_featured: z.boolean().default(false),

  success_rate: z.number().min(0).max(100).optional().nullable(),
}).refine(
  (data) => {
    const hasFixedPrice = data.price !== null && data.price !== undefined;
    const hasPriceRange =
      (data.price_range_min !== null && data.price_range_min !== undefined) &&
      (data.price_range_max !== null && data.price_range_max !== undefined);

    return hasFixedPrice !== hasPriceRange;
  },
  {
    message: 'Must provide either fixed price OR price range (not both)',
    path: ['price'],
  }
).refine(
  (data) => {
    if (data.price_range_min && data.price_range_max) {
      return data.price_range_min < data.price_range_max;
    }
    return true;
  },
  {
    message: 'Minimum price must be less than maximum price',
    path: ['price_range_min'],
  }
);

export type TreatmentFormData = z.infer<typeof treatmentSchema>;
