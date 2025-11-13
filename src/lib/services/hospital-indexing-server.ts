// Server-side hospital indexing service
import { createClient } from '@/lib/supabase/server';
import { 
  generateUnifiedEmbedding,
  generateUnifiedHospitalBatchEmbeddings,
  getEmbeddingProvider,
  type Hospital
} from '@/lib/services/embedding-provider';

// Types (same as client version)
export interface HospitalEmbeddingJob {
  id: string;
  name: string;
  description?: string;
  type?: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
  city?: string;
  state?: string;
  trauma_level?: string;
  emergency_services?: boolean;
}

export interface IndexingProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  currentBatch: number;
  totalBatches: number;
  isComplete: boolean;
  errors: Array<{
    hospitalId: string;
    hospitalName: string;
    error: string;
  }>;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTimeRemaining?: number;
}

export interface IndexingOptions {
  batchSize?: number;
  forceRegenerate?: boolean;
  delayBetweenBatches?: number;
  skipValidation?: boolean;
}

// Simple server-side indexing functions
export async function startHospitalIndexing(options: IndexingOptions = {}): Promise<IndexingProgress> {
  const {
    batchSize = 10,
    forceRegenerate = false,
    delayBetweenBatches = 1000
  } = options;

  console.log('🚀 Starting server-side hospital embedding indexing...', options);
  
  try {
    const supabase = await createClient();
    
    // Get hospitals that need embedding
    let query = supabase
      .from('hospitals')
      .select('id, name, description, type, city, state, trauma_level, emergency_services')
      .eq('is_active', true);

    if (!forceRegenerate) {
      query = query.is('embedding', null);
    }

    const { data: hospitals, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch hospitals: ${error.message}`);
    }

    if (!hospitals || hospitals.length === 0) {
      return {
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        currentBatch: 0,
        totalBatches: 0,
        isComplete: true,
        errors: [],
        startedAt: new Date(),
        completedAt: new Date()
      };
    }

    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors: Array<{ hospitalId: string; hospitalName: string; error: string }> = [];

    console.log(`📊 Processing ${hospitals.length} hospitals with unified embedding provider`);
    console.log(`🔧 Using embedding provider: ${getEmbeddingProvider()}`);

    // Use the new unified batch processing for better efficiency
    try {
      const result = await generateUnifiedHospitalBatchEmbeddings(hospitals, {
        provider: getEmbeddingProvider(),
        dimensions: 1536, // Force 1536 dimensions to match database schema
        enableFallback: true,
        fallbackProvider: getEmbeddingProvider() === 'gemini' ? 'openai' : 'gemini'
      });

      console.log(`📊 Batch processing complete: ${result.successful}/${hospitals.length} successful`);

      // Process the results and update the database
      for (let i = 0; i < hospitals.length; i++) {
        const hospital = hospitals[i];
        const embedding = result.embeddings[i];

        if (embedding) {
          try {
            // Update hospital with embedding (simplified for immediate testing)
            const { error: updateError } = await supabase
              .from('hospitals')
              .update({ 
                embedding: embedding.embedding,
                updated_at: new Date().toISOString()
              })
              .eq('id', hospital.id);

            if (updateError) {
              throw new Error(`Database update failed: ${updateError.message}`);
            }

            successful++;
            console.log(`✅ Successfully processed: ${hospital.name}`);
          } catch (error) {
            failed++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push({
              hospitalId: hospital.id,
              hospitalName: hospital.name,
              error: errorMessage
            });
            console.error(`❌ Failed to save ${hospital.name}:`, errorMessage);
          }
        } else {
          // Find the error for this hospital
          const hospitalError = result.errors.find(err => err.index === i);
          failed++;
          errors.push({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            error: hospitalError?.error || 'Unknown embedding generation error'
          });
        }
        processed++;
      }
    } catch (batchError) {
      console.error('❌ Unified batch processing failed:', batchError);
      throw new Error(`Batch processing failed: ${batchError}`);
    }

    const result: IndexingProgress = {
      total: hospitals.length,
      processed,
      successful,
      failed,
      currentBatch: 1,
      totalBatches: 1,
      isComplete: true,
      errors,
      startedAt: new Date(),
      completedAt: new Date()
    };

    console.log(`🎉 Indexing complete! Successful: ${successful}, Failed: ${failed}`);
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Hospital indexing failed:', errorMessage);
    
    throw new Error(`Failed to start indexing: ${errorMessage}`);
  }
}

export async function getEmbeddingStatus() {
  try {
    const supabase = await createClient();
    
    const { data: stats, error } = await supabase
      .from('hospitals')
      .select('id, embedding')
      .eq('is_active', true);
      
    if (error) {
      throw new Error(`Failed to get embedding status: ${error.message}`);
    }
    
    const total = stats?.length || 0;
    const withEmbeddings = stats?.filter(h => h.embedding !== null).length || 0;
    const withoutEmbeddings = total - withEmbeddings;
    const coverage = total > 0 ? (withEmbeddings / total) * 100 : 0;

    return {
      total,
      withEmbeddings,
      withoutEmbeddings,
      coverage,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to get embedding status:', error);
    throw error;
  }
}

export async function reindexHospitals(hospitalIds: string[]): Promise<IndexingProgress> {
  console.log(`🔄 Reindexing ${hospitalIds.length} specific hospitals...`);
  
  try {
    const supabase = await createClient();
    
    // Get specific hospitals
    const { data: hospitals, error } = await supabase
      .from('hospitals')
      .select('id, name, description, type, city, state, trauma_level, emergency_services')
      .in('id', hospitalIds)
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Failed to fetch hospitals: ${error.message}`);
    }

    if (!hospitals || hospitals.length === 0) {
      return {
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        currentBatch: 1,
        totalBatches: 1,
        isComplete: true,
        errors: [],
        startedAt: new Date(),
        completedAt: new Date()
      };
    }

    let successful = 0;
    let failed = 0;
    const errors: Array<{ hospitalId: string; hospitalName: string; error: string }> = [];

    console.log(`🔧 Using embedding provider: ${getEmbeddingProvider()}`);

    // Process each hospital using unified provider
    for (const hospital of hospitals) {
      try {
        // Generate new embedding using unified provider
        const embeddingText = `Hospital: ${hospital.name}. Description: ${hospital.description || ''}. Type: ${hospital.type || ''}. Location: ${hospital.city || ''}, ${hospital.state || ''}. Trauma Level: ${hospital.trauma_level || 'None'}. Emergency Services: ${hospital.emergency_services ? 'Available' : 'Not Available'}.`;
        
        const result = await generateUnifiedEmbedding(embeddingText, {
          provider: getEmbeddingProvider(),
          dimensions: 1536, // Force 1536 dimensions to match database schema
          enableFallback: true,
          fallbackProvider: getEmbeddingProvider() === 'gemini' ? 'openai' : 'gemini'
        });

        // Update hospital with embedding (simplified for immediate testing)
        const { error: updateError } = await supabase
          .from('hospitals')
          .update({ 
            embedding: result.embedding,
            updated_at: new Date().toISOString()
          })
          .eq('id', hospital.id);

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`);
        }

        successful++;
        console.log(`✅ Reindexed: ${hospital.name}`);
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          hospitalId: hospital.id,
          hospitalName: hospital.name,
          error: errorMessage
        });
        console.error(`❌ Failed to reindex ${hospital.name}:`, errorMessage);
      }
    }

    return {
      total: hospitals.length,
      processed: hospitals.length,
      successful,
      failed,
      currentBatch: 1,
      totalBatches: 1,
      isComplete: true,
      errors,
      startedAt: new Date(),
      completedAt: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Hospital reindexing failed:', errorMessage);
    throw new Error(`Failed to reindex hospitals: ${errorMessage}`);
  }
}

export async function resetEmbeddings(): Promise<void> {
  try {
    console.log('🗑️ Resetting all hospital embeddings...');
    
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('hospitals')
      .update({ 
        embedding: null,
        updated_at: new Date().toISOString()
      })
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Failed to reset embeddings: ${error.message}`);
    }
    
    console.log('✅ All embeddings reset successfully');
  } catch (error) {
    console.error('❌ Failed to reset embeddings:', error);
    throw error;
  }
}