/**
 * Google Gemini Batch Embedding Service
 * Efficient batch processing for multiple text embeddings using Gemini
 */

import { GoogleGenAI } from '@google/genai';
import {
  generateGeminiEmbedding,
  GeminiEmbeddingOptions,
  GeminiEmbeddingResponse,
  GEMINI_CONFIG
} from './embedding-gemini';

// Batch processing configuration
export interface GeminiBatchOptions extends GeminiEmbeddingOptions {
  batchSize?: number;
  maxConcurrency?: number;
  enableParallel?: boolean;
  onProgress?: (completed: number, total: number) => void;
  onError?: (error: Error, text: string, index: number) => void;
}

// Batch processing result
export interface GeminiBatchResult {
  embeddings: (GeminiEmbeddingResponse | null)[];
  successful: number;
  failed: number;
  totalTime: number;
  averageTime: number;
  errors: Array<{ index: number; text: string; error: string; }>;
  metadata: {
    batchSize: number;
    totalTexts: number;
    provider: 'gemini';
    model: string;
    dimensions: number;
    totalCost: number;
    totalTokens: number;
  };
}

// Optimized batch configuration for Gemini
const GEMINI_BATCH_CONFIG = {
  defaultBatchSize: 50, // Gemini has generous rate limits
  maxBatchSize: 100,
  defaultConcurrency: 5, // Can handle more concurrent requests
  maxConcurrency: 10,
  delayBetweenBatches: 200, // Lower delay due to generous limits
};

// Utility function for controlled delay
async function delayBatch(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process multiple texts in batches using Gemini embeddings
 */
export async function generateGeminiBatchEmbeddings(
  texts: string[],
  options: GeminiBatchOptions = {}
): Promise<GeminiBatchResult> {
  const startTime = Date.now();
  
  // Validate inputs
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    throw new Error('Texts array is required and must not be empty');
  }
  
  // Configure batch processing
  const batchSize = Math.min(
    options.batchSize || GEMINI_BATCH_CONFIG.defaultBatchSize,
    GEMINI_BATCH_CONFIG.maxBatchSize
  );
  
  const maxConcurrency = Math.min(
    options.maxConcurrency || GEMINI_BATCH_CONFIG.defaultConcurrency,
    GEMINI_BATCH_CONFIG.maxConcurrency
  );
  
  const enableParallel = options.enableParallel !== false;
  const model = options.model || GEMINI_CONFIG.defaultModel;
  const dimensions = options.dimensions || GEMINI_CONFIG.defaultDimensions;
  
  console.log(`🚀 Starting Gemini batch embedding generation:`, {
    totalTexts: texts.length,
    batchSize,
    maxConcurrency,
    enableParallel,
    model,
    dimensions
  });
  
  // Initialize results
  const results: (GeminiEmbeddingResponse | null)[] = new Array(texts.length).fill(null);
  const errors: Array<{ index: number; text: string; error: string; }> = [];
  let successful = 0;
  let failed = 0;
  let totalCost = 0;
  let totalTokens = 0;
  
  // Process in batches
  if (enableParallel) {
    await processGeminiParallel();
  } else {
    await processGeminiSequential();
  }
  
  const totalTime = Date.now() - startTime;
  const averageTime = results.filter(r => r !== null).length > 0 ? totalTime / results.filter(r => r !== null).length : 0;
  
  console.log(`✅ Gemini batch embedding completed:`, {
    successful,
    failed,
    totalTime: `${totalTime}ms`,
    averageTime: `${averageTime.toFixed(2)}ms`,
    totalCost: `$${totalCost.toFixed(6)}`,
    totalTokens
  });
  
  return {
    embeddings: results,
    successful,
    failed,
    totalTime,
    averageTime,
    errors,
    metadata: {
      batchSize,
      totalTexts: texts.length,
      provider: 'gemini',
      model,
      dimensions,
      totalCost,
      totalTokens
    }
  };
  
  // Parallel processing with concurrency control
  async function processGeminiParallel(): Promise<void> {
    const semaphore = new Semaphore(maxConcurrency);
    const promises: Promise<void>[] = [];
    
    for (let i = 0; i < texts.length; i++) {
      const promise = semaphore.acquire().then(async (release) => {
        try {
          await processGeminiSingle(i);
        } finally {
          release();
        }
      });
      promises.push(promise);
    }
    
    await Promise.all(promises);
  }
  
  // Sequential processing
  async function processGeminiSequential(): Promise<void> {
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map((_, batchIndex) => 
        processGeminiSingle(i + batchIndex)
      );
      
      await Promise.all(batchPromises);
      
      // Progress callback
      if (options.onProgress) {
        options.onProgress(Math.min(i + batchSize, texts.length), texts.length);
      }
      
      // Small delay between batches to be respectful
      if (i + batchSize < texts.length) {
        await delayBatch(GEMINI_BATCH_CONFIG.delayBetweenBatches);
      }
    }
  }
  
  // Process single text embedding
  async function processGeminiSingle(index: number): Promise<void> {
    const text = texts[index];
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      const error = 'Empty or invalid text';
      errors.push({ index, text: text || '', error });
      failed++;
      if (options.onError) {
        options.onError(new Error(error), text || '', index);
      }
      return;
    }
    
    try {
      const embedding = await generateGeminiEmbedding(text.trim(), {
        model: options.model,
        dimensions: options.dimensions,
        taskType: options.taskType,
        title: options.title
      });
      
      results[index] = embedding;
      successful++;
      totalCost += embedding.metadata.usage.estimated_cost;
      totalTokens += embedding.metadata.usage.total_tokens;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      errors.push({ index, text, error: errorMessage });
      failed++;
      
      console.error(`❌ Failed to generate embedding for text ${index}:`, errorMessage);
      
      if (options.onError) {
        options.onError(error, text, index);
      }
    }
  }
}

/**
 * Simple semaphore for concurrency control
 */
class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];
  
  constructor(permits: number) {
    this.permits = permits;
  }
  
  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve(() => this.release());
      } else {
        this.waiting.push(() => {
          this.permits--;
          resolve(() => this.release());
        });
      }
    });
  }
  
  private release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      if (next) next();
    }
  }
}

/**
 * Hospital-specific batch embedding function (compatible with existing system)
 */
export interface Hospital {
  id: string;
  name: string;
  description?: string;
  specialties?: string[];
  location?: string;
  [key: string]: any;
}

export async function generateHospitalGeminiBatchEmbeddings(
  hospitals: Hospital[],
  options: GeminiBatchOptions = {}
): Promise<GeminiBatchResult> {
  console.log(`🏥 Generating Gemini embeddings for ${hospitals.length} hospitals`);
  
  // Prepare hospital text representations
  const hospitalTexts = hospitals.map(hospital => prepareHospitalText(hospital));
  
  // Set task type for document embedding
  const hospitalOptions: GeminiBatchOptions = {
    ...options,
    taskType: 'RETRIEVAL_DOCUMENT' // Hospitals are documents for search
  };
  
  const result = await generateGeminiBatchEmbeddings(hospitalTexts, hospitalOptions);
  
  console.log(`🏥 Hospital embedding batch completed: ${result.successful}/${hospitals.length} successful`);
  
  return result;
}

/**
 * Prepare hospital data for embedding (compatible with existing format)
 */
function prepareHospitalText(hospital: Hospital): string {
  const parts: string[] = [];
  
  // Hospital name (most important)
  if (hospital.name) {
    parts.push(`Hospital: ${hospital.name}`);
  }
  
  // Description
  if (hospital.description) {
    parts.push(`Description: ${hospital.description}`);
  }
  
  // Specialties
  if (hospital.specialties && hospital.specialties.length > 0) {
    parts.push(`Specialties: ${hospital.specialties.join(', ')}`);
  }
  
  // Location
  if (hospital.location) {
    parts.push(`Location: ${hospital.location}`);
  }
  
  // Additional fields
  Object.entries(hospital).forEach(([key, value]) => {
    if (!['id', 'name', 'description', 'specialties', 'location'].includes(key) && 
        value && typeof value === 'string' && value.length > 0) {
      parts.push(`${key}: ${value}`);
    }
  });
  
  return parts.join('. ');
}

/**
 * Utility function to chunk array for processing
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Export batch configuration for external use
export { GEMINI_BATCH_CONFIG };