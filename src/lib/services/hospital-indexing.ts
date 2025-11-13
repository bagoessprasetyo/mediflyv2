'use client';

import { createClient } from '@/lib/supabase/client';
import { getEmbeddingService, generateHospitalEmbedding } from './embedding';

// Types
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
}

export interface IndexingOptions {
  batchSize?: number;
  onProgress?: (progress: IndexingProgress) => void;
  onError?: (error: string, hospital?: HospitalEmbeddingJob) => void;
  onComplete?: (summary: IndexingProgress) => void;
  forceRegenerate?: boolean; // Regenerate embeddings even if they already exist
}

// Hospital Indexing Service
export class HospitalIndexingService {
  private supabase = createClient();
  private embeddingService = getEmbeddingService();
  private isIndexing = false;
  private currentProgress: IndexingProgress = this.getInitialProgress();

  private getInitialProgress(): IndexingProgress {
    return {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      currentBatch: 0,
      totalBatches: 0,
      isComplete: false,
      errors: [],
    };
  }

  // Check if indexing is currently in progress
  isIndexingInProgress(): boolean {
    return this.isIndexing;
  }

  // Get current indexing progress
  getCurrentProgress(): IndexingProgress {
    return { ...this.currentProgress };
  }

  // Get hospitals that need embeddings
  async getHospitalsNeedingEmbeddings(batchSize: number = 50, forceRegenerate: boolean = false): Promise<HospitalEmbeddingJob[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_hospitals_needing_embeddings', {
        batch_size: batchSize
      });

      if (error) {
        throw new Error(`Failed to fetch hospitals: ${error.message}`);
      }

      // If force regenerate, get all active hospitals regardless of embedding status
      if (forceRegenerate) {
        const { data: allHospitals, error: allError } = await this.supabase
          .from('hospitals')
          .select('id, name, description, type, city, state, trauma_level, emergency_services')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(batchSize);

        if (allError) {
          throw new Error(`Failed to fetch all hospitals: ${allError.message}`);
        }

        return allHospitals || [];
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching hospitals needing embeddings:', error);
      throw error;
    }
  }

  // Index a single hospital
  async indexSingleHospital(hospital: HospitalEmbeddingJob): Promise<boolean> {
    try {
      console.log(`🏥 Indexing hospital: ${hospital.name}`);

      // Generate embedding
      const { embedding, metadata } = await generateHospitalEmbedding({
        name: hospital.name,
        description: hospital.description,
        type: hospital.type,
        city: hospital.city,
        state: hospital.state,
        trauma_level: hospital.trauma_level,
        emergency_services: hospital.emergency_services,
      });

      // Update hospital with embedding
      const { error } = await this.supabase.rpc('update_hospital_embedding', {
        hospital_id: hospital.id,
        new_embedding: JSON.stringify(embedding),
        metadata_json: metadata,
      });

      if (error) {
        throw new Error(`Database update failed: ${error.message}`);
      }

      console.log(`✅ Successfully indexed hospital: ${hospital.name}`);
      return true;
    } catch (error: any) {
      console.error(`❌ Failed to index hospital ${hospital.name}:`, error);
      throw error;
    }
  }

  // Index all hospitals that need embeddings
  async indexHospitals(options: IndexingOptions = {}): Promise<IndexingProgress> {
    if (this.isIndexing) {
      throw new Error('Indexing is already in progress. Please wait for it to complete.');
    }

    const {
      batchSize = 10,
      onProgress,
      onError,
      onComplete,
      forceRegenerate = false,
    } = options;

    this.isIndexing = true;
    this.currentProgress = this.getInitialProgress();

    try {
      console.log('🚀 Starting hospital indexing process...');
      
      // Get hospitals that need indexing
      const hospitals = await this.getHospitalsNeedingEmbeddings(1000, forceRegenerate); // Get larger batch to know total
      
      if (hospitals.length === 0) {
        console.log('✅ All hospitals already have embeddings!');
        this.currentProgress.isComplete = true;
        onComplete?.(this.currentProgress);
        return this.currentProgress;
      }

      // Initialize progress
      this.currentProgress.total = hospitals.length;
      this.currentProgress.totalBatches = Math.ceil(hospitals.length / batchSize);

      console.log(`📊 Found ${hospitals.length} hospitals to index in ${this.currentProgress.totalBatches} batches`);
      
      onProgress?.(this.currentProgress);

      // Process hospitals in batches
      for (let i = 0; i < hospitals.length; i += batchSize) {
        const batch = hospitals.slice(i, i + batchSize);
        this.currentProgress.currentBatch = Math.floor(i / batchSize) + 1;

        console.log(`🔄 Processing batch ${this.currentProgress.currentBatch}/${this.currentProgress.totalBatches} (${batch.length} hospitals)`);

        // Process batch with some concurrency but not too much to avoid rate limits
        const batchPromises = batch.map(async (hospital, index) => {
          try {
            // Add small delay to avoid overwhelming the API
            if (index > 0) {
              await new Promise(resolve => setTimeout(resolve, 500 * index));
            }

            const success = await this.indexSingleHospital(hospital);
            
            if (success) {
              this.currentProgress.successful++;
            } else {
              this.currentProgress.failed++;
              this.currentProgress.errors.push({
                hospitalId: hospital.id,
                hospitalName: hospital.name,
                error: 'Unknown indexing error',
              });
            }

            this.currentProgress.processed++;
            onProgress?.(this.currentProgress);

          } catch (error: any) {
            console.error(`Failed to index hospital ${hospital.name}:`, error);
            
            this.currentProgress.failed++;
            this.currentProgress.processed++;
            this.currentProgress.errors.push({
              hospitalId: hospital.id,
              hospitalName: hospital.name,
              error: error.message,
            });

            onError?.(error.message, hospital);
            onProgress?.(this.currentProgress);
          }
        });

        // Wait for batch to complete
        await Promise.allSettled(batchPromises);

        console.log(`✅ Batch ${this.currentProgress.currentBatch} completed. Progress: ${this.currentProgress.processed}/${this.currentProgress.total}`);
      }

      this.currentProgress.isComplete = true;
      
      console.log(`🎉 Indexing completed! Processed: ${this.currentProgress.processed}, Successful: ${this.currentProgress.successful}, Failed: ${this.currentProgress.failed}`);
      
      onComplete?.(this.currentProgress);
      
      return this.currentProgress;

    } catch (error: any) {
      console.error('❌ Indexing process failed:', error);
      this.currentProgress.errors.push({
        hospitalId: 'SYSTEM',
        hospitalName: 'System Error',
        error: error.message,
      });
      
      onError?.(error.message);
      throw error;
    } finally {
      this.isIndexing = false;
    }
  }

  // Reindex specific hospitals by IDs
  async reindexHospitals(hospitalIds: string[]): Promise<IndexingProgress> {
    if (this.isIndexing) {
      throw new Error('Indexing is already in progress. Please wait for it to complete.');
    }

    this.isIndexing = true;
    this.currentProgress = this.getInitialProgress();

    try {
      console.log(`🔄 Reindexing ${hospitalIds.length} specific hospitals...`);

      // Fetch specific hospitals
      const { data: hospitals, error } = await this.supabase
        .from('hospitals')
        .select('id, name, description, type, city, state, trauma_level, emergency_services')
        .in('id', hospitalIds);

      if (error) {
        throw new Error(`Failed to fetch hospitals: ${error.message}`);
      }

      if (!hospitals || hospitals.length === 0) {
        throw new Error('No hospitals found with the provided IDs');
      }

      this.currentProgress.total = hospitals.length;
      this.currentProgress.totalBatches = 1;

      // Process all hospitals
      for (const hospital of hospitals) {
        try {
          await this.indexSingleHospital(hospital as HospitalEmbeddingJob);
          this.currentProgress.successful++;
        } catch (error: any) {
          this.currentProgress.failed++;
          this.currentProgress.errors.push({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            error: error.message,
          });
        }
        
        this.currentProgress.processed++;
      }

      this.currentProgress.isComplete = true;
      
      console.log(`✅ Reindexing completed for ${this.currentProgress.successful}/${this.currentProgress.total} hospitals`);
      
      return this.currentProgress;

    } finally {
      this.isIndexing = false;
    }
  }

  // Get indexing statistics
  async getIndexingStats(): Promise<{
    totalHospitals: number;
    indexedHospitals: number;
    pendingHospitals: number;
    lastIndexed?: string;
  }> {
    try {
      // Get total hospitals
      const { count: totalHospitals, error: totalError } = await this.supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (totalError) throw totalError;

      // Get indexed hospitals
      const { count: indexedHospitals, error: indexedError } = await this.supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .not('embedding', 'is', null);

      if (indexedError) throw indexedError;

      // Get last indexed timestamp
      const { data: lastIndexedData, error: lastError } = await this.supabase
        .from('hospitals')
        .select('embedding_metadata')
        .eq('is_active', true)
        .not('embedding', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (lastError) throw lastError;

      const lastIndexed = lastIndexedData?.[0]?.embedding_metadata?.generated_at;

      return {
        totalHospitals: totalHospitals || 0,
        indexedHospitals: indexedHospitals || 0,
        pendingHospitals: (totalHospitals || 0) - (indexedHospitals || 0),
        lastIndexed,
      };
    } catch (error: any) {
      console.error('Error getting indexing stats:', error);
      throw error;
    }
  }

  // Reset all embeddings (for testing or rebuilding index)
  async resetAllEmbeddings(): Promise<boolean> {
    try {
      console.log('🔄 Resetting all hospital embeddings...');

      const { error } = await this.supabase
        .from('hospitals')
        .update({ 
          embedding: null, 
          embedding_metadata: null 
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      if (error) {
        throw new Error(`Failed to reset embeddings: ${error.message}`);
      }

      console.log('✅ All embeddings have been reset');
      return true;
    } catch (error: any) {
      console.error('❌ Failed to reset embeddings:', error);
      throw error;
    }
  }
}

// Singleton instance
let indexingService: HospitalIndexingService | null = null;

export function getHospitalIndexingService(): HospitalIndexingService {
  if (!indexingService) {
    indexingService = new HospitalIndexingService();
  }
  return indexingService;
}

// Helper functions
export async function startHospitalIndexing(options?: IndexingOptions): Promise<IndexingProgress> {
  const service = getHospitalIndexingService();
  return service.indexHospitals(options);
}

export async function getIndexingStatus(): Promise<{
  isIndexing: boolean;
  progress: IndexingProgress;
  stats: any;
}> {
  const service = getHospitalIndexingService();
  
  const [progress, stats] = await Promise.all([
    Promise.resolve(service.getCurrentProgress()),
    service.getIndexingStats(),
  ]);

  return {
    isIndexing: service.isIndexingInProgress(),
    progress,
    stats,
  };
}