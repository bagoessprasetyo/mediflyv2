import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '../supabase/server';
import { generateUnifiedEmbedding } from '../services/embedding-provider';

// Hospital search tool with semantic search support
export const searchHospitalsTool = tool({
  description: 'Search for hospitals based on query, location, and filters. Supports both text and semantic search.',
  inputSchema: z.object({
    query: z.string().describe('Search query (e.g., "cardiac surgery", "emergency room", "rehabilitation")'),
    location: z.string().optional().describe('City, state, or geographic location'),
    filters: z.object({
      type: z.enum(['General Hospital', 'Specialty Hospital', 'Teaching Hospital', 'Rehabilitation Hospital', 'Psychiatric Hospital']).optional().describe('Type of hospital'),
      emergency_services: z.boolean().optional().describe('Whether hospital has emergency services'),
      trauma_level: z.enum(['Level I', 'Level II', 'Level III', 'Level IV']).optional().describe('Trauma center level'),
      is_verified: z.boolean().optional().describe('Only include verified hospitals')
    }).optional()
  }),
  execute: async ({ query, location, filters = {} }) => {
    console.log(`🏥 Searching hospitals: "${query}" in ${location || 'all locations'}`);
    
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

      // Use the production search function
      const { data: results, error } = await supabase.rpc(
        'search_hospitals_with_embeddings',
        {
          search_query: query,
          search_embedding: searchEmbedding,
          p_filters: {
            ...filters,
            ...(location && { city: location })
          },
          p_options: {
            limit: 10,
            similarity_threshold: 0.6
          }
        }
      );

      if (error) {
        throw new Error(`Database search failed: ${error.message}`);
      }

      if (!results || results.length === 0) {
        return {
          success: true,
          hospitals: [],
          message: `No hospitals found matching "${query}"${location ? ` in ${location}` : ''}. Try broadening your search criteria.`,
          searchMeta: {
            query,
            location,
            filters,
            totalResults: 0,
            usedSemanticSearch: searchEmbedding !== null
          }
        };
      }

      const hospitals = results.map((hospital: any) => ({
        id: hospital.id,
        name: hospital.name,
        city: hospital.city,
        state: hospital.state,
        type: hospital.type,
        rating: hospital.rating,
        emergencyServices: hospital.emergency_services,
        traumaLevel: hospital.trauma_level,
        phone: hospital.phone,
        website: hospital.website,
        address: hospital.address,
        description: hospital.description,
        similarityScore: hospital.similarity_score,
        combinedScore: hospital.combined_score
      }));

      return {
        success: true,
        hospitals,
        message: `Found ${hospitals.length} hospitals matching "${query}"${location ? ` in ${location}` : ''}`,
        searchMeta: {
          query,
          location,
          filters,
          totalResults: hospitals.length,
          usedSemanticSearch: searchEmbedding !== null,
          averageScore: hospitals.reduce((sum: number, h: any) => sum + (h.combinedScore || 0), 0) / hospitals.length
        }
      };

    } catch (error: any) {
      console.error('❌ Hospital search error:', error);
      return {
        success: false,
        hospitals: [],
        error: error.message,
        message: 'Failed to search hospitals. Please try again.',
        searchMeta: {
          query,
          location,
          filters,
          totalResults: 0,
          usedSemanticSearch: false
        }
      };
    }
  }
});

// Get detailed hospital information
export const getHospitalDetailsTool = tool({
  description: 'Get detailed information about a specific hospital including facilities and doctors',
  inputSchema: z.object({
    hospitalId: z.string().describe('The UUID of the hospital to get details for'),
    includeFacilities: z.boolean().default(true).describe('Include hospital facilities information'),
    includeDoctors: z.boolean().default(true).describe('Include affiliated doctors information')
  }),
  execute: async ({ hospitalId, includeFacilities = true, includeDoctors = true }) => {
    console.log(`🏥 Getting hospital details: ${hospitalId}`);
    
    try {
      const supabase = await createClient();
      
      const { data: result, error } = await supabase.rpc(
        'get_hospital_details_complete',
        {
          p_hospital_id: hospitalId,
          p_include_facilities: includeFacilities,
          p_include_doctors: includeDoctors
        }
      );

      if (error) {
        throw new Error(`Failed to get hospital details: ${error.message}`);
      }

      if (!result || result.length === 0) {
        return {
          success: false,
          error: 'Hospital not found',
          message: `No hospital found with ID: ${hospitalId}`
        };
      }

      const hospital = result[0];
      return {
        success: true,
        hospital: {
          id: hospital.id,
          name: hospital.name,
          description: hospital.description,
          city: hospital.city,
          state: hospital.state,
          type: hospital.type,
          rating: hospital.rating,
          reviewCount: hospital.review_count,
          emergencyServices: hospital.emergency_services,
          traumaLevel: hospital.trauma_level,
          address: hospital.address,
          phone: hospital.phone,
          website: hospital.website,
          facilities: hospital.facilities || [],
          doctors: hospital.doctors || [],
          metadata: hospital.metadata
        },
        message: `Retrieved detailed information for ${hospital.name}`
      };

    } catch (error: any) {
      console.error('❌ Hospital details error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get hospital details. Please try again.'
      };
    }
  }
});

// Search hospitals by text only (fallback)
export const searchHospitalsTextOnlyTool = tool({
  description: 'Search hospitals using text search only (fallback when semantic search fails)',
  inputSchema: z.object({
    query: z.string().describe('Text search query'),
    location: z.string().optional().describe('City or state to search in'),
    emergencyServices: z.boolean().optional().describe('Filter by emergency services availability')
  }),
  execute: async ({ query, location, emergencyServices }) => {
    console.log(`🏥 Text search for hospitals: "${query}"`);
    
    try {
      const supabase = await createClient();
      
      const { data: results, error } = await supabase.rpc(
        'search_hospitals_text_only',
        {
          search_query: query,
          p_filters: {
            ...(location && { city: location }),
            ...(emergencyServices !== undefined && { emergency_services: emergencyServices }),
            is_verified: true
          },
          p_options: {
            limit: 10
          }
        }
      );

      if (error) {
        throw new Error(`Text search failed: ${error.message}`);
      }

      if (!results || results.length === 0) {
        return {
          success: true,
          hospitals: [],
          message: `No hospitals found for "${query}"${location ? ` in ${location}` : ''}`,
          searchType: 'text-only'
        };
      }

      const hospitals = results.map((hospital: any) => ({
        id: hospital.id,
        name: hospital.name,
        city: hospital.city,
        state: hospital.state,
        type: hospital.type,
        rating: hospital.rating,
        emergencyServices: hospital.emergency_services,
        traumaLevel: hospital.trauma_level,
        description: hospital.description,
        textScore: hospital.text_score
      }));

      return {
        success: true,
        hospitals,
        message: `Found ${hospitals.length} hospitals using text search`,
        searchType: 'text-only'
      };

    } catch (error: any) {
      console.error('❌ Text search error:', error);
      return {
        success: false,
        hospitals: [],
        error: error.message,
        message: 'Text search failed. Please try again.',
        searchType: 'text-only'
      };
    }
  }
});