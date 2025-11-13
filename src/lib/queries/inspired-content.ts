'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrackedQuery, useTrackedMutation } from '@/hooks/use-tracked-query';
import { createClient } from '@/lib/supabase/client';
import { 
  InspiredCategoryFormData, 
  InspiredContentFormData, 
  InspiredContentHospitalFormData,
  InspiredContentFilters 
} from '@/lib/validations/inspired-content';
import { toast } from 'sonner';

export const inspiredContentKeys = {
  all: ['inspired-content'] as const,
  categories: () => [...inspiredContentKeys.all, 'categories'] as const,
  content: () => [...inspiredContentKeys.all, 'content'] as const,
  contentLists: () => [...inspiredContentKeys.content(), 'list'] as const,
  contentList: (filters: any) => [...inspiredContentKeys.contentLists(), filters] as const,
  contentDetails: () => [...inspiredContentKeys.content(), 'detail'] as const,
  contentDetail: (id: string) => [...inspiredContentKeys.contentDetails(), id] as const,
  contentBySlug: (slug: string) => [...inspiredContentKeys.content(), 'slug', slug] as const,
  contentHospitals: (contentId: string) => [...inspiredContentKeys.contentDetail(contentId), 'hospitals'] as const,
};

// Categories
export function useInspiredCategories() {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: inspiredContentKeys.categories(),
    trackingEndpoint: '/inspired-content/categories',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspired_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInspiredCategory() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content/categories',
    trackingAction: 'POST',
    mutationFn: async (data: InspiredCategoryFormData) => {
      const { data: category, error } = await supabase
        .from('inspired_categories')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.categories() });
      toast.success('Category created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create category');
    },
  });
}

// Inspired Content
export function useInspiredContent(filters?: InspiredContentFilters) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: inspiredContentKeys.contentList(filters),
    trackingEndpoint: '/inspired-content',
    queryFn: async () => {
      let query = supabase
        .from('inspired_content')
        .select(`
          *,
          category:inspired_categories(id, name, color_code),
          hospitals_count:inspired_content_hospitals(count)
        `)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters?.content_type) {
        query = query.eq('content_type', filters.content_type);
      }
      if (filters?.target_country) {
        query = query.eq('target_country', filters.target_country);
      }
      if (filters?.target_city) {
        query = query.ilike('target_city', `%${filters.target_city}%`);
      }
      if (filters?.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }
      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useInspiredContentItem(id: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: inspiredContentKeys.contentDetail(id),
    trackingEndpoint: `/inspired-content/${id}`,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspired_content')
        .select(`
          *,
          category:inspired_categories(id, name, color_code),
          hospitals:inspired_content_hospitals(
            *,
            hospital:hospitals(id, name, city, type, featured_image_url, rating)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useInspiredContentBySlug(slug: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: inspiredContentKeys.contentBySlug(slug),
    trackingEndpoint: `/inspired-content/slug/${slug}`,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspired_content')
        .select(`
          *,
          category:inspired_categories(id, name, color_code),
          hospitals:inspired_content_hospitals(
            *,
            hospital:hospitals(id, name, city, type, featured_image_url, rating)
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      // Increment view count
      await supabase
        .from('inspired_content')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateInspiredContent() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content',
    trackingAction: 'POST',
    mutationFn: async (data: InspiredContentFormData) => {
      const { data: content, error } = await supabase
        .from('inspired_content')
        .insert({
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentLists() });
      toast.success('Content created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create content');
    },
  });
}

export function useUpdateInspiredContent(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: `/inspired-content/${id}`,
    trackingAction: 'PUT',
    mutationFn: async (data: Partial<InspiredContentFormData>) => {
      const { data: content, error } = await supabase
        .from('inspired_content')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentDetail(id) });
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentLists() });
      toast.success('Content updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update content');
    },
  });
}

export function useDeleteInspiredContent() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content',
    trackingAction: 'DELETE',
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inspired_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentLists() });
      toast.success('Content deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete content');
    },
  });
}

// Content Hospitals
export function useInspiredContentHospitals(contentId: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: inspiredContentKeys.contentHospitals(contentId),
    trackingEndpoint: `/inspired-content/${contentId}/hospitals`,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspired_content_hospitals')
        .select(`
          *,
          hospital:hospitals(id, name, city, type, featured_image_url, rating)
        `)
        .eq('content_id', contentId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!contentId,
  });
}

export function useAddHospitalToContent() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content/hospitals',
    trackingAction: 'POST',
    mutationFn: async (data: InspiredContentHospitalFormData) => {
      const { data: contentHospital, error } = await supabase
        .from('inspired_content_hospitals')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return contentHospital;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentHospitals(data.content_id) });
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentDetail(data.content_id) });
      toast.success('Hospital added to content successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add hospital to content');
    },
  });
}

export function useUpdateContentHospital() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content/hospitals',
    trackingAction: 'PUT',
    mutationFn: async ({ id, data }: { id: string; data: Partial<InspiredContentHospitalFormData> }) => {
      const { data: contentHospital, error } = await supabase
        .from('inspired_content_hospitals')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return contentHospital;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentHospitals(data.content_id) });
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentDetail(data.content_id) });
      toast.success('Hospital updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update hospital');
    },
  });
}

export function useRemoveHospitalFromContent() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content/hospitals',
    trackingAction: 'DELETE',
    mutationFn: async (id: string) => {
      // Get the content_id before deleting
      const { data: existing } = await supabase
        .from('inspired_content_hospitals')
        .select('content_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('inspired_content_hospitals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return existing?.content_id;
    },
    onSuccess: (contentId) => {
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentHospitals(contentId) });
        queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentDetail(contentId) });
      }
      toast.success('Hospital removed from content successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to remove hospital from content');
    },
  });
}

// Reorder hospitals in content
export function useReorderContentHospitals() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/inspired-content/hospitals/reorder',
    trackingAction: 'PUT',
    mutationFn: async ({ contentId, hospitalOrders }: { contentId: string; hospitalOrders: { id: string; position: number }[] }) => {
      const updatePromises = hospitalOrders.map(({ id, position }) =>
        supabase
          .from('inspired_content_hospitals')
          .update({ position })
          .eq('id', id)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to reorder some hospitals');
      }

      return { contentId };
    },
    onSuccess: ({ contentId }) => {
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentHospitals(contentId) });
      queryClient.invalidateQueries({ queryKey: inspiredContentKeys.contentDetail(contentId) });
      toast.success('Hospital order updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to reorder hospitals');
    },
  });
}

// Featured content for public pages
export function useFeaturedInspiredContent(limit = 6) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['inspired-content', 'featured', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspired_content')
        .select(`
          id,
          title,
          subtitle,
          slug,
          featured_image_url,
          excerpt,
          target_country,
          target_city,
          view_count,
          category:inspired_categories(id, name, color_code)
        `)
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}