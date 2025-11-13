import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SimilarHospital {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  similarity_score: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const hospitalId = resolvedParams.id;
    
    if (!hospitalId) {
      return NextResponse.json(
        { error: 'Hospital ID is required' },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const similarityThreshold = parseFloat(searchParams.get('threshold') || '0.75');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate parameters
    if (similarityThreshold < 0 || similarityThreshold > 1) {
      return NextResponse.json(
        { error: 'Similarity threshold must be between 0 and 1' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    console.log(`🔍 Finding hospitals similar to ${hospitalId} with threshold ${similarityThreshold}`);

    const supabase = await createClient();

    // First check if the target hospital exists and has an embedding
    const { data: targetHospital, error: targetError } = await supabase
      .from('hospitals')
      .select('id, name, embedding')
      .eq('id', hospitalId)
      .single();

    if (targetError) {
      console.error('❌ Error fetching target hospital:', targetError);
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    if (!targetHospital.embedding) {
      return NextResponse.json({
        message: 'Target hospital does not have an embedding yet. Please run indexing first.',
        similar_hospitals: [],
        metadata: {
          target_hospital_id: hospitalId,
          target_hospital_name: targetHospital.name,
          has_embedding: false,
          similarity_threshold: similarityThreshold,
          limit,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Find similar hospitals using the database function
    const { data, error } = await supabase.rpc('find_similar_hospitals', {
      target_hospital_id: hospitalId,
      similarity_threshold: similarityThreshold,
      result_limit: limit,
    });

    if (error) {
      console.error('❌ Error finding similar hospitals:', error);
      return NextResponse.json(
        { error: `Failed to find similar hospitals: ${error.message}` },
        { status: 500 }
      );
    }

    const similarHospitals = data as SimilarHospital[];

    console.log(`✅ Found ${similarHospitals.length} similar hospitals for ${targetHospital.name}`);

    // Calculate some basic statistics
    const scores = similarHospitals.map(h => h.similarity_score);
    const avgSimilarity = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const maxSimilarity = scores.length > 0 ? Math.max(...scores) : 0;
    const minSimilarity = scores.length > 0 ? Math.min(...scores) : 0;

    return NextResponse.json({
      similar_hospitals: similarHospitals,
      metadata: {
        target_hospital_id: hospitalId,
        target_hospital_name: targetHospital.name,
        total_results: similarHospitals.length,
        similarity_threshold: similarityThreshold,
        limit,
        statistics: {
          avg_similarity: Math.round(avgSimilarity * 1000) / 1000,
          max_similarity: Math.round(maxSimilarity * 1000) / 1000,
          min_similarity: Math.round(minSimilarity * 1000) / 1000,
        },
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('❌ Similar hospitals API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}