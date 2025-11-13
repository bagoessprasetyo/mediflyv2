'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrackedQuery, useTrackedMutation } from '@/hooks/use-tracked-query';
import { createClient } from '@/lib/supabase/client';
import { SpecialtyFormData } from '@/lib/validations/specialty';
import { toast } from 'sonner';

export const specialtyKeys = {
  all: ['specialties'] as const,
  lists: () => [...specialtyKeys.all, 'list'] as const,
  list: (filters: any) => [...specialtyKeys.lists(), filters] as const,
  details: () => [...specialtyKeys.all, 'detail'] as const,
  detail: (id: string) => [...specialtyKeys.details(), id] as const,
};

export function useSpecialties(filters?: {
  search?: string;
  category?: string;
  is_active?: boolean;
}) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: specialtyKeys.list(filters),
    trackingEndpoint: '/specialties',
    queryFn: async () => {
      let query: any = supabase
        .from('specialties')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useSpecialty(id: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: specialtyKeys.detail(id),
    trackingEndpoint: `/specialties/${id}`,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSpecialty() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/specialties',
    trackingAction: 'POST',
    mutationFn: async (data: SpecialtyFormData) => {
      const { data: specialty, error } = await supabase
        .from('specialties')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return specialty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
      toast.success('Specialty created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create specialty');
    },
  });
}

export function useUpdateSpecialty(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: `/specialties/${id}`,
    trackingAction: 'PUT',
    mutationFn: async (data: Partial<SpecialtyFormData>) => {
      const { data: specialty, error } = await supabase
        .from('specialties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return specialty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
      toast.success('Specialty updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update specialty');
    },
  });
}

export function useDeleteSpecialty() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/specialties',
    trackingAction: 'DELETE',
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('specialties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
      toast.success('Specialty deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete specialty');
    },
  });
}
