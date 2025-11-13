import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { healthConcernMappings } from '@/lib/ai/config';
import { generateUnifiedEmbedding } from '@/lib/services/embedding-provider';

export async function POST(req: NextRequest) {
  try {
    const { query, location, filters = {} } = await req.json();

    if (!query) {
      return Response.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Combined search for: "${query}" in ${location || 'any location'}`);

    const supabase = await createClient();

    // Generate embedding for the search query using unified provider (Gemini)
    let searchEmbedding: number[] | null = null;
    try {
      const embeddingResult = await generateUnifiedEmbedding(query, {
        provider: 'gemini',
        dimensions: 1536, // Match database schema
        enableFallback: true,
        fallbackProvider: 'openai'
      });
      searchEmbedding = embeddingResult.embedding;
      console.log(`✅ Generated combined search embedding with ${embeddingResult.metadata.provider} (${embeddingResult.metadata.dimensions}D)`);
    } catch (embeddingError) {
      console.warn('⚠️ Failed to generate embedding for combined search, falling back to text search:', embeddingError);
    }

    // Determine relevant specialties from query
    const queryLower = query.toLowerCase();
    const relevantSpecialties = Object.entries(healthConcernMappings)
      .filter(([keyword]) => queryLower.includes(keyword))
      .flatMap(([, specialties]) => specialties);

    let hospitals: any[] = [];
    let doctors: any[] = [];

    try {
      // Use direct database queries instead of RPC functions
      
      // Search hospitals directly
      try {
        let hospital_query = supabase
          .from('hospitals')
          .select(`
            id, name, slug, description, city, state, type, 
            emergency_services, trauma_level, rating, review_count,
            is_active, is_verified, is_featured, address, phone, website
          `)
          .eq('is_active', true)
          .eq('is_verified', true);

        // Apply text search for hospitals - search description for medical terms
        if (query && query.trim()) {
          // Try exact phrase first
          hospital_query = hospital_query.ilike('description', `%${query}%`);
        }
        
        // Apply location filter
        if (location) {
          hospital_query = hospital_query.ilike('city', `%${location}%`);
        }

        const { data: hospitalData, error: hospitalError } = await hospital_query
          .limit(filters.hospitalLimit || 20)
          .order('rating', { ascending: false });

        if (hospitalError) throw hospitalError;
        hospitals = hospitalData || [];

        // If no results with exact phrase, try with keywords
        if (hospitals.length === 0 && query) {
          const keywords = ['rehabilitation', 'stroke', 'neuro', 'physical', 'therapy'].filter(
            keyword => query.toLowerCase().includes(keyword)
          );
          
          if (keywords.length > 0) {
            let keyword_query = supabase
              .from('hospitals')
              .select(`
                id, name, slug, description, city, state, type, 
                emergency_services, trauma_level, rating, review_count,
                is_active, is_verified, is_featured, address, phone, website
              `)
              .eq('is_active', true)
              .eq('is_verified', true);
              
            // Search for any keyword
            keyword_query = keyword_query.ilike('description', `%${keywords[0]}%`);
            
            if (location) {
              keyword_query = keyword_query.ilike('city', `%${location}%`);
            }

            const { data: keywordData, error: keywordError } = await keyword_query
              .limit(filters.hospitalLimit || 20)
              .order('rating', { ascending: false });
              
            if (!keywordError) {
              hospitals = keywordData || [];
            }
          }
        }

        // Search doctors directly if relevant
        if (relevantSpecialties.length > 0 || query.toLowerCase().includes('doctor') || query.toLowerCase().includes('specialist')) {
          try {
            let doctor_query = supabase
              .from('doctors')
              .select(`
                id, first_name, last_name, title, profile_image, years_of_experience,
                consultation_fee, is_accepting_new_patients, is_telehealth_available,
                doctor_specialties(
                  id, is_primary, years_in_specialty, board_certified,
                  specialty:specialties(id, name, category, color_code)
                ),
                doctor_hospitals(
                  id, hospital_id, is_primary, position_title, department,
                  hospital:hospitals(id, name, city, type, rating)
                )
              `)
              .eq('is_active', true)
              .eq('is_verified', true)
              .eq('is_accepting_new_patients', true);

            const { data: doctorData, error: doctorError } = await doctor_query
              .limit(filters.doctorLimit || 15)
              .order('years_of_experience', { ascending: false });

            if (doctorError) {
              console.warn('⚠️ Doctor search failed:', doctorError);
            } else {
              doctors = doctorData || [];
            }
          } catch (doctorError) {
            console.error('Doctor search error:', doctorError);
          }
        }

        console.log(`✅ Direct search found ${hospitals.length} hospitals, ${doctors.length} doctors`);

      } catch (searchError) {
        console.error('❌ Direct search failed:', searchError);
        // Continue with empty arrays
      }
    } catch (error) {
      console.error('❌ Combined search error:', error);
      // Continue with empty arrays
    }

    // Combine and format results
    const results = {
      query,
      location,
      hospitals: hospitals.map((hospital: any) => ({
        id: hospital.id,
        name: hospital.name,
        type: hospital.type,
        city: hospital.city,
        state: hospital.state,
        rating: hospital.rating,
        reviewCount: hospital.review_count,
        emergencyServices: hospital.emergency_services,
        traumaLevel: hospital.trauma_level,
        address: hospital.address,
        phone: hospital.phone,
        website: hospital.website,
        specialties: hospital.metadata?.specialties || [],
        similarity: hospital.similarity || 0
      })),
      doctors: doctors.map((doctor: any) => ({
        id: doctor.id,
        firstName: doctor.first_name,
        lastName: doctor.last_name,
        title: doctor.title,
        profileImage: doctor.profile_image,
        yearsOfExperience: doctor.years_of_experience,
        consultationFee: doctor.consultation_fee,
        acceptingNewPatients: doctor.is_accepting_new_patients,
        telehealth: doctor.is_telehealth_available,
        specialties: doctor.doctor_specialties.map((ds: any) => ({
          name: ds.specialty.name,
          category: ds.specialty.category,
          isPrimary: ds.is_primary,
          boardCertified: ds.board_certified,
          yearsInSpecialty: ds.years_in_specialty
        })),
        hospitals: doctor.doctor_hospitals.map((dh: any) => ({
          id: dh.hospital.id,
          name: dh.hospital.name,
          city: dh.hospital.city,
          isPrimary: dh.is_primary,
          positionTitle: dh.position_title,
          department: dh.department
        }))
      })),
      metadata: {
        hospitalCount: hospitals.length,
        doctorCount: doctors.length,
        relevantSpecialties,
        searchPerformed: true,
        timestamp: new Date().toISOString()
      }
    };

    return Response.json(results);
  } catch (error) {
    console.error('Combined search error:', error);
    return Response.json(
      { 
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ 
    message: 'Combined search endpoint - use POST with query and location parameters'
  });
}