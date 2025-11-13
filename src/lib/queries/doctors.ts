'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { DoctorFormData, DoctorSpecialtyFormData, DoctorHospitalFormData, AvailabilityFormData } from '@/lib/validations/doctor'
import { toast } from 'sonner'

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (filters: any) => [...doctorKeys.lists(), filters] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  availability: (id: string) => [...doctorKeys.detail(id), 'availability'] as const,
}

export function useDoctors(filters?: {
  search?: string
  hospital_id?: string
  specialty_id?: string
  is_active?: boolean
}) {
  const supabase = createClient()

  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: async () => {
      let query: any = supabase
        .from('doctors')
        .select(`
          *,
          doctor_hospitals(
            id,
            hospital_id,
            is_primary,
            position_title,
            department,
            start_date,
            end_date,
            is_active,
            hospital:hospitals(id, name, city, type, rating)
          ),
          doctor_specialties(
            id,
            is_primary,
            years_in_specialty,
            board_certified,
            certification_date,
            specialty:specialties(id, name, category, color_code, requires_certification)
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`)
      }
      if (filters?.hospital_id) {
        query = query.eq('doctor_hospitals.hospital_id', filters.hospital_id)
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }
      if (filters?.specialty_id) {
        query = query.contains('doctor_specialties', [{ specialty_id: filters.specialty_id }])
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useDoctor(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          doctor_hospitals(
            id,
            hospital_id,
            is_primary,
            position_title,
            department,
            start_date,
            end_date,
            is_active,
            hospital:hospitals(id, name, city, type, rating)
          ),
          doctor_specialties(
            id,
            is_primary,
            years_in_specialty,
            board_certified,
            certification_date,
            specialty:specialties(id, name, category, color_code, requires_certification)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useDoctorAvailability(doctorId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: doctorKeys.availability(doctorId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_active', true)
        .order('day_of_week')

      if (error) throw error
      return data
    },
    enabled: !!doctorId,
  })
}

export function useCreateDoctor() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: DoctorFormData & { 
      specialties: DoctorSpecialtyFormData[];
      doctor_hospitals: DoctorHospitalFormData[];
    }) => {
      const { specialties, doctor_hospitals, ...doctorData } = data

      // Insert doctor
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .insert(doctorData)
        .select()
        .single()

      if (doctorError) throw doctorError

      // Insert hospital affiliations
      if (doctor_hospitals && doctor_hospitals.length > 0) {
        const hospitalInserts = doctor_hospitals.map(h => ({
          doctor_id: doctor.id,
          ...h,
        }))

        const { error: hospitalError } = await supabase
          .from('doctor_hospitals')
          .insert(hospitalInserts)

        if (hospitalError) throw hospitalError
      }

      // Insert specialties
      if (specialties && specialties.length > 0) {
        const specialtyInserts = specialties.map(s => ({
          doctor_id: doctor.id,
          ...s,
        }))

        const { error: specialtyError } = await supabase
          .from('doctor_specialties')
          .insert(specialtyInserts)

        if (specialtyError) throw specialtyError
      }

      return doctor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      toast.success('Doctor created successfully')
    },
  })
}

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: Partial<DoctorFormData> & { 
      specialties?: DoctorSpecialtyFormData[];
      doctor_hospitals?: DoctorHospitalFormData[];
    }) => {
      const { specialties, doctor_hospitals, ...doctorData } = data

      // Update doctor
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .update(doctorData)
        .eq('id', id)
        .select()
        .single()

      if (doctorError) throw doctorError

      // Update hospital affiliations
      if (doctor_hospitals) {
        // Delete existing hospital affiliations
        await supabase
          .from('doctor_hospitals')
          .delete()
          .eq('doctor_id', id)

        // Insert new hospital affiliations
        if (doctor_hospitals.length > 0) {
          const hospitalInserts = doctor_hospitals.map(h => ({
            doctor_id: id,
            ...h,
          }))

          const { error: hospitalError } = await supabase
            .from('doctor_hospitals')
            .insert(hospitalInserts)

          if (hospitalError) throw hospitalError
        }
      }

      // Update specialties
      if (specialties) {
        // Delete existing specialties
        await supabase
          .from('doctor_specialties')
          .delete()
          .eq('doctor_id', id)

        // Insert new specialties
        if (specialties.length > 0) {
          const specialtyInserts = specialties.map(s => ({
            doctor_id: id,
            ...s,
          }))

          const { error: specialtyError } = await supabase
            .from('doctor_specialties')
            .insert(specialtyInserts)

          if (specialtyError) throw specialtyError
        }
      }

      return doctor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      toast.success('Doctor updated successfully')
    },
  })
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      toast.success('Doctor deleted successfully')
    },
  })
}

export function useSaveAvailability(doctorId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (availability: AvailabilityFormData[]) => {
      await supabase
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', doctorId)

      if (availability.length > 0) {
        const inserts = availability.map(a => ({
          doctor_id: doctorId,
          ...a,
        }))

        const { error } = await supabase
          .from('doctor_availability')
          .insert(inserts)

        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.availability(doctorId) })
      toast.success('Availability updated successfully')
    },
  })
}
