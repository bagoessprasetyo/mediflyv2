'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrackedQuery, useTrackedMutation } from '@/hooks/use-tracked-query';
import { createClient } from '@/lib/supabase/client';
import { TreatmentFormData } from '@/lib/validations/treatment';
import { toast } from 'sonner';

export const treatmentKeys = {
  all: ['treatments'] as const,
  lists: () => [...treatmentKeys.all, 'list'] as const,
  list: (filters: any) => [...treatmentKeys.lists(), filters] as const,
  details: () => [...treatmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...treatmentKeys.details(), id] as const,
};

export function useTreatments(filters?: {
  search?: string;
  hospital_id?: string;
  category?: string;
  is_available?: boolean;
}) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: treatmentKeys.list(filters),
    trackingEndpoint: '/treatments',
    queryFn: async () => {
      let query: any = supabase
        .from('treatments')
        .select(`
          *,
          hospital:hospitals(id, name, city),
          doctor:doctors(id, first_name, last_name),
          specialty:specialties(id, name)
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.hospital_id) {
        query = query.eq('hospital_id', filters.hospital_id);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.is_available !== undefined) {
        query = query.eq('is_available', filters.is_available);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useTreatment(id: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: treatmentKeys.detail(id),
    trackingEndpoint: `/treatments/${id}`,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treatments')
        .select(`
          *,
          hospital:hospitals(*),
          doctor:doctors(id, first_name, last_name, title),
          specialty:specialties(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/treatments',
    trackingAction: 'POST',
    mutationFn: async (data: TreatmentFormData) => {
      const { data: treatment, error } = await supabase
        .from('treatments')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return treatment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentKeys.lists() });
      toast.success('Treatment created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create treatment');
    },
  });
}

export function useUpdateTreatment(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: `/treatments/${id}`,
    trackingAction: 'PUT',
    mutationFn: async (data: Partial<TreatmentFormData>) => {
      const { data: treatment, error } = await supabase
        .from('treatments')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return treatment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: treatmentKeys.lists() });
      toast.success('Treatment updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update treatment');
    },
  });
}

export function useDeleteTreatment() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/treatments',
    trackingAction: 'DELETE',
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentKeys.lists() });
      toast.success('Treatment deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete treatment');
    },
  });
}
