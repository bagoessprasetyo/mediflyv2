import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '../supabase/server';

// Search doctors by specialty and location
export const searchDoctorsTool = tool({
  description: 'Search for doctors by specialty, location, and other criteria',
  inputSchema: z.object({
    specialty: z.string().optional().describe('Medical specialty (e.g., "cardiology", "neurology", "pediatrics")'),
    location: z.string().optional().describe('City, state, or location to search in'),
    hospitalId: z.string().optional().describe('Specific hospital UUID to search doctors in'),
    filters: z.object({
      minExperience: z.number().optional().describe('Minimum years of experience'),
      acceptingNewPatients: z.boolean().optional().describe('Only show doctors accepting new patients'),
      telehealthAvailable: z.boolean().optional().describe('Only show doctors offering telehealth')
    }).optional()
  }),
  execute: async ({ specialty, location, hospitalId, filters = {} }) => {
    console.log(`👨‍⚕️ Searching doctors: ${specialty || 'all specialties'} in ${location || 'all locations'}`);
    
    try {
      const supabase = await createClient();
      
      const { data: results, error } = await supabase.rpc(
        'search_doctors_by_specialty',
        {
          p_specialty: specialty || null,
          p_location: location || null,
          p_hospital_id: hospitalId || null,
          p_filters: {
            min_experience: filters.minExperience,
            accepting_new_patients: filters.acceptingNewPatients,
            telehealth_available: filters.telehealthAvailable
          },
          p_options: {
            limit: 15
          }
        }
      );

      if (error) {
        throw new Error(`Doctor search failed: ${error.message}`);
      }

      if (!results || results.length === 0) {
        return {
          success: true,
          doctors: [],
          message: `No doctors found${specialty ? ` for ${specialty}` : ''}${location ? ` in ${location}` : ''}. Try adjusting your search criteria.`,
          searchMeta: {
            specialty,
            location,
            hospitalId,
            filters,
            totalResults: 0
          }
        };
      }

      const doctors = results.map((doctor: any) => ({
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        firstName: doctor.first_name,
        lastName: doctor.last_name,
        title: doctor.title,
        profileImage: doctor.profile_image,
        yearsOfExperience: doctor.years_of_experience,
        consultationFee: doctor.consultation_fee,
        acceptingNewPatients: doctor.is_accepting_new_patients,
        telehealthAvailable: doctor.is_telehealth_available,
        rating: doctor.overall_rating,
        specialties: doctor.specialties || [],
        hospitals: doctor.hospitals || []
      }));

      return {
        success: true,
        doctors,
        message: `Found ${doctors.length} doctors${specialty ? ` specializing in ${specialty}` : ''}${location ? ` in ${location}` : ''}`,
        searchMeta: {
          specialty,
          location,
          hospitalId,
          filters,
          totalResults: doctors.length,
          averageExperience: doctors.reduce((sum: number, d: any) => sum + (d.yearsOfExperience || 0), 0) / doctors.length,
          acceptingNewPatientsCount: doctors.filter((d: any) => d.acceptingNewPatients).length
        }
      };

    } catch (error: any) {
      console.error('❌ Doctor search error:', error);
      return {
        success: false,
        doctors: [],
        error: error.message,
        message: 'Failed to search doctors. Please try again.',
        searchMeta: {
          specialty,
          location,
          hospitalId,
          filters,
          totalResults: 0
        }
      };
    }
  }
});

// Get detailed doctor information
export const getDoctorDetailsTool = tool({
  description: 'Get detailed information about a specific doctor',
  inputSchema: z.object({
    doctorId: z.string().describe('The UUID of the doctor to get details for')
  }),
  execute: async ({ doctorId }) => {
    console.log(`👨‍⚕️ Getting doctor details: ${doctorId}`);
    
    try {
      const supabase = await createClient();
      
      // Get doctor basic info
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(`
          id, first_name, last_name, title, profile_image, 
          years_of_experience, consultation_fee, 
          is_accepting_new_patients, is_telehealth_available, 
          rating, bio, education, certifications, languages,
          created_at, updated_at
        `)
        .eq('id', doctorId)
        .eq('is_active', true)
        .single();

      if (doctorError) {
        throw new Error(`Failed to get doctor: ${doctorError.message}`);
      }

      if (!doctorData) {
        return {
          success: false,
          error: 'Doctor not found',
          message: `No doctor found with ID: ${doctorId}`
        };
      }

      // Get doctor specialties
      const { data: specialtiesData } = await supabase
        .from('doctor_specialties')
        .select(`
          is_primary, board_certified, years_in_specialty,
          specialties (
            id, name, category, description
          )
        `)
        .eq('doctor_id', doctorId);

      // Get hospital affiliations
      const { data: hospitalsData } = await supabase
        .from('doctor_hospitals')
        .select(`
          is_primary, position_title, department,
          hospitals (
            id, name, city, state, type, rating
          )
        `)
        .eq('doctor_id', doctorId)
        .eq('is_active', true);

      return {
        success: true,
        doctor: {
          id: doctorData.id,
          name: `${doctorData.first_name} ${doctorData.last_name}`,
          firstName: doctorData.first_name,
          lastName: doctorData.last_name,
          title: doctorData.title,
          profileImage: doctorData.profile_image,
          yearsOfExperience: doctorData.years_of_experience,
          consultationFee: doctorData.consultation_fee,
          acceptingNewPatients: doctorData.is_accepting_new_patients,
          telehealthAvailable: doctorData.is_telehealth_available,
          rating: doctorData.rating,
          bio: doctorData.bio,
          education: doctorData.education,
          certifications: doctorData.certifications,
          languages: doctorData.languages,
          specialties: specialtiesData || [],
          hospitals: hospitalsData || []
        },
        message: `Retrieved detailed information for Dr. ${doctorData.first_name} ${doctorData.last_name}`
      };

    } catch (error: any) {
      console.error('❌ Doctor details error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get doctor details. Please try again.'
      };
    }
  }
});

// Get all available specialties
export const getSpecialtiesTool = tool({
  description: 'Get list of all available medical specialties for reference',
  inputSchema: z.object({
    category: z.string().optional().describe('Filter by specialty category')
  }),
  execute: async ({ category }) => {
    console.log(`🏥 Getting specialties${category ? ` in category: ${category}` : ''}`);
    
    try {
      const supabase = await createClient();
      
      let query = supabase
        .from('specialties')
        .select('id, name, category, description')
        .eq('is_active', true)
        .order('name');

      if (category) {
        query = query.ilike('category', `%${category}%`);
      }

      const { data: specialties, error } = await query;

      if (error) {
        throw new Error(`Failed to get specialties: ${error.message}`);
      }

      // Group by category
      const specialtiesByCategory = (specialties || []).reduce((acc: any, specialty: any) => {
        const cat = specialty.category || 'Other';
        if (!acc[cat]) {
          acc[cat] = [];
        }
        acc[cat].push({
          id: specialty.id,
          name: specialty.name,
          description: specialty.description
        });
        return acc;
      }, {});

      return {
        success: true,
        specialties: specialtiesByCategory,
        totalCount: specialties?.length || 0,
        categories: Object.keys(specialtiesByCategory),
        message: `Found ${specialties?.length || 0} medical specialties${category ? ` in ${category}` : ''}`
      };

    } catch (error: any) {
      console.error('❌ Specialties error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get specialties. Please try again.'
      };
    }
  }
});

// Find doctors by hospital
export const getDoctorsByHospitalTool = tool({
  description: 'Get all doctors affiliated with a specific hospital',
  inputSchema: z.object({
    hospitalId: z.string().describe('The UUID of the hospital'),
    specialty: z.string().optional().describe('Filter by specific specialty'),
    acceptingNewPatients: z.boolean().optional().describe('Only show doctors accepting new patients')
  }),
  execute: async ({ hospitalId, specialty, acceptingNewPatients }) => {
    console.log(`👨‍⚕️ Getting doctors for hospital: ${hospitalId}`);
    
    try {
      const supabase = await createClient();
      
      // Get hospital name first
      const { data: hospitalData } = await supabase
        .from('hospitals')
        .select('name, city, state')
        .eq('id', hospitalId)
        .single();

      let query = supabase
        .from('doctor_hospitals')
        .select(`
          is_primary, position_title, department,
          doctors (
            id, first_name, last_name, title, 
            years_of_experience, consultation_fee,
            is_accepting_new_patients, rating,
            doctor_specialties (
              is_primary,
              specialties (
                name, category
              )
            )
          )
        `)
        .eq('hospital_id', hospitalId)
        .eq('is_active', true)
        .eq('doctors.is_active', true);

      if (acceptingNewPatients !== undefined) {
        query = query.eq('doctors.is_accepting_new_patients', acceptingNewPatients);
      }

      const { data: doctorsData, error } = await query;

      if (error) {
        throw new Error(`Failed to get doctors: ${error.message}`);
      }

      let doctors = (doctorsData || []).map((dh: any) => ({
        id: dh.doctors.id,
        name: `${dh.doctors.first_name} ${dh.doctors.last_name}`,
        title: dh.doctors.title,
        yearsOfExperience: dh.doctors.years_of_experience,
        consultationFee: dh.doctors.consultation_fee,
        acceptingNewPatients: dh.doctors.is_accepting_new_patients,
        rating: dh.doctors.rating,
        positionTitle: dh.position_title,
        department: dh.department,
        isPrimary: dh.is_primary,
        specialties: dh.doctors.doctor_specialties?.map((ds: any) => ds.specialties?.name).filter(Boolean) || []
      }));

      // Filter by specialty if provided
      if (specialty) {
        doctors = doctors.filter((doctor: any) => 
          doctor.specialties.some((s: string) => 
            s.toLowerCase().includes(specialty.toLowerCase())
          )
        );
      }

      return {
        success: true,
        doctors,
        hospital: hospitalData ? {
          id: hospitalId,
          name: hospitalData.name,
          location: `${hospitalData.city}, ${hospitalData.state}`
        } : null,
        totalCount: doctors.length,
        acceptingNewPatientsCount: doctors.filter((d: any) => d.acceptingNewPatients).length,
        message: `Found ${doctors.length} doctors${specialty ? ` specializing in ${specialty}` : ''} at ${hospitalData?.name || 'this hospital'}`
      };

    } catch (error: any) {
      console.error('❌ Hospital doctors error:', error);
      return {
        success: false,
        doctors: [],
        error: error.message,
        message: 'Failed to get doctors for this hospital. Please try again.'
      };
    }
  }
});