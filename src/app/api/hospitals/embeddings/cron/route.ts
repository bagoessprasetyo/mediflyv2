import { NextRequest, NextResponse } from 'next/server';
import { startHospitalIndexing, getEmbeddingStatus } from '@/lib/services/hospital-indexing-server';

// This endpoint is designed to be called by cron jobs or webhooks
// to automatically index new hospitals that don't have embeddings
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Cron job: Starting automatic hospital embedding indexing...');

    // Get current statistics
    const stats = await getEmbeddingStatus();
    console.log(`📊 Current stats: ${stats.withEmbeddings}/${stats.total} hospitals indexed`);

    if (stats.withoutEmbeddings === 0) {
      console.log('✅ No hospitals need indexing, cron job complete');
      return NextResponse.json({
        status: 'complete',
        message: 'All hospitals already have embeddings',
        stats,
        timestamp: new Date().toISOString(),
      });
    }

    // Start indexing with conservative settings for background processing
    const result = await startHospitalIndexing({
      batchSize: 5, // Small batch size to avoid rate limits
      forceRegenerate: false,
      delayBetweenBatches: 2000, // 2 second delay between batches
    });

    return NextResponse.json({
      status: 'completed',
      message: 'Background indexing completed successfully',
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Cron job error:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Background indexing failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check cron job status
export async function GET() {
  try {
    const stats = await getEmbeddingStatus();

    return NextResponse.json({
      status: 'healthy',
      stats,
      last_checked: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Health check error:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Health check failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}