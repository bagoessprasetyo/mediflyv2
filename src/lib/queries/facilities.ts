'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrackedQuery, useTrackedMutation } from '@/hooks/use-tracked-query';
import { createClient } from '@/lib/supabase/client';
import { 
  FacilityFormData, 
  CreateFacilityRequest, 
  UpdateFacilityHospitalsRequest, 
  HospitalFacilityRelationship 
} from '@/lib/validations/facility';
import { FacilityWithHospitals, Facility } from '@/types/database.types';
import { toast } from 'sonner';

export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (filters: any) => [...facilityKeys.lists(), filters] as const,
  byHospital: (hospitalId: string) => [...facilityKeys.all, 'hospital', hospitalId] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (id: string) => [...facilityKeys.details(), id] as const,
};

export function useFacilities(filters?: {
  hospital_id?: string;
  category?: string;
  is_available?: boolean;
}) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: facilityKeys.list(filters),
    trackingEndpoint: '/facilities',
    queryFn: async (): Promise<FacilityWithHospitals[]> => {
      let facilityQuery = supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) facilityQuery = facilityQuery.eq('category', filters.category);
      if (filters?.is_available !== undefined) facilityQuery = facilityQuery.eq('is_available', filters.is_available);

      const { data: facilities, error: facilityError } = await facilityQuery;
      if (facilityError) throw facilityError;

      if (!facilities || facilities.length === 0) return [];

      // Get hospital relationships for all facilities
      const facilityIds = facilities.map(f => f.id);
      
      let relationshipQuery = supabase
        .from('hospital_facilities')
        .select(`
          facility_id,
          primary_hospital,
          access_level,
          cost_sharing_percentage,
          notes,
          hospital:hospitals(id, name, city, state, type)
        `)
        .in('facility_id', facilityIds);

      // Filter by hospital if specified
      if (filters?.hospital_id) {
        relationshipQuery = relationshipQuery.eq('hospital_id', filters.hospital_id);
      }

      const { data: relationships, error: relationshipError } = await relationshipQuery;
      if (relationshipError) throw relationshipError;

      // Combine facilities with their hospital relationships
      const facilitiesWithHospitals: FacilityWithHospitals[] = facilities
        .map(facility => {
          const facilityRelationships = relationships?.filter(r => r.facility_id === facility.id) || [];
          
          // If filtering by hospital_id, only include facilities that have that relationship
          if (filters?.hospital_id && facilityRelationships.length === 0) {
            return null;
          }

          const hospitals = facilityRelationships.map(rel => ({
            ...rel.hospital,
            relationship: {
              primary_hospital: rel.primary_hospital,
              access_level: rel.access_level,
              cost_sharing_percentage: rel.cost_sharing_percentage,
              notes: rel.notes,
            }
          }));

          const primary_hospital = hospitals.find(h => h.relationship.primary_hospital);

          return {
            ...facility,
            hospitals,
            primary_hospital: primary_hospital || hospitals[0] || undefined,
          };
        })
        .filter((facility): facility is FacilityWithHospitals => facility !== null);

      return facilitiesWithHospitals;
    },
  });
}

export function useHospitalFacilities(hospitalId: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: facilityKeys.byHospital(hospitalId),
    trackingEndpoint: `/facilities/hospital/${hospitalId}`,
    queryFn: async (): Promise<(Facility & { relationship: { primary_hospital: any; access_level: any; cost_sharing_percentage: any; notes: any; } })[]> => {
      const { data: relationships, error } = await supabase
        .from('hospital_facilities')
        .select(`
          facility:facilities(*),
          primary_hospital,
          access_level,
          cost_sharing_percentage,
          notes
        `)
        .eq('hospital_id', hospitalId)
        .order('primary_hospital', { ascending: false });

      if (error) throw error;
      
      return relationships?.map(rel => ({
        ...(rel.facility as unknown as Facility),
        relationship: {
          primary_hospital: rel.primary_hospital,
          access_level: rel.access_level,
          cost_sharing_percentage: rel.cost_sharing_percentage,
          notes: rel.notes,
        }
      })) || [];
    },
    enabled: !!hospitalId,
  });
}

export function useFacility(id: string) {
  const supabase = createClient();

  return useTrackedQuery({
    queryKey: facilityKeys.detail(id),
    trackingEndpoint: `/facilities/${id}`,
    queryFn: async (): Promise<FacilityWithHospitals> => {
      // Get the facility
      const { data: facility, error: facilityError } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', id)
        .single();

      if (facilityError) throw facilityError;

      // Get all hospital relationships for this facility
      const { data: relationships, error: relationshipError } = await supabase
        .from('hospital_facilities')
        .select(`
          primary_hospital,
          access_level,
          cost_sharing_percentage,
          notes,
          hospital:hospitals(*)
        `)
        .eq('facility_id', id)
        .order('primary_hospital', { ascending: false });

      if (relationshipError) throw relationshipError;

      const hospitals = relationships?.map(rel => ({
        ...rel.hospital,
        relationship: {
          primary_hospital: rel.primary_hospital,
          access_level: rel.access_level,
          cost_sharing_percentage: rel.cost_sharing_percentage,
          notes: rel.notes,
        }
      })) || [];

      const primary_hospital = hospitals.find(h => h.relationship.primary_hospital);

      return {
        ...facility,
        hospitals,
        primary_hospital: primary_hospital || hospitals[0] || undefined,
      };
    },
    enabled: !!id,
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/facilities',
    trackingAction: 'POST',
    mutationFn: async (data: CreateFacilityRequest) => {
      // Create the facility first
      const { data: facility, error: facilityError } = await supabase
        .from('facilities')
        .insert(data.facility)
        .select()
        .single();

      if (facilityError) throw facilityError;

      // Create hospital relationships
      const relationships = data.hospital_relationships.map(rel => ({
        ...rel,
        facility_id: facility.id,
      }));

      const { error: relationshipError } = await supabase
        .from('hospital_facilities')
        .insert(relationships);

      if (relationshipError) throw relationshipError;

      return { facility, relationships };
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      // Invalidate queries for all hospitals that were associated
      result.relationships.forEach((rel: any) => {
        queryClient.invalidateQueries({ queryKey: facilityKeys.byHospital(rel.hospital_id) });
      });
      toast.success('Facility created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create facility');
    },
  });
}

export function useUpdateFacility(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: `/facilities/${id}`,
    trackingAction: 'PUT',
    mutationFn: async (data: Partial<FacilityFormData>) => {
      const { data: facility, error } = await supabase
        .from('facilities')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return facility;
    },
    onSuccess: (facility: any) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      // Invalidate all hospital queries since we don't know which hospitals are affected
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      toast.success('Facility updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update facility');
    },
  });
}

export function useUpdateFacilityHospitals(facilityId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: `/facilities/${facilityId}/hospitals`,
    trackingAction: 'PUT',
    mutationFn: async (data: UpdateFacilityHospitalsRequest) => {
      // Delete all existing relationships for this facility
      const { error: deleteError } = await supabase
        .from('hospital_facilities')
        .delete()
        .eq('facility_id', facilityId);

      if (deleteError) throw deleteError;

      // Insert new relationships
      const relationships = data.hospital_relationships.map(rel => ({
        ...rel,
        facility_id: facilityId,
      }));

      const { error: insertError } = await supabase
        .from('hospital_facilities')
        .insert(relationships);

      if (insertError) throw insertError;

      return relationships;
    },
    onSuccess: (relationships: any[]) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.detail(facilityId) });
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      // Invalidate queries for all affected hospitals
      relationships.forEach((rel: any) => {
        queryClient.invalidateQueries({ queryKey: facilityKeys.byHospital(rel.hospital_id) });
      });
      toast.success('Hospital associations updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update hospital associations');
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useTrackedMutation({
    trackingEndpoint: '/facilities',
    trackingAction: 'DELETE',
    mutationFn: async (id: string) => {
      // Relationships will be automatically deleted due to CASCADE
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      toast.success('Facility deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete facility');
    },
  });
}
