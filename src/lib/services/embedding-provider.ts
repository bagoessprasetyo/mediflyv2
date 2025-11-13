/**
 * Unified Embedding Provider Interface
 * Supports multiple embedding providers (OpenAI, Gemini) with seamless switching
 */

import { 
  generateEmbeddingWithMetadata as generateOpenAIEmbedding,
  generateBatchHospitalEmbeddings as generateOpenAIBatchEmbeddings,
  type EmbeddingResult as OpenAIEmbeddingResponse
} from './embedding-server';

import { 
  generateGeminiEmbedding,
  GeminiEmbeddingResponse,
  validateGeminiCredentials,
  testGeminiConnection
} from './embedding-gemini';

import { 
  generateHospitalGeminiBatchEmbeddings
} from './embedding-batch-gemini';

import { 
  validateOpenAICredentials,
  testOpenAIConnection
} from './embedding-server';

// Supported embedding providers
export type EmbeddingProvider = 'openai' | 'gemini';

// Unified embedding configuration
export interface UnifiedEmbeddingConfig {
  provider?: EmbeddingProvider;
  model?: string;
  dimensions?: number;
  fallbackProvider?: EmbeddingProvider;
  enableFallback?: boolean;
}

// Unified embedding response (normalized across providers)
export interface UnifiedEmbeddingResponse {
  embedding: number[];
  metadata: {
    provider: EmbeddingProvider;
    model: string;
    dimensions: number;
    generated_at: string;
    usage: {
      input_tokens: number;
      total_tokens: number;
      estimated_cost: number;
    };
    text_length: number;
    performance_metrics: {
      generation_time_ms: number;
      tokens_per_second?: number;
    };
    original_response: OpenAIEmbeddingResponse | GeminiEmbeddingResponse;
  };
}

// Unified batch result
export interface UnifiedBatchResult {
  embeddings: (UnifiedEmbeddingResponse | null)[];
  successful: number;
  failed: number;
  totalTime: number;
  averageTime: number;
  errors: Array<{ index: number; text: string; error: string; }>;
  metadata: {
    provider: EmbeddingProvider;
    fallbackUsed?: boolean;
    batchSize: number;
    totalTexts: number;
    model: string;
    dimensions: number;
    totalCost: number;
    totalTokens: number;
  };
}

// Provider configuration
const PROVIDER_CONFIG = {
  defaultProvider: (process.env.EMBEDDING_PROVIDER as EmbeddingProvider) || 'gemini',
  enableFallback: true,
  fallbackOrder: ['gemini', 'openai'] as EmbeddingProvider[],
  models: {
    openai: {
      default: 'text-embedding-3-small',
      dimensions: 1536
    },
    gemini: {
      default: 'text-embedding-004',
      dimensions: 1536  // Use 1536 to match existing database schema
    }
  }
};

/**
 * Get the configured embedding provider with fallback logic
 */
export function getEmbeddingProvider(): EmbeddingProvider {
  const configured = process.env.EMBEDDING_PROVIDER as EmbeddingProvider;
  
  if (configured && ['openai', 'gemini'].includes(configured)) {
    return configured;
  }
  
  console.warn(`⚠️ Invalid EMBEDDING_PROVIDER "${configured}", using default: ${PROVIDER_CONFIG.defaultProvider}`);
  return PROVIDER_CONFIG.defaultProvider;
}

/**
 * Validate credentials for all available providers
 */
export function validateAllProviders(): {
  openai: ReturnType<typeof validateOpenAICredentials>;
  gemini: ReturnType<typeof validateGeminiCredentials>;
  recommended: EmbeddingProvider;
} {
  const openaiValidation = validateOpenAICredentials();
  const geminiValidation = validateGeminiCredentials();
  
  // Recommend based on availability and current issues
  let recommended: EmbeddingProvider = PROVIDER_CONFIG.defaultProvider;
  
  if (geminiValidation.isValid && !openaiValidation.isValid) {
    recommended = 'gemini';
  } else if (openaiValidation.isValid && !geminiValidation.isValid) {
    recommended = 'openai';
  } else if (geminiValidation.isValid && openaiValidation.isValid) {
    // Both valid, prefer Gemini (free tier)
    recommended = 'gemini';
  }
  
  return {
    openai: openaiValidation,
    gemini: geminiValidation,
    recommended
  };
}

/**
 * Test connectivity for all providers
 */
export async function testAllProviders(): Promise<{
  openai: Awaited<ReturnType<typeof testOpenAIConnection>>;
  gemini: Awaited<ReturnType<typeof testGeminiConnection>>;
  working: EmbeddingProvider[];
}> {
  console.log('🔍 Testing all embedding providers...');
  
  const [openaiResult, geminiResult] = await Promise.all([
    testOpenAIConnection().catch(error => ({ success: false, error: error.message })),
    testGeminiConnection().catch(error => ({ success: false, error: error.message }))
  ]);
  
  const working: EmbeddingProvider[] = [];
  if (openaiResult.success) working.push('openai');
  if (geminiResult.success) working.push('gemini');
  
  console.log(`✅ Working providers: ${working.length > 0 ? working.join(', ') : 'none'}`);
  
  return {
    openai: openaiResult,
    gemini: geminiResult,
    working
  };
}

/**
 * Generate a single embedding with provider selection and fallback
 */
export async function generateUnifiedEmbedding(
  text: string,
  config: UnifiedEmbeddingConfig = {}
): Promise<UnifiedEmbeddingResponse> {
  const startTime = Date.now();
  const provider = config.provider || getEmbeddingProvider();
  const enableFallback = config.enableFallback !== false;
  
  console.log(`🔍 Generating embedding with provider: ${provider}`);
  
  try {
    return await generateWithProvider(provider, text, config);
  } catch (error: any) {
    console.error(`❌ Primary provider ${provider} failed:`, error.message);
    
    if (enableFallback && config.fallbackProvider) {
      console.log(`🔄 Attempting fallback to ${config.fallbackProvider}...`);
      
      try {
        const fallbackResult = await generateWithProvider(config.fallbackProvider, text, config);
        console.log(`✅ Fallback provider ${config.fallbackProvider} succeeded`);
        return fallbackResult;
      } catch (fallbackError: any) {
        console.error(`❌ Fallback provider ${config.fallbackProvider} also failed:`, fallbackError.message);
        throw new Error(`Both ${provider} and ${config.fallbackProvider} failed. Primary: ${error.message}, Fallback: ${fallbackError.message}`);
      }
    }
    
    throw error;
  }
}

/**
 * Generate embedding with specific provider
 */
async function generateWithProvider(
  provider: EmbeddingProvider,
  text: string,
  config: UnifiedEmbeddingConfig
): Promise<UnifiedEmbeddingResponse> {
  const startTime = Date.now();
  
  switch (provider) {
    case 'gemini':
      const geminiResponse = await generateGeminiEmbedding(text, {
        model: config.model,
        dimensions: config.dimensions,
        taskType: 'RETRIEVAL_DOCUMENT'
      });
      
      return {
        embedding: geminiResponse.embedding,
        metadata: {
          provider: 'gemini',
          model: geminiResponse.metadata.model,
          dimensions: geminiResponse.metadata.dimensions,
          generated_at: geminiResponse.metadata.generated_at,
          usage: geminiResponse.metadata.usage,
          text_length: geminiResponse.metadata.text_length,
          performance_metrics: geminiResponse.metadata.performance_metrics,
          original_response: geminiResponse
        }
      };
      
    case 'openai':
      const openaiResponse = await generateOpenAIEmbedding(text, {
        model: config.model as any,
        dimensions: config.dimensions
      });
      
      return {
        embedding: openaiResponse.embedding,
        metadata: {
          provider: 'openai',
          model: openaiResponse.metadata.model,
          dimensions: openaiResponse.metadata.dimensions,
          generated_at: openaiResponse.metadata.generated_at,
          usage: {
            input_tokens: openaiResponse.metadata.usage.prompt_tokens,
            total_tokens: openaiResponse.metadata.usage.total_tokens,
            estimated_cost: openaiResponse.metadata.usage.estimated_cost || 0
          },
          text_length: openaiResponse.metadata.text_length,
          performance_metrics: openaiResponse.metadata.performance_metrics || {
            generation_time_ms: Date.now() - startTime
          },
          original_response: openaiResponse
        }
      };
      
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Hospital-specific batch embedding with provider selection
 */
export interface Hospital {
  id: string;
  name: string;
  description?: string;
  specialties?: string[];
  location?: string;
  [key: string]: any;
}

export async function generateUnifiedHospitalBatchEmbeddings(
  hospitals: Hospital[],
  config: UnifiedEmbeddingConfig = {}
): Promise<UnifiedBatchResult> {
  const provider = config.provider || getEmbeddingProvider();
  const enableFallback = config.enableFallback !== false;
  
  console.log(`🏥 Generating batch hospital embeddings with provider: ${provider}`);
  
  try {
    return await generateBatchWithProvider(provider, hospitals, config);
  } catch (error: any) {
    console.error(`❌ Batch processing with ${provider} failed:`, error.message);
    
    if (enableFallback && config.fallbackProvider) {
      console.log(`🔄 Attempting batch fallback to ${config.fallbackProvider}...`);
      
      try {
        const fallbackResult = await generateBatchWithProvider(config.fallbackProvider, hospitals, config);
        fallbackResult.metadata.fallbackUsed = true;
        console.log(`✅ Batch fallback to ${config.fallbackProvider} succeeded`);
        return fallbackResult;
      } catch (fallbackError: any) {
        console.error(`❌ Batch fallback to ${config.fallbackProvider} also failed:`, fallbackError.message);
        throw new Error(`Batch processing failed with both providers. Primary: ${error.message}, Fallback: ${fallbackError.message}`);
      }
    }
    
    throw error;
  }
}

/**
 * Generate batch embeddings with specific provider
 */
async function generateBatchWithProvider(
  provider: EmbeddingProvider,
  hospitals: Hospital[],
  config: UnifiedEmbeddingConfig
): Promise<UnifiedBatchResult> {
  switch (provider) {
    case 'gemini':
      const geminiResult = await generateHospitalGeminiBatchEmbeddings(hospitals, {
        model: config.model,
        dimensions: config.dimensions,
        batchSize: 50, // Gemini can handle larger batches
        maxConcurrency: 5
      });
      
      return {
        embeddings: geminiResult.embeddings?.map(emb => emb ? {
          embedding: emb.embedding,
          metadata: {
            provider: 'gemini' as const,
            model: emb.metadata.model,
            dimensions: emb.metadata.dimensions,
            generated_at: emb.metadata.generated_at,
            usage: emb.metadata.usage,
            text_length: emb.metadata.text_length,
            performance_metrics: emb.metadata.performance_metrics,
            original_response: emb
          }
        } : null) || [],
        successful: geminiResult.successful,
        failed: geminiResult.failed,
        totalTime: geminiResult.totalTime,
        averageTime: geminiResult.averageTime,
        errors: geminiResult.errors,
        metadata: {
          provider: 'gemini',
          batchSize: geminiResult.metadata.batchSize,
          totalTexts: geminiResult.metadata.totalTexts,
          model: geminiResult.metadata.model,
          dimensions: geminiResult.metadata.dimensions,
          totalCost: geminiResult.metadata.totalCost,
          totalTokens: geminiResult.metadata.totalTokens
        }
      };
      
    case 'openai':
      // Use existing OpenAI batch function (we'll need to adapt this)
      const openaiResults = await generateOpenAIBatchEmbeddings(hospitals, 20);
      
      // Convert OpenAI batch results to unified format
      return {
        embeddings: openaiResults.map((result, index) => result ? {
          embedding: result.embedding,
          metadata: {
            provider: 'openai' as const,
            model: result.metadata.model,
            dimensions: result.metadata.dimensions,
            generated_at: result.metadata.generated_at,
            usage: result.metadata.usage,
            text_length: result.metadata.text_length,
            performance_metrics: result.metadata.performance_metrics || { generation_time_ms: 0 },
            original_response: result
          }
        } : null),
        successful: openaiResults.filter(r => r !== null).length,
        failed: openaiResults.filter(r => r === null).length,
        totalTime: 0, // Would need to track this in OpenAI function
        averageTime: 0,
        errors: [],
        metadata: {
          provider: 'openai',
          batchSize: 20,
          totalTexts: hospitals.length,
          model: config.model || PROVIDER_CONFIG.models.openai.default,
          dimensions: config.dimensions || PROVIDER_CONFIG.models.openai.dimensions,
          totalCost: openaiResults.reduce((sum, r) => sum + (r?.metadata.usage.estimated_cost || 0), 0),
          totalTokens: openaiResults.reduce((sum, r) => sum + (r?.metadata.usage.total_tokens || 0), 0)
        }
      };
      
    default:
      throw new Error(`Unsupported provider for batch processing: ${provider}`);
  }
}

/**
 * Get provider-specific model configuration
 */
export function getProviderConfig(provider: EmbeddingProvider) {
  return {
    provider,
    defaultModel: PROVIDER_CONFIG.models[provider].default,
    defaultDimensions: PROVIDER_CONFIG.models[provider].dimensions,
    isConfigured: provider === 'openai' ? 
      !!process.env.OPENAI_API_KEY : 
      !!process.env.GEMINI_API_KEY
  };
}

/**
 * Smart provider selection based on availability and requirements
 */
export async function selectBestProvider(): Promise<{
  provider: EmbeddingProvider;
  reason: string;
  alternatives: EmbeddingProvider[];
}> {
  const validation = validateAllProviders();
  const connectivity = await testAllProviders();
  
  // Priority: Working > Configured > Default
  if (connectivity.working.includes('gemini')) {
    return {
      provider: 'gemini',
      reason: 'Gemini is working and offers free tier',
      alternatives: connectivity.working.filter(p => p !== 'gemini')
    };
  }
  
  if (connectivity.working.includes('openai')) {
    return {
      provider: 'openai',
      reason: 'OpenAI is working (Gemini unavailable)',
      alternatives: connectivity.working.filter(p => p !== 'openai')
    };
  }
  
  // No providers working, return configured one
  const configuredProvider = getEmbeddingProvider();
  return {
    provider: configuredProvider,
    reason: `No providers responding, using configured: ${configuredProvider}`,
    alternatives: []
  };
}

// Export provider configuration
export { PROVIDER_CONFIG };