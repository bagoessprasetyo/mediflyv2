import OpenAI from 'openai';
import {
  EmbeddingModel,
  EmbeddingOptions,
  HospitalData,
  getModelConfig,
  validateDimensions,
  estimateEmbeddingCost,
  getCostMonitor,
  logEmbeddingUsage,
  prepareHospitalEmbeddingText,
  getIncludedHospitalFields,
  analyzeTextStructure,
  createOpenAIClient,
  delay,
  embeddingCache
} from './embedding-server';

// Enhanced batch processing interface
export interface BatchProcessingOptions {
  model?: EmbeddingModel;
  dimensions?: number;
  maxConcurrency?: number;
  adaptiveBatchSize?: boolean;
  trackUsage?: boolean;
  userId?: string;
  enableSmartCaching?: boolean;
  costBudgetCheck?: boolean;
}

export interface BatchResult {
  embedding: number[];
  metadata: any;
  hospital_id?: string;
  usageLogId?: string;
}

export interface BatchProcessingStats {
  totalProcessed: number;
  totalFailed: number;
  totalCost: number;
  totalTokens: number;
  totalTimeMs: number;
  cacheHitRate: number;
  averageProcessingTimePerHospital: number;
  batchSizeOptimization: {
    originalBatchSize: number;
    adaptedBatchSize: number;
    reasonForAdaptation: string;
  };
}

// Optimized batch processing with intelligent features
export async function generateBatchHospitalEmbeddingsOptimized(
  hospitals: HospitalData[],
  options: BatchProcessingOptions = {}
): Promise<{ results: BatchResult[]; stats: BatchProcessingStats }> {
  const {
    model = 'text-embedding-3-small' as EmbeddingModel,
    dimensions,
    maxConcurrency = 3,
    adaptiveBatchSize = true,
    trackUsage = true,
    userId,
    enableSmartCaching = true,
    costBudgetCheck = true
  } = options;

  if (!Array.isArray(hospitals) || hospitals.length === 0) {
    throw new Error('Hospitals must be a non-empty array');
  }

  const startTime = Date.now();
  const modelConfig = getModelConfig(model);
  const validatedDimensions = validateDimensions(model, dimensions);
  
  console.log(`🚀 Starting optimized batch embedding generation:`);
  console.log(`   • ${hospitals.length} hospitals`);
  console.log(`   • Model: ${model} (${validatedDimensions}D)`);
  console.log(`   • Max concurrency: ${maxConcurrency}`);
  console.log(`   • Smart caching: ${enableSmartCaching ? 'enabled' : 'disabled'}`);

  // Smart cache pre-check to avoid unnecessary API calls
  const { cachedHospitals, uncachedHospitals } = enableSmartCaching 
    ? await smartCacheCheck(hospitals)
    : { cachedHospitals: [], uncachedHospitals: hospitals };

  console.log(`📊 Cache analysis: ${cachedHospitals.length} cached, ${uncachedHospitals.length} need generation`);

  // Adaptive batch sizing based on input characteristics
  const batchSizeInfo = calculateOptimalBatchSize(uncachedHospitals, modelConfig, adaptiveBatchSize);
  console.log(`🎯 Batch size optimization: ${batchSizeInfo.size} (${batchSizeInfo.reason})`);

  // Cost estimation and budget check
  if (costBudgetCheck && uncachedHospitals.length > 0) {
    await performBudgetCheck(uncachedHospitals, model);
  }

  // Process uncached hospitals
  const processingResults = uncachedHospitals.length > 0
    ? await processBatchesWithConcurrency(uncachedHospitals, {
        model,
        dimensions: validatedDimensions,
        batchSize: batchSizeInfo.size,
        maxConcurrency,
        trackUsage,
        userId
      })
    : { results: [], totalCost: 0, totalTokens: 0, failedCount: 0 };

  // Combine cached and newly generated results
  const allResults: BatchResult[] = [
    ...cachedHospitals.map(convertCachedToResult),
    ...processingResults.results
  ];

  // Generate comprehensive stats
  const totalTime = Date.now() - startTime;
  const stats: BatchProcessingStats = {
    totalProcessed: allResults.length,
    totalFailed: processingResults.failedCount,
    totalCost: processingResults.totalCost,
    totalTokens: processingResults.totalTokens,
    totalTimeMs: totalTime,
    cacheHitRate: cachedHospitals.length / hospitals.length,
    averageProcessingTimePerHospital: totalTime / hospitals.length,
    batchSizeOptimization: {
      originalBatchSize: modelConfig.recommendedBatchSize,
      adaptedBatchSize: batchSizeInfo.size,
      reasonForAdaptation: batchSizeInfo.reason
    }
  };

  console.log(`🎉 Batch processing completed:`);
  console.log(`   • Processed: ${stats.totalProcessed}/${hospitals.length} (${(stats.totalProcessed/hospitals.length*100).toFixed(1)}%)`);
  console.log(`   • Cache hit rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`   • Total cost: ~$${stats.totalCost.toFixed(6)}`);
  console.log(`   • Total time: ${stats.totalTimeMs}ms (${stats.averageProcessingTimePerHospital.toFixed(1)}ms/hospital)`);
  console.log(`   • Token usage: ${stats.totalTokens}`);

  return { results: allResults, stats };
}

// Smart cache checking to identify which hospitals already have embeddings cached
async function smartCacheCheck(hospitals: HospitalData[]) {
  const cachedHospitals: HospitalData[] = [];
  const uncachedHospitals: HospitalData[] = [];

  for (const hospital of hospitals) {
    const embeddingText = prepareHospitalEmbeddingText(hospital);
    const cacheKey = embeddingText.toLowerCase();
    
    if (embeddingCache.has(cacheKey)) {
      const cached = embeddingCache.get(cacheKey)!;
      // Check if cache entry is still valid
      if (Date.now() - cached.timestamp < 1000 * 60 * 60) { // 1 hour TTL
        cachedHospitals.push(hospital);
        continue;
      } else {
        embeddingCache.delete(cacheKey);
      }
    }
    
    uncachedHospitals.push(hospital);
  }

  return { cachedHospitals, uncachedHospitals };
}

// Calculate optimal batch size based on content characteristics
function calculateOptimalBatchSize(
  hospitals: HospitalData[],
  modelConfig: any,
  adaptiveBatchSize: boolean
): { size: number; reason: string } {
  if (!adaptiveBatchSize || hospitals.length === 0) {
    return {
      size: modelConfig.recommendedBatchSize,
      reason: 'Using default recommended batch size'
    };
  }

  // Analyze content complexity
  const avgTextLength = hospitals.reduce((sum, hospital) => {
    return sum + prepareHospitalEmbeddingText(hospital).length;
  }, 0) / hospitals.length;

  // Adjust batch size based on content complexity
  let adaptedSize = modelConfig.recommendedBatchSize;
  let reason = 'Default batch size';

  if (avgTextLength > 2000) {
    adaptedSize = Math.max(10, Math.floor(modelConfig.recommendedBatchSize * 0.5));
    reason = 'Reduced for complex content (avg text length > 2000 chars)';
  } else if (avgTextLength < 500) {
    adaptedSize = Math.min(150, Math.floor(modelConfig.recommendedBatchSize * 1.5));
    reason = 'Increased for simple content (avg text length < 500 chars)';
  }

  // Ensure we don't exceed OpenAI limits
  adaptedSize = Math.min(adaptedSize, 100);

  return { size: adaptedSize, reason };
}

// Budget check before processing
async function performBudgetCheck(hospitals: HospitalData[], model: EmbeddingModel): Promise<void> {
  const estimatedTokens = hospitals.reduce((sum, hospital) => {
    const text = prepareHospitalEmbeddingText(hospital);
    return sum + Math.ceil(text.length / 4);
  }, 0);

  const estimatedCost = estimateEmbeddingCost(estimatedTokens, model);
  
  console.log(`💰 Budget check: ~${estimatedTokens} tokens, ~$${estimatedCost.toFixed(6)} estimated cost`);

  const costMonitor = getCostMonitor();
  const budgetCheck = await costMonitor.checkBudget(estimatedCost);
  
  if (!budgetCheck.allowed) {
    throw new Error(`Batch processing blocked by budget limit: ${budgetCheck.reason}`);
  }
}

// Process batches with controlled concurrency
async function processBatchesWithConcurrency(
  hospitals: HospitalData[],
  options: {
    model: EmbeddingModel;
    dimensions: number;
    batchSize: number;
    maxConcurrency: number;
    trackUsage: boolean;
    userId?: string;
  }
): Promise<{ results: BatchResult[]; totalCost: number; totalTokens: number; failedCount: number }> {
  const { model, dimensions, batchSize, maxConcurrency, trackUsage, userId } = options;
  
  // Create batch chunks
  const batches: HospitalData[][] = [];
  for (let i = 0; i < hospitals.length; i += batchSize) {
    batches.push(hospitals.slice(i, i + batchSize));
  }

  console.log(`🔄 Processing ${batches.length} batches with max ${maxConcurrency} concurrent batches`);

  let allResults: BatchResult[] = [];
  let totalCost = 0;
  let totalTokens = 0;
  let failedCount = 0;

  // Process batches in chunks to respect concurrency limits
  for (let i = 0; i < batches.length; i += maxConcurrency) {
    const batchChunk = batches.slice(i, i + maxConcurrency);
    
    const chunkPromises = batchChunk.map((batch, chunkIndex) => 
      processSingleBatchOptimized(batch, i + chunkIndex, {
        model,
        dimensions,
        trackUsage,
        userId,
        totalBatches: batches.length
      })
    );

    const chunkResults = await Promise.allSettled(chunkPromises);
    
    for (const [chunkIndex, result] of chunkResults.entries()) {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value.results);
        totalCost += result.value.batchCost;
        totalTokens += result.value.batchTokens;
      } else {
        console.error(`❌ Batch chunk ${i + chunkIndex} failed:`, result.reason);
        failedCount += batchChunk[chunkIndex].length;
      }
    }

    // Brief delay between chunks to be respectful of rate limits
    if (i + maxConcurrency < batches.length) {
      await delay(500);
    }
  }

  return { results: allResults, totalCost, totalTokens, failedCount };
}

// Optimized single batch processing
async function processSingleBatchOptimized(
  batch: HospitalData[],
  batchIndex: number,
  options: {
    model: EmbeddingModel;
    dimensions: number;
    trackUsage: boolean;
    userId?: string;
    totalBatches: number;
  }
): Promise<{ results: BatchResult[]; batchCost: number; batchTokens: number }> {
  const { model, dimensions, trackUsage, userId, totalBatches } = options;
  const modelConfig = getModelConfig(model);
  const results: BatchResult[] = [];
  
  const batchStartTime = Date.now();
  console.log(`📋 Processing optimized batch ${batchIndex + 1}/${totalBatches} (${batch.length} hospitals)`);
  
  try {
    const batchTexts = batch.map(hospital => prepareHospitalEmbeddingText(hospital));
    
    const openai = createOpenAIClient();
    const response = await openai.embeddings.create({
      model,
      input: batchTexts,
      dimensions,
      encoding_format: modelConfig.encodingFormat,
      user: userId,
    });

    const batchGenerationTime = Date.now() - batchStartTime;
    const batchTokens = response.usage?.total_tokens || 0;
    const actualCost = estimateEmbeddingCost(batchTokens, model);

    // Process results with enhanced metadata
    for (let j = 0; j < batch.length; j++) {
      const hospital = batch[j];
      const embeddingData = response.data[j];
      
      if (embeddingData?.embedding) {
        let usageLogId: string | undefined;
        
        if (trackUsage && (hospital as any).id) {
          try {
            usageLogId = await logEmbeddingUsage({
              hospitalId: (hospital as any).id,
              model: response.model,
              dimensions: embeddingData.embedding.length,
              encodingFormat: modelConfig.encodingFormat,
              promptTokens: Math.round((response.usage?.prompt_tokens || 0) / batch.length),
              totalTokens: Math.round(batchTokens / batch.length),
              estimatedCost: actualCost / batch.length,
              generationTimeMs: Math.round(batchGenerationTime / batch.length),
              cacheHit: false,
              userId,
              metadata: {
                hospital_name: hospital.name,
                batch_info: { batch_index: batchIndex, item_index: j },
                performance_optimization: 'batch_optimized_v2'
              }
            });
          } catch (logError) {
            console.warn(`⚠️ Usage logging failed for ${hospital.name}:`, logError);
          }
        }
        
        const result: BatchResult = {
          embedding: embeddingData.embedding,
          metadata: {
            model: response.model,
            dimensions: embeddingData.embedding.length,
            generated_at: new Date().toISOString(),
            text_length: batchTexts[j].length,
            usage: {
              prompt_tokens: Math.round((response.usage?.prompt_tokens || 0) / batch.length),
              total_tokens: Math.round(batchTokens / batch.length),
              estimated_cost: actualCost / batch.length,
            },
            encoding_format: modelConfig.encodingFormat,
            model_version: `${model}-optimized-v1.1`,
            performance_metrics: {
              generation_time_ms: Math.round(batchGenerationTime / batch.length),
              tokens_per_second: batchTokens > 0 ? (batchTokens / (batchGenerationTime / 1000)) : 0,
              batch_optimization: true
            },
            hospital_fields_included: getIncludedHospitalFields(hospital),
            text_structure: analyzeTextStructure(batchTexts[j]),
          },
          hospital_id: (hospital as any).id,
          usageLogId,
        };
        
        results.push(result);
        
        // Enhanced caching with performance metadata
        const cacheKey = batchTexts[j].toLowerCase();
        embeddingCache.set(cacheKey, {
          embedding: embeddingData.embedding,
          timestamp: Date.now(),
          metadata: {
            model: response.model,
            dimensions: embeddingData.embedding.length,
            encoding_format: modelConfig.encodingFormat,
            usage: result.metadata.usage,
            performance_metrics: result.metadata.performance_metrics
          },
        });
      }
    }

    console.log(`✅ Optimized batch ${batchIndex + 1} completed: ${results.length} embeddings, ${batchTokens} tokens, ~$${actualCost.toFixed(6)} (${batchGenerationTime}ms)`);
    
    return { results, batchCost: actualCost, batchTokens };
    
  } catch (error: any) {
    console.error(`❌ Optimized batch ${batchIndex + 1} failed:`, error.message);
    throw error; // Let the caller handle fallback
  }
}

// Convert cached hospital to result format
function convertCachedToResult(hospital: HospitalData): BatchResult {
  const embeddingText = prepareHospitalEmbeddingText(hospital);
  const cacheKey = embeddingText.toLowerCase();
  const cached = embeddingCache.get(cacheKey)!;
  
  return {
    embedding: cached.embedding,
    metadata: {
      ...cached.metadata,
      cache_hit: true,
      generated_at: new Date(cached.timestamp).toISOString(),
      text_length: embeddingText.length,
      hospital_fields_included: getIncludedHospitalFields(hospital),
      text_structure: analyzeTextStructure(embeddingText),
    },
    hospital_id: (hospital as any).id,
  };
}

