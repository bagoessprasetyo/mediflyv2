import { NextRequest, NextResponse } from 'next/server';
import { 
  startHospitalIndexing, 
  getEmbeddingStatus, 
  reindexHospitals,
  resetEmbeddings,
  type IndexingOptions 
} from '@/lib/services/hospital-indexing-server';

// POST: Start indexing process
export async function POST(request: NextRequest) {
  try {
    // Parse request body for options
    let options: IndexingOptions = {};
    try {
      const body = await request.json();
      options = {
        batchSize: body.batchSize || 10,
        forceRegenerate: body.forceRegenerate || false,
        delayBetweenBatches: body.delayBetweenBatches || 1000
      };
    } catch {
      // Use defaults if no body provided
    }

    console.log('🚀 Starting hospital embedding indexing with options:', options);

    // Start indexing
    const progress = await startHospitalIndexing(options);

    console.log('✅ Indexing completed successfully');

    return NextResponse.json({
      message: 'Indexing completed successfully',
      progress,
      options,
    });
  } catch (error: any) {
    console.error('❌ Failed to start indexing:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to start indexing',
        details: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET: Get indexing status and statistics
export async function GET() {
  try {
    // Get embedding statistics
    const embeddingStats = await getEmbeddingStatus();

    return NextResponse.json({
      statistics: embeddingStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Failed to get embedding status:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to get embedding status',
        details: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// PUT: Reindex specific hospitals
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.hospital_ids || !Array.isArray(body.hospital_ids)) {
      return NextResponse.json(
        { error: 'hospital_ids array is required' },
        { status: 400 }
      );
    }

    const hospitalIds = body.hospital_ids as string[];
    
    if (hospitalIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one hospital ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Reindexing ${hospitalIds.length} specific hospitals:`, hospitalIds);

    // Start reindexing
    const result = await reindexHospitals(hospitalIds);

    return NextResponse.json({
      message: 'Reindexing completed',
      result,
      completed_at: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Error reindexing hospitals:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reindex hospitals',
        details: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// DELETE: Reset all embeddings
export async function DELETE() {
  try {
    console.log('🔄 Resetting all hospital embeddings...');

    // Reset all embeddings
    await resetEmbeddings();

    return NextResponse.json({
      message: 'All embeddings have been reset successfully',
      reset_at: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Error resetting embeddings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reset embeddings',
        details: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}