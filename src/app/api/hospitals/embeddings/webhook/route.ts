import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reindexHospitals } from '@/lib/services/hospital-indexing-server';

// Webhook handler for Supabase database changes
// This can be triggered when hospitals are created/updated
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if configured
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-webhook-signature');
      // In a real implementation, verify the signature here
      if (!signature) {
        return NextResponse.json(
          { error: 'Missing webhook signature' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    console.log('📨 Received webhook payload:', {
      type: body.type,
      table: body.table,
      record: body.record ? { id: body.record.id, name: body.record.name } : null,
    });

    // Only process hospital table events
    if (body.table !== 'hospitals') {
      return NextResponse.json({
        status: 'ignored',
        message: 'Event not for hospitals table',
      });
    }

    // Only process INSERT and UPDATE events
    if (!['INSERT', 'UPDATE'].includes(body.type)) {
      return NextResponse.json({
        status: 'ignored',
        message: 'Event type not handled',
      });
    }

    const hospitalRecord = body.record;
    if (!hospitalRecord || !hospitalRecord.id) {
      return NextResponse.json(
        { error: 'Invalid hospital record' },
        { status: 400 }
      );
    }

    // Skip if hospital is inactive
    if (!hospitalRecord.is_active) {
      console.log(`⏭️ Skipping inactive hospital: ${hospitalRecord.name}`);
      return NextResponse.json({
        status: 'skipped',
        message: 'Hospital is inactive',
      });
    }

    console.log(`🏥 Processing hospital: ${hospitalRecord.name} (${hospitalRecord.id})`);

    // For INSERT events, always generate embedding
    // For UPDATE events, check if embedding exists and content has changed significantly
    let shouldGenerateEmbedding = body.type === 'INSERT';

    if (body.type === 'UPDATE') {
      // Check if the embedding-relevant fields have changed
      const oldRecord = body.old_record;
      const embeddingFields = ['name', 'description', 'type', 'city', 'state', 'trauma_level', 'emergency_services'];
      
      const hasRelevantChanges = embeddingFields.some(field => 
        oldRecord?.[field] !== hospitalRecord[field]
      );

      shouldGenerateEmbedding = hasRelevantChanges || !hospitalRecord.embedding;
      
      if (hasRelevantChanges) {
        console.log(`🔄 Hospital ${hospitalRecord.name} has relevant changes, will regenerate embedding`);
      }
    }

    if (!shouldGenerateEmbedding) {
      console.log(`⏭️ No embedding generation needed for ${hospitalRecord.name}`);
      return NextResponse.json({
        status: 'skipped',
        message: 'No embedding generation needed',
      });
    }

    try {
      // Generate embedding for this specific hospital
      await reindexHospitals([hospitalRecord.id]);
      
      console.log(`✅ Successfully generated embedding for ${hospitalRecord.name}`);
      
      return NextResponse.json({
        status: 'success',
        message: 'Embedding generated successfully',
        hospital_id: hospitalRecord.id,
        hospital_name: hospitalRecord.name,
        timestamp: new Date().toISOString(),
      });

    } catch (embeddingError: any) {
      console.error(`❌ Failed to generate embedding for ${hospitalRecord.name}:`, embeddingError);
      
      // Don't fail the webhook - log the error and continue
      return NextResponse.json({
        status: 'error',
        message: 'Failed to generate embedding',
        error: embeddingError.message,
        hospital_id: hospitalRecord.id,
        hospital_name: hospitalRecord.name,
        timestamp: new Date().toISOString(),
      }, { status: 200 }); // Return 200 so webhook doesn't retry
    }

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Webhook processing failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Hospital embeddings webhook is operational',
    timestamp: new Date().toISOString(),
  });
}