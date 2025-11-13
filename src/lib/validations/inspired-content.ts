import { z } from 'zod';

// Inspired Category Schema
export const inspiredCategorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// Content types
export const contentTypes = [
  { value: 'hospital_list', label: 'Hospital List' },
  { value: 'treatment_guide', label: 'Treatment Guide' },
  { value: 'specialty_guide', label: 'Specialty Guide' },
  { value: 'location_guide', label: 'Location Guide' },
  { value: 'comparison_guide', label: 'Comparison Guide' },
] as const;

// Target countries
export const targetCountries = [
  { value: 'thailand', label: 'Thailand' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'myanmar', label: 'Myanmar' },
  { value: 'cambodia', label: 'Cambodia' },
  { value: 'laos', label: 'Laos' },
  { value: 'brunei', label: 'Brunei' },
] as const;

// Main Inspired Content Schema
export const inspiredContentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  subtitle: z.string().max(300, 'Subtitle is too long').optional(),
  content_type: z.enum(['hospital_list', 'treatment_guide', 'specialty_guide', 'location_guide', 'comparison_guide']),
  category_id: z.string().uuid('Invalid category').optional().nullable(),
  
  // SEO & Display
  slug: z.string().min(3, 'Slug is required').max(200, 'Slug is too long').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  meta_description: z.string().max(160, 'Meta description should be under 160 characters').optional(),
  featured_image_url: z.string().optional().nullable().refine((val) => !val || z.string().url().safeParse(val).success, 'Invalid image URL'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  content: z.string().optional(), // Rich text content
  
  // Targeting
  target_country: z.enum(['thailand', 'malaysia', 'singapore', 'indonesia', 'philippines', 'vietnam', 'myanmar', 'cambodia', 'laos', 'brunei']).optional().nullable(),
  target_city: z.string().max(100, 'City name is too long').optional().nullable(),
  target_specialty: z.string().max(100, 'Specialty is too long').optional().nullable(),
  
  // Status & Publishing
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  published_at: z.date().optional().nullable(),
  
  // Display settings
  sort_order: z.number().int().min(0).default(0),
  
  // Hospital selection for inline form (not persisted directly)
  selected_hospitals: z.array(z.object({
    id: z.string(),
    name: z.string(),
    city: z.string().optional(),
    type: z.string().optional(),
    rating: z.number().optional(),
  })).optional().default([]),
});

// Hospital in Content Schema
export const inspiredContentHospitalSchema = z.object({
  content_id: z.string().uuid('Invalid content ID'),
  hospital_id: z.string().uuid('Invalid hospital ID'),
  
  // List positioning
  position: z.number().int().min(1, 'Position must be at least 1').max(50, 'Position cannot exceed 50'),
  
  // Custom content
  custom_title: z.string().max(200, 'Custom title is too long').optional().nullable(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  highlight_text: z.string().max(100, 'Highlight text is too long').optional().nullable(),
  custom_image_url: z.string().url('Invalid image URL').optional().nullable(),
  
  // Metrics
  rating_score: z.number().min(0).max(5).optional().nullable(),
  patient_count: z.number().int().min(0).optional().nullable(),
  price_range_min: z.number().positive().optional().nullable(),
  price_range_max: z.number().positive().optional().nullable(),
}).refine(
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

// Complete content with hospitals schema
export const inspiredContentWithHospitalsSchema = z.object({
  content: inspiredContentSchema,
  hospitals: z.array(inspiredContentHospitalSchema).optional(),
});

// Search/Filter schemas
export const inspiredContentFiltersSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  content_type: z.enum(['hospital_list', 'treatment_guide', 'specialty_guide', 'location_guide', 'comparison_guide']).optional(),
  target_country: z.enum(['thailand', 'malaysia', 'singapore', 'indonesia', 'philippines', 'vietnam', 'myanmar', 'cambodia', 'laos', 'brunei']).optional(),
  target_city: z.string().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

// Type exports
export type InspiredCategoryFormData = z.infer<typeof inspiredCategorySchema>;
export type InspiredContentFormData = z.infer<typeof inspiredContentSchema>;
export type InspiredContentHospitalFormData = z.infer<typeof inspiredContentHospitalSchema>;
export type InspiredContentWithHospitalsFormData = z.infer<typeof inspiredContentWithHospitalsSchema>;
export type InspiredContentFilters = z.infer<typeof inspiredContentFiltersSchema>;

// Helper functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 200;
}