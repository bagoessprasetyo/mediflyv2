import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Schema definitions for AI tool parameters
const SearchHospitalsSchema = z.object({
  query: z.string().describe('The health concern or condition to search for'),
  location: z.string().optional().describe('City, state, or location preference'),
  specialty: z.string().optional().describe('Medical specialty if specific'),
  emergency: z.boolean().optional().describe('Whether emergency services are needed'),
  radius: z.number().optional().describe('Search radius in miles'),
  minRating: z.number().optional().describe('Minimum hospital rating (1-5)'),
  limit: z.number().default(20).describe('Maximum number of results')
});

const SearchDoctorsSchema = z.object({
  specialty: z.string().describe('Medical specialty to search for'),
  location: z.string().optional().describe('Preferred location'),
  hospitalId: z.string().optional().describe('Specific hospital ID if known'),
  experienceYears: z.number().optional().describe('Minimum years of experience'),
  acceptingNewPatients: z.boolean().optional().describe('Only show doctors accepting new patients'),
  telehealth: z.boolean().optional().describe('Telehealth availability'),
  limit: z.number().default(15).describe('Maximum number of results')
});

const GetHospitalDetailsSchema = z.object({
  hospitalId: z.string().describe('The hospital ID to get details for'),
  includeFacilities: z.boolean().default(true).describe('Include facility information'),
  includeDoctors: z.boolean().default(false).describe('Include associated doctors')
});

const FilterHospitalsByFacilitySchema = z.object({
  hospitalIds: z.array(z.string()).describe('Hospital IDs to filter'),
  facilityType: z.string().describe('Type of facility required (EMERGENCY, ICU, OPERATING_ROOM, etc.)'),
  location: z.string().optional().describe('Location preference')
});

// AI Tools for hospital and doctor search
export const searchTools = {
  searchHospitals: tool({
    description: 'Search hospitals based on health concerns, location, and other criteria. Use this when users describe symptoms or need specific medical care.',
    inputSchema: SearchHospitalsSchema,
    execute: async function ({ query, location, specialty, emergency, radius, minRating, limit }) {
      try {

        // Use direct database search
        const supabase = await createClient();
        
        // Build direct query
        let query_builder = supabase
          .from('hospitals')
          .select(`
            id, name, slug, description, city, state, type, 
            emergency_services, trauma_level, rating, review_count,
            is_active, is_verified, is_featured, address, phone, website
          `)
          .eq('is_active', true)
          .eq('is_verified', true);

        // Apply text search
        if (query && query.trim()) {
          query_builder = query_builder.ilike('description', `%${query}%`);
        }
        
        // Apply filters
        if (location) {
          query_builder = query_builder.ilike('city', `%${location}%`);
        }
        if (emergency !== undefined) {
          query_builder = query_builder.eq('emergency_services', emergency);
        }
        if (minRating) {
          query_builder = query_builder.gte('rating', minRating);
        }

        const { data: hospitals, error } = await query_builder
          .limit(limit || 20)
          .order('rating', { ascending: false });

        if (error) {
          throw new Error(`Hospital search failed: ${error.message}`);
        }

        const results = hospitals || [];

        // Return final result
        return {
          status: 'success' as const,
          message: `Found ${results.length} hospitals`,
          hospitals: results.slice(0, limit),
          total: results.length,
          searchQuery: query,
          filters: { location, specialty, emergency, minRating }
        };
      } catch (error) {
        return {
          status: 'error' as const,
          message: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          hospitals: [],
          total: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }),

  searchDoctors: tool({
    description: 'Find doctors by specialty, location, hospital affiliation, and other criteria.',
    inputSchema: SearchDoctorsSchema,
    execute: async ({ specialty, location, hospitalId, experienceYears, acceptingNewPatients, telehealth, limit }) => {
      try {
        const supabase = await createClient();
        
        // Use the new RPC function for better performance
        const { data: doctors, error } = await supabase.rpc('search_doctors_by_specialty', {
          p_specialty: specialty,
          p_location: location,
          p_hospital_id: hospitalId,
          p_filters: {
            min_experience: experienceYears,
            accepting_new_patients: acceptingNewPatients,
            telehealth_available: telehealth
          },
          p_options: {
            limit
          }
        });

        if (error) {
          console.error('Advanced RPC doctor search failed, trying basic search:', error);
          
          // Fallback to basic query if RPC fails
          let query = supabase
            .from('doctors')
            .select(`
              *,
              doctor_hospitals(
                id,
                hospital_id,
                is_primary,
                position_title,
                department,
                hospital:hospitals(id, name, city, type, rating)
              ),
              doctor_specialties(
                id,
                is_primary,
                years_in_specialty,
                board_certified,
                specialty:specialties(id, name, category, color_code)
              )
            `)
            .eq('is_active', true)
            .eq('is_verified', true);

          if (acceptingNewPatients) {
            query = query.eq('is_accepting_new_patients', true);
          }

          if (telehealth) {
            query = query.eq('is_telehealth_available', true);
          }

          if (experienceYears) {
            query = query.gte('years_of_experience', experienceYears);
          }

          const { data: fallbackDoctors, error: fallbackError } = await query.limit(limit);

          if (fallbackError) throw fallbackError;

          // Filter by specialty and location
          const filteredDoctors = fallbackDoctors?.filter(doctor => {
            const hasSpecialty = specialty ? 
              doctor.doctor_specialties.some((ds: any) => 
                ds.specialty.name.toLowerCase().includes(specialty.toLowerCase())
              ) : true;
              
            const hasLocation = location ?
              doctor.doctor_hospitals.some((dh: any) =>
                dh.hospital.city.toLowerCase().includes(location.toLowerCase())
              ) : true;
              
            return hasSpecialty && hasLocation;
          }) || [];

          return {
            doctors: filteredDoctors,
            total: filteredDoctors.length,
            filters: { specialty, location, experienceYears, acceptingNewPatients }
          };
        }

        return {
          doctors: doctors || [],
          total: doctors?.length || 0,
          filters: { specialty, location, experienceYears, acceptingNewPatients }
        };
      } catch (error) {
        console.error('Doctor search failed:', error);
        return {
          error: 'Failed to search doctors',
          doctors: [],
          total: 0
        };
      }
    }
  }),

  getHospitalDetails: tool({
    description: 'Get detailed information about a specific hospital including facilities and doctors.',
    inputSchema: GetHospitalDetailsSchema,
    execute: async ({ hospitalId, includeFacilities, includeDoctors }) => {
      try {
        const supabase = await createClient();

        // Get hospital basic info
        const { data: hospital, error: hospitalError } = await supabase
          .from('hospitals')
          .select('*')
          .eq('id', hospitalId)
          .single();

        if (hospitalError) throw hospitalError;

        let result: any = { ...hospital };

        // Include facilities if requested
        if (includeFacilities) {
          const { data: facilities, error: facilitiesError } = await supabase
            .from('facilities')
            .select('*')
            .eq('hospital_id', hospitalId)
            .eq('is_available', true);

          if (facilitiesError) throw facilitiesError;
          result.facilities = facilities || [];
        }

        // Include doctors if requested
        if (includeDoctors) {
          const { data: doctorRelations, error: doctorsError } = await supabase
            .from('doctor_hospitals')
            .select(`
              *,
              doctor:doctors!doctor_hospitals_doctor_id_fkey (
                id,
                first_name,
                last_name,
                title,
                years_of_experience,
                consultation_fee,
                is_accepting_new_patients,
                doctor_specialties (
                  specialty:specialties (name, category)
                )
              )
            `)
            .eq('hospital_id', hospitalId)
            .eq('is_active', true);

          if (doctorsError) throw doctorsError;
          result.doctors = doctorRelations?.map(rel => rel.doctor) || [];
        }

        return result;
      } catch (error) {
        return {
          error: 'Failed to get hospital details',
          hospital: null
        };
      }
    }
  }),

  filterHospitalsByFacility: tool({
    description: 'Filter a list of hospitals by available facilities (emergency, ICU, operating rooms, etc.)',
    inputSchema: FilterHospitalsByFacilitySchema,
    execute: async ({ hospitalIds, facilityType, location }) => {
      try {
        const supabase = await createClient();

        const { data: hospitals, error } = await supabase
          .from('hospitals')
          .select(`
            *,
            facilities(
              id,
              name,
              category,
              is_available,
              capacity
            )
          `)
          .in('id', hospitalIds)
          .eq('is_active', true);

        if (error) throw error;

        const filteredHospitals = hospitals?.filter(hospital => {
          const hasFacility = hospital.facilities.some((facility: any) =>
            facility.category === facilityType && facility.is_available
          );
          
          const matchesLocation = location ?
            hospital.city.toLowerCase().includes(location.toLowerCase()) ||
            hospital.state.toLowerCase().includes(location.toLowerCase()) : true;
            
          return hasFacility && matchesLocation;
        }) || [];

        return {
          hospitals: filteredHospitals,
          total: filteredHospitals.length,
          facilityType,
          location
        };
      } catch (error) {
        return {
          error: 'Failed to filter hospitals by facility',
          hospitals: [],
          total: 0
        };
      }
    }
  })
};

export type SearchToolsType = typeof searchTools;