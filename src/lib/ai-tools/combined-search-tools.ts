import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '../supabase/server';
import { generateUnifiedEmbedding } from '../services/embedding-provider';

// Combined search for both hospitals and doctors
export const searchHealthcareCombinedTool = tool({
  description: 'Search for both hospitals and doctors in one comprehensive search. Best for general healthcare queries.',
  inputSchema: z.object({
    query: z.string().describe('Healthcare search query (e.g., "heart surgery in Boston", "pediatrician", "emergency care")'),
    location: z.string().optional().describe('City, state, or geographic location'),
    options: z.object({
      hospitalLimit: z.number().default(8).describe('Maximum number of hospitals to return'),
      doctorLimit: z.number().default(8).describe('Maximum number of doctors to return'),
      includeEmergencyOnly: z.boolean().optional().describe('Focus on emergency services')
    }).optional()
  }),
  execute: async ({ query, location, options = {} }) => {
    console.log(`🔍 Combined healthcare search: "${query}"${location ? ` in ${location}` : ''}`);
    
    try {
      const supabase = await createClient();
      
      // Generate embedding for semantic search
      let searchEmbedding: number[] | null = null;
      try {
        const embeddingResult = await generateUnifiedEmbedding(query, {
          provider: 'gemini',
          dimensions: 1536,
          enableFallback: true,
          fallbackProvider: 'openai'
        });
        searchEmbedding = embeddingResult.embedding;
      } catch (embeddingError) {
        console.warn('⚠️ Embedding generation failed, using text search only');
      }

      const { data: results, error } = await supabase.rpc(
        'search_healthcare_combined',
        {
          p_query: query,
          p_location: location || null,
          p_embedding: searchEmbedding,
          p_options: {
            hospital_limit: options.hospitalLimit || 8,
            doctor_limit: options.doctorLimit || 8
          }
        }
      );

      if (error) {
        throw new Error(`Combined search failed: ${error.message}`);
      }

      if (!results || results.length === 0) {
        return {
          success: true,
          hospitals: [],
          doctors: [],
          metadata: {
            query,
            location,
            totalHospitals: 0,
            totalDoctors: 0,
            relevantSpecialties: [],
            usedSemanticSearch: searchEmbedding !== null
          },
          message: `No healthcare providers found for "${query}"${location ? ` in ${location}` : ''}. Try broadening your search.`
        };
      }

      const result = results[0];
      const hospitals = result.hospitals || [];
      const doctors = result.doctors || [];
      const metadata = result.metadata || {};

      return {
        success: true,
        hospitals: hospitals.map((h: any) => ({
          id: h.id,
          name: h.name,
          city: h.city,
          state: h.state,
          type: h.type,
          rating: h.rating,
          emergencyServices: h.emergency_services,
          traumaLevel: h.trauma_level,
          similarityScore: h.similarity_score,
          combinedScore: h.combined_score
        })),
        doctors: doctors.map((d: any) => ({
          id: d.id,
          name: `${d.first_name} ${d.last_name}`,
          title: d.title,
          yearsOfExperience: d.years_of_experience,
          consultationFee: d.consultation_fee,
          acceptingNewPatients: d.is_accepting_new_patients,
          telehealthAvailable: d.is_telehealth_available,
          specialties: d.specialties || [],
          hospitals: d.hospitals || []
        })),
        metadata: {
          query: metadata.query,
          location: metadata.location,
          totalHospitals: metadata.hospital_count || 0,
          totalDoctors: metadata.doctor_count || 0,
          relevantSpecialties: metadata.relevant_specialties || [],
          usedSemanticSearch: metadata.has_embedding || false,
          timestamp: metadata.timestamp
        },
        message: `Found ${metadata.hospital_count || 0} hospitals and ${metadata.doctor_count || 0} doctors for "${query}"`
      };

    } catch (error: any) {
      console.error('❌ Combined search error:', error);
      return {
        success: false,
        hospitals: [],
        doctors: [],
        metadata: {
          query,
          location,
          totalHospitals: 0,
          totalDoctors: 0,
          relevantSpecialties: [],
          usedSemanticSearch: false
        },
        error: error.message,
        message: 'Combined search failed. Please try again.'
      };
    }
  }
});

// Get healthcare recommendations based on specific conditions
export const getHealthcareRecommendationsTool = tool({
  description: 'Get personalized healthcare recommendations based on medical conditions, urgency, and preferences',
  inputSchema: z.object({
    condition: z.string().describe('Medical condition or health concern (e.g., "chest pain", "broken bone", "routine checkup")'),
    urgency: z.enum(['emergency', 'urgent', 'routine']).describe('Level of urgency'),
    location: z.string().optional().describe('Preferred location'),
    preferences: z.object({
      preferredType: z.enum(['hospital', 'doctor', 'both']).default('both').describe('Preference for hospitals vs doctors'),
      acceptsInsurance: z.string().optional().describe('Insurance provider'),
      maxDistance: z.number().optional().describe('Maximum distance in miles'),
      telehealthOk: z.boolean().default(false).describe('Willing to consider telehealth options')
    }).optional()
  }),
  execute: async ({ condition, urgency, location, preferences = {} }) => {
    console.log(`🎯 Healthcare recommendations for: ${condition} (${urgency})`);
    
    try {
      const supabase = await createClient();
      
      // Determine search strategy based on urgency
      let searchQuery = condition;
      let filters: any = {};
      
      if (urgency === 'emergency') {
        searchQuery += ' emergency';
        filters.emergency_services = true;
      } else if (urgency === 'urgent') {
        searchQuery += ' urgent care';
      }

      // First, try to identify relevant specialties
      const { data: specialtiesData } = await supabase
        .from('specialties')
        .select('name, category, description')
        .or(`name.ilike.%${condition}%,description.ilike.%${condition}%,category.ilike.%${condition}%`)
        .limit(3);

      const relevantSpecialties = specialtiesData?.map(s => s.name) || [];

      // Generate embedding for semantic search
      let searchEmbedding: number[] | null = null;
      try {
        const embeddingResult = await generateUnifiedEmbedding(searchQuery, {
          provider: 'gemini',
          dimensions: 1536,
          enableFallback: true,
          fallbackProvider: 'openai'
        });
        searchEmbedding = embeddingResult.embedding;
      } catch (embeddingError) {
        console.warn('⚠️ Embedding generation failed for recommendations');
      }

      // Search hospitals if needed
      let hospitals: any[] = [];
      if (preferences.preferredType !== 'doctor') {
        const { data: hospitalResults } = await supabase.rpc(
          'search_hospitals_with_embeddings',
          {
            search_query: searchQuery,
            search_embedding: searchEmbedding,
            p_filters: {
              ...filters,
              ...(location && { city: location }),
              is_verified: true
            },
            p_options: {
              limit: urgency === 'emergency' ? 5 : 8,
              similarity_threshold: 0.5
            }
          }
        );

        hospitals = (hospitalResults || []).map((h: any) => ({
          id: h.id,
          name: h.name,
          city: h.city,
          state: h.state,
          type: h.type,
          rating: h.rating,
          emergencyServices: h.emergency_services,
          traumaLevel: h.trauma_level,
          phone: h.phone,
          address: h.address,
          recommendation: {
            score: h.combined_score,
            reason: urgency === 'emergency' && h.emergency_services 
              ? 'Has emergency services available 24/7'
              : urgency === 'urgent' && h.emergency_services
              ? 'Offers urgent care services'
              : 'Highly rated facility for your condition'
          }
        }));
      }

      // Search doctors if needed
      let doctors: any[] = [];
      if (preferences.preferredType !== 'hospital' && relevantSpecialties.length > 0) {
        const { data: doctorResults } = await supabase.rpc(
          'search_doctors_by_specialty',
          {
            p_specialty: relevantSpecialties[0],
            p_location: location || null,
            p_hospital_id: null,
            p_filters: {
              accepting_new_patients: urgency !== 'emergency',
              telehealth_available: preferences.telehealthOk
            },
            p_options: {
              limit: 10
            }
          }
        );

        doctors = (doctorResults || []).map((d: any) => ({
          id: d.id,
          name: `${d.first_name} ${d.last_name}`,
          title: d.title,
          yearsOfExperience: d.years_of_experience,
          consultationFee: d.consultation_fee,
          acceptingNewPatients: d.is_accepting_new_patients,
          telehealthAvailable: d.is_telehealth_available,
          rating: d.overall_rating,
          specialties: d.specialties || [],
          hospitals: d.hospitals || [],
          recommendation: {
            reason: d.is_accepting_new_patients 
              ? 'Accepting new patients and specializes in your condition'
              : 'Highly rated specialist for your condition',
            availableToday: urgency === 'emergency'
          }
        }));
      }

      // Generate personalized recommendations
      const recommendations = {
        immediate: urgency === 'emergency' ? 
          hospitals.filter(h => h.emergencyServices).slice(0, 3) : [],
        primary: urgency === 'routine' ? 
          doctors.filter(d => d.acceptingNewPatients).slice(0, 5) : 
          [...hospitals.slice(0, 3), ...doctors.slice(0, 3)],
        alternative: preferences.telehealthOk ? 
          doctors.filter(d => d.telehealthAvailable).slice(0, 3) : []
      };

      return {
        success: true,
        condition,
        urgency,
        location,
        recommendations,
        insights: {
          totalOptions: hospitals.length + doctors.length,
          emergencyOptionsAvailable: hospitals.filter(h => h.emergencyServices).length,
          telehealthOptionsAvailable: doctors.filter(d => d.telehealthAvailable).length,
          relevantSpecialties,
          averageRating: {
            hospitals: hospitals.length > 0 ? 
              hospitals.reduce((sum, h) => sum + (h.rating || 0), 0) / hospitals.length : 0,
            doctors: doctors.length > 0 ? 
              doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length : 0
          }
        },
        message: `Generated personalized recommendations for ${condition} based on ${urgency} priority`
      };

    } catch (error: any) {
      console.error('❌ Healthcare recommendations error:', error);
      return {
        success: false,
        condition,
        urgency,
        error: error.message,
        message: 'Failed to generate healthcare recommendations. Please try again.'
      };
    }
  }
});

// Compare healthcare options
export const compareHealthcareOptionsTool = tool({
  description: 'Compare multiple hospitals or doctors side by side to help with decision making',
  inputSchema: z.object({
    type: z.enum(['hospitals', 'doctors']).describe('Type of healthcare provider to compare'),
    ids: z.array(z.string()).min(2).max(5).describe('Array of UUIDs to compare (2-5 items)'),
    criteria: z.array(z.enum(['rating', 'experience', 'cost', 'location', 'services'])).optional()
      .describe('Specific criteria to focus on in comparison')
  }),
  execute: async ({ type, ids, criteria = ['rating', 'location', 'services'] }) => {
    console.log(`🔍 Comparing ${ids.length} ${type}: ${ids.join(', ')}`);
    
    try {
      const supabase = await createClient();
      
      if (type === 'hospitals') {
        // Compare hospitals
        const { data: hospitals, error } = await supabase
          .from('hospitals')
          .select(`
            id, name, city, state, type, rating, review_count,
            emergency_services, trauma_level, phone, website, address
          `)
          .in('id', ids)
          .eq('is_active', true);

        if (error) throw new Error(`Hospital comparison failed: ${error.message}`);

        const comparison = (hospitals || []).map((hospital: any) => ({
          id: hospital.id,
          name: hospital.name,
          location: `${hospital.city}, ${hospital.state}`,
          rating: hospital.rating,
          reviewCount: hospital.review_count,
          type: hospital.type,
          emergencyServices: hospital.emergency_services,
          traumaLevel: hospital.trauma_level,
          contact: {
            phone: hospital.phone,
            website: hospital.website,
            address: hospital.address
          },
          strengths: [
            hospital.rating >= 4.5 && 'Highly rated',
            hospital.emergency_services && 'Emergency services available',
            hospital.trauma_level && `${hospital.trauma_level} trauma center`,
            hospital.type === 'Teaching Hospital' && 'Teaching hospital with latest treatments'
          ].filter(Boolean)
        }));

        return {
          success: true,
          type: 'hospitals',
          comparison,
          summary: {
            highestRated: comparison.reduce((prev, current) => 
              (prev.rating > current.rating) ? prev : current),
            withEmergencyServices: comparison.filter(h => h.emergencyServices).length,
            averageRating: comparison.reduce((sum, h) => sum + (h.rating || 0), 0) / comparison.length
          },
          message: `Compared ${comparison.length} hospitals across ${criteria.join(', ')} criteria`
        };

      } else {
        // Compare doctors
        const { data: doctors, error } = await supabase
          .from('doctors')
          .select(`
            id, first_name, last_name, title, years_of_experience,
            consultation_fee, is_accepting_new_patients, 
            is_telehealth_available, rating,
            doctor_specialties (
              specialties (name, category)
            ),
            doctor_hospitals (
              hospitals (name, city, state)
            )
          `)
          .in('id', ids)
          .eq('is_active', true);

        if (error) throw new Error(`Doctor comparison failed: ${error.message}`);

        const comparison = (doctors || []).map((doctor: any) => ({
          id: doctor.id,
          name: `${doctor.first_name} ${doctor.last_name}`,
          title: doctor.title,
          yearsOfExperience: doctor.years_of_experience,
          consultationFee: doctor.consultation_fee,
          rating: doctor.rating,
          acceptingNewPatients: doctor.is_accepting_new_patients,
          telehealthAvailable: doctor.is_telehealth_available,
          specialties: doctor.doctor_specialties?.map((ds: any) => ds.specialties?.name).filter(Boolean) || [],
          affiliatedHospitals: doctor.doctor_hospitals?.map((dh: any) => 
            `${dh.hospitals?.name} (${dh.hospitals?.city})`).filter(Boolean) || [],
          strengths: [
            doctor.rating >= 4.5 && 'Highly rated by patients',
            doctor.years_of_experience >= 15 && 'Very experienced',
            doctor.is_accepting_new_patients && 'Accepting new patients',
            doctor.is_telehealth_available && 'Telehealth available',
            doctor.consultation_fee <= 200 && 'Reasonable consultation fee'
          ].filter(Boolean)
        }));

        return {
          success: true,
          type: 'doctors',
          comparison,
          summary: {
            mostExperienced: comparison.reduce((prev, current) => 
              (prev.yearsOfExperience > current.yearsOfExperience) ? prev : current),
            highestRated: comparison.reduce((prev, current) => 
              (prev.rating > current.rating) ? prev : current),
            acceptingNewPatients: comparison.filter(d => d.acceptingNewPatients).length,
            averageExperience: comparison.reduce((sum, d) => sum + (d.yearsOfExperience || 0), 0) / comparison.length,
            averageFee: comparison.reduce((sum, d) => sum + (d.consultationFee || 0), 0) / comparison.length
          },
          message: `Compared ${comparison.length} doctors across ${criteria.join(', ')} criteria`
        };
      }

    } catch (error: any) {
      console.error('❌ Comparison error:', error);
      return {
        success: false,
        type,
        error: error.message,
        message: 'Failed to compare healthcare options. Please try again.'
      };
    }
  }
});