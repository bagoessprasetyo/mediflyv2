import { z } from 'zod';

export const specialtySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  code: z.string().min(2, 'Code is required').max(20, 'Code is too long').regex(/^[A-Z0-9_-]+$/, 'Code must be uppercase with underscores or hyphens').optional().nullable(),
  description: z.string().optional(),
  
  category: z.enum([
    'MEDICAL',
    'SURGICAL', 
    'DIAGNOSTIC',
    'THERAPEUTIC',
    'EMERGENCY',
    'PREVENTIVE',
    'REHABILITATION',
    'MENTAL_HEALTH',
    'PEDIATRIC',
    'GERIATRIC',
    'OTHER',
  ]),
  
  color_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional().nullable(),
  icon: z.string().optional().nullable(),
  
  is_active: z.boolean().default(true),
  requires_certification: z.boolean().default(false),
  avg_consultation_duration_minutes: z.number().int().positive().optional().nullable(),
  
  sort_order: z.number().int().min(0).default(0),
});

export type SpecialtyFormData = z.infer<typeof specialtySchema>;

export const specialtyCategories = [
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'SURGICAL', label: 'Surgical' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic' },
  { value: 'THERAPEUTIC', label: 'Therapeutic' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'PREVENTIVE', label: 'Preventive' },
  { value: 'REHABILITATION', label: 'Rehabilitation' },
  { value: 'MENTAL_HEALTH', label: 'Mental Health' },
  { value: 'PEDIATRIC', label: 'Pediatric' },
  { value: 'GERIATRIC', label: 'Geriatric' },
  { value: 'OTHER', label: 'Other' },
] as const;