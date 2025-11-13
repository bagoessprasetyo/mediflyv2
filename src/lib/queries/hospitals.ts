'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Hospital } from '@/types/database.types';
import { HospitalFormData } from '@/lib/validations/hospital';
import { toast } from 'sonner';

// Query Keys
export const hospitalKeys = {
  all: ['hospitals'] as const,
  lists: () => [...hospitalKeys.all, 'list'] as const,
  list: (filters: any) => [...hospitalKeys.lists(), filters] as const,
  details: () => [...hospitalKeys.all, 'detail'] as const,
  detail: (id: string) => [...hospitalKeys.details(), id] as const,
  search: (query: string, filters: any) => [...hospitalKeys.all, 'search', query, filters] as const,
  similar: (id: string) => [...hospitalKeys.all, 'similar', id] as const,
  embeddings: () => [...hospitalKeys.all, 'embeddings'] as const,
};

// Get all hospitals with filters
export function useHospitals(filters?: {
  search?: string;
  city?: string;
  type?: string;
  is_active?: boolean;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: hospitalKeys.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('hospitals')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Hospital[];
    },
  });
}

// Get single hospital
export function useHospital(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: hospitalKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Hospital;
    },
    enabled: !!id,
  });
}

// Get hospital with facility relationships
export function useHospitalWithFacilities(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [...hospitalKeys.detail(id), 'with-facilities'],
    queryFn: async () => {
      // Get hospital data
      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();

      if (hospitalError) throw hospitalError;

      // Get facility relationships
      const { data: relationships, error: relError } = await supabase
        .from('hospital_facilities')
        .select(`
          *,
          facilities (*)
        `)
        .eq('hospital_id', id)
        .order('primary_hospital', { ascending: false })
        .order('created_at', { ascending: true });

      if (relError) throw relError;

      return {
        ...hospital,
        facility_relationships: relationships || []
      };
    },
    enabled: !!id,
  });
}

// Get hospital with both facility and doctor relationships
export function useHospitalWithDoctors(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [...hospitalKeys.detail(id), 'with-doctors'],
    queryFn: async () => {
      // Get hospital data
      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();

      if (hospitalError) throw hospitalError;

      // Get facility relationships
      const { data: relationships, error: relError } = await supabase
        .from('hospital_facilities')
        .select(`
          *,
          facilities (*)
        `)
        .eq('hospital_id', id)
        .order('primary_hospital', { ascending: false })
        .order('created_at', { ascending: true });

      if (relError) throw relError;

      // Get associated doctors
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctor_hospitals')
        .select(`
          *,
          doctor:doctors!doctor_hospitals_doctor_id_fkey (
            id,
            first_name,
            last_name,
            title,
            profile_image,
            years_of_experience,
            consultation_fee,
            is_active,
            is_verified,
            is_accepting_new_patients,
            is_telehealth_available,
            doctor_specialties (
              id,
              is_primary,
              board_certified,
              specialty:specialties (
                id,
                name,
                category,
                color_code
              )
            )
          )
        `)
        .eq('hospital_id', id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (doctorsError) throw doctorsError;

      return {
        ...hospital,
        facility_relationships: relationships || [],
        doctor_relationships: doctors || []
      };
    },
    enabled: !!id,
  });
}

// Create hospital
export function useCreateHospital() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data: HospitalFormData) => {
      const { facility_relationships, ...hospitalData } = data;
      
      // Create hospital first
      const { data: hospital, error } = await supabase
        .from('hospitals')
        .insert(hospitalData)
        .select()
        .single();

      if (error) throw error;

      // Create facility relationships if any selected
      if (facility_relationships && facility_relationships.length > 0 && hospital) {
        const relationships = facility_relationships.map((rel) => ({
          hospital_id: hospital.id,
          facility_id: rel.facility_id,
          primary_hospital: rel.primary_hospital,
          access_level: rel.access_level,
          cost_sharing_percentage: rel.cost_sharing_percentage,
          notes: rel.notes || null,
        }));

        const { error: relationshipError } = await supabase
          .from('hospital_facilities')
          .insert(relationships);

        if (relationshipError) {
          console.error('Error creating facility relationships:', relationshipError);
          throw relationshipError;
        }
      }

      return hospital;
    },
    onSuccess: (hospital) => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      // Also invalidate facilities queries
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Hospital created successfully with facility relationships');
    },
    onError: (error: any) => {
      toast.error(`Error creating hospital: ${error.message}`);
    },
  });
}

// Helper function to get facility display name from category
function getFacilityName(category: string): string {
  const facilityNames: Record<string, string> = {
    DIAGNOSTIC: 'Diagnostic Services',
    LABORATORY: 'Laboratory Services',
    PHARMACY: 'Pharmacy',
    EMERGENCY: 'Emergency Department',
    INTENSIVE_CARE: 'Intensive Care Unit',
    OPERATING_ROOM: 'Operating Rooms',
    PATIENT_ROOM: 'Patient Rooms',
    CAFETERIA: 'Cafeteria',
    PARKING: 'Parking Facilities',
    ACCESSIBILITY: 'Accessibility Services',
    OTHER: 'Other Services',
  };
  return facilityNames[category] || category;
}

// Update hospital
export function useUpdateHospital(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data: Partial<HospitalFormData>) => {
      const { data: hospital, error } = await supabase
        .from('hospitals')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return hospital;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      toast.success('Hospital updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating hospital: ${error.message}`);
    },
  });
}

// Delete hospital
export function useDeleteHospital() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      toast.success('Hospital deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting hospital: ${error.message}`);
    },
  });
}

// Semantic search hooks
export function useSemanticHospitalSearch(
  query: string,
  filters?: {
    city?: string;
    state?: string;
    type?: string;
    emergency_services?: boolean;
    is_verified?: boolean;
    trauma_level?: string;
  },
  options?: {
    semantic_weight?: number;
    text_weight?: number;
    similarity_threshold?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: hospitalKeys.search(query, { filters, options }),
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return { results: [], metadata: {} };
      }

      const response = await fetch('/api/hospitals/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          filters: filters || {},
          options: options || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      return await response.json();
    },
    enabled: options?.enabled !== false && !!query && query.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

// Similar hospitals hook
export function useSimilarHospitals(
  hospitalId: string,
  options?: {
    threshold?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: hospitalKeys.similar(hospitalId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.threshold) params.append('threshold', options.threshold.toString());
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/hospitals/${hospitalId}/similar?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch similar hospitals');
      }

      return await response.json();
    },
    enabled: options?.enabled !== false && !!hospitalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Embedding management hooks
export function useEmbeddingStatus() {
  return useQuery({
    queryKey: hospitalKeys.embeddings(),
    queryFn: async () => {
      const response = await fetch('/api/hospitals/embeddings');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch embedding status');
      }

      return await response.json();
    },
    refetchInterval: 5000, // Refetch every 5 seconds when indexing
    refetchOnWindowFocus: true,
  });
}

export function useStartEmbeddingIndexing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options?: {
      batchSize?: number;
      forceRegenerate?: boolean;
    }) => {
      const response = await fetch('/api/hospitals/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options || {}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start indexing');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.embeddings() });
      toast.success('Hospital indexing started successfully');
    },
    onError: (error: any) => {
      toast.error(`Error starting indexing: ${error.message}`);
    },
  });
}

export function useReindexHospitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hospitalIds: string[]) => {
      const response = await fetch('/api/hospitals/embeddings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hospital_ids: hospitalIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reindex hospitals');
      }

      return await response.json();
    },
    onSuccess: (_, hospitalIds) => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.embeddings() });
      toast.success(`Successfully reindexed ${hospitalIds.length} hospitals`);
    },
    onError: (error: any) => {
      toast.error(`Error reindexing hospitals: ${error.message}`);
    },
  });
}

export function useResetEmbeddings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/hospitals/embeddings', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset embeddings');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hospitalKeys.embeddings() });
      toast.success('All embeddings have been reset successfully');
    },
    onError: (error: any) => {
      toast.error(`Error resetting embeddings: ${error.message}`);
    },
  });
}