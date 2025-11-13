import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateUnifiedEmbedding } from '@/lib/services/embedding-provider';

// Types for search request and response
interface SearchFilters {
  city?: string;
  state?: string;
  type?: string;
  emergency_services?: boolean;
  is_verified?: boolean;
  trauma_level?: string;
}

interface SearchOptions {
  semantic_weight?: number;
  text_weight?: number;
  similarity_threshold?: number;
  limit?: number;
}

interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  options?: SearchOptions;
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  type: string;
  emergency_services: boolean;
  trauma_level: string;
  rating: number;
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  similarity_score: number;
  text_score: number;
  combined_score: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const { query, filters = {}, options = {} } = body;

    // Default search options
    const searchOptions: SearchOptions = {
      semantic_weight: 0.7,
      text_weight: 0.3,
      similarity_threshold: 0.6,
      limit: 50,
      ...options,
    };

    console.log(`🔍 Searching hospitals for: "${query}"`);
    console.log('📊 Search options:', searchOptions);
    console.log('🎯 Filters:', filters);

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
      console.log(`✅ Generated query embedding with ${embeddingResult.metadata.provider} (${embeddingResult.metadata.dimensions}D)`);
    } catch (embeddingError) {
      console.warn('⚠️ Failed to generate embedding, falling back to text search only:', embeddingError);
      // Continue with text search only
    }

    // Use direct database search - simplified approach
    let results: SearchResult[] = [];
    let error = null;

    try {
      console.log('🔍 Searching database for hospitals...');
      
      // Build direct query
      let query_builder = supabase
        .from('hospitals')
        .select(`
          id, name, slug, description, city, state, type, 
          emergency_services, trauma_level, rating, review_count,
          is_active, is_verified, is_featured, address, phone, website
        `)
        .eq('is_active', true)
        .eq('is_verified', filters.is_verified ?? true);

      // Apply text search - prioritize name matches first
      if (query && query.trim()) {
        query_builder = query_builder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      // Apply filters
      if (filters.city) {
        query_builder = query_builder.ilike('city', `%${filters.city}%`);
      }
      if (filters.state) {
        query_builder = query_builder.ilike('state', `%${filters.state}%`);
      }
      if (filters.type) {
        query_builder = query_builder.eq('type', filters.type);
      }
      if (filters.emergency_services !== undefined) {
        query_builder = query_builder.eq('emergency_services', filters.emergency_services);
      }
      if (filters.trauma_level) {
        query_builder = query_builder.eq('trauma_level', filters.trauma_level);
      }

      const { data: hospitalData, error: queryError } = await query_builder
        .limit(searchOptions.limit || 50)
        .order('rating', { ascending: false });

      if (queryError) throw queryError;

      results = (hospitalData || []).map(h => ({
        ...h,
        similarity_score: 0,
        text_score: 0.5,
        combined_score: 0.5
      }));

      console.log(`✅ Direct query found ${results.length} hospitals`);
      
    } catch (queryError: any) {
      console.error('❌ Hospital search failed:', queryError);
      error = queryError;
    }

    if (error) {
      return NextResponse.json(
        { error: `Search failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`✅ Found ${results.length} hospitals matching query "${query}"`);

    // Add search analytics metadata
    const searchMetadata = {
      query,
      total_results: results.length,
      has_semantic_search: searchEmbedding !== null,
      search_options: searchOptions,
      filters,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      results,
      metadata: searchMetadata,
    });

  } catch (error: any) {
    console.error('❌ Search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during search',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for simple search queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const type = searchParams.get('type');
    const emergencyServices = searchParams.get('emergency_services');
    const isVerified = searchParams.get('is_verified');
    const traumaLevel = searchParams.get('trauma_level');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Build filters from query parameters
    const filters: SearchFilters = {};
    if (city) filters.city = city;
    if (state) filters.state = state;
    if (type) filters.type = type;
    if (emergencyServices) filters.emergency_services = emergencyServices === 'true';
    if (isVerified) filters.is_verified = isVerified === 'true';
    if (traumaLevel) filters.trauma_level = traumaLevel;

    // Build options
    const options: SearchOptions = {};
    if (limit) options.limit = parseInt(limit, 10);

    // Use POST logic
    const searchRequest: SearchRequest = { query, filters, options };
    
    // Simulate POST request body
    const postRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchRequest),
    });

    // Reuse POST logic
    return await POST(postRequest as NextRequest);

  } catch (error: any) {
    console.error('❌ GET search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during search',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}