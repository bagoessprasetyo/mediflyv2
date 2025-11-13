/**
 * Google Gemini Embedding Service
 * Modern embedding generation using Google's Gemini text-embedding-004 model
 */

import { GoogleGenAI } from '@google/genai';

// Gemini embedding configuration
export interface GeminiEmbeddingConfig {
  model: string;
  dimensions: number;
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' | 'SEMANTIC_SIMILARITY' | 'CLASSIFICATION' | 'CLUSTERING';
  outputFormat: 'float';
  maxInputTokens: number;
  costPerToken: number; // Estimated cost (Gemini is free/very low cost)
  description: string;
}

// Modern Gemini embedding models
const GEMINI_EMBEDDING_MODELS: Record<string, GeminiEmbeddingConfig> = {
  'text-embedding-004': {
    model: 'text-embedding-004',
    dimensions: 768, // Default dimension, configurable
    taskType: 'RETRIEVAL_DOCUMENT',
    outputFormat: 'float',
    maxInputTokens: 2048,
    costPerToken: 0.0, // Gemini embeddings are free in many tiers
    description: 'Latest Gemini embedding model - high quality and free'
  }
};

// Embedding generation options
export interface GeminiEmbeddingOptions {
  model?: string;
  dimensions?: number;
  taskType?: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' | 'SEMANTIC_SIMILARITY' | 'CLASSIFICATION' | 'CLUSTERING';
  title?: string;
}

// Enhanced embedding response
export interface GeminiEmbeddingResponse {
  embedding: number[];
  metadata: {
    model: string;
    dimensions: number;
    taskType: string;
    generated_at: string;
    usage: {
      input_tokens: number;
      total_tokens: number;
      estimated_cost: number;
    };
    text_length: number;
    model_version: string;
    performance_metrics: {
      generation_time_ms: number;
      tokens_per_second?: number;
    };
    provider: 'gemini';
  };
}

// Gemini embedding configuration
const GEMINI_CONFIG = {
  defaultModel: 'text-embedding-004',
  defaultDimensions: 1536, // Match database schema (768 is Gemini native but we need compatibility)
  supportedDimensions: [64, 128, 256, 512, 768, 1536], // Gemini supports flexible dimensions
  maxRetries: 3,
  initialRetryDelay: 1000,
  maxTextLength: 30000, // Gemini has higher limits than OpenAI
  enableCostTracking: true,
  enablePerformanceMetrics: true,
  rateLimitDelay: 100, // Very generous rate limits
};

// Cache for embeddings (same pattern as OpenAI service)
interface GeminiCacheEntry {
  embedding: number[];
  timestamp: number;
  metadata: {
    model: string;
    dimensions: number;
    taskType: string;
    usage: {
      input_tokens: number;
      total_tokens: number;
      estimated_cost: number;
    };
    performance_metrics: {
      generation_time_ms: number;
    };
  };
}

const geminiEmbeddingCache = new Map<string, GeminiCacheEntry>();

// Utility functions
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanupGeminiCache(): void {
  const now = Date.now();
  const ttl = 1000 * 60 * 60; // 1 hour cache
  let cleanedCount = 0;
  
  for (const [key, value] of geminiEmbeddingCache.entries()) {
    if (now - value.timestamp > ttl) {
      geminiEmbeddingCache.delete(key);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired Gemini cache entries`);
  }
}

// Create Gemini client with proper configuration
function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.');
  }
  
  console.log('🔧 Gemini Client Configuration:', {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? `${apiKey.slice(0, 7)}...` : 'none',
    model: GEMINI_CONFIG.defaultModel
  });
  
  return new GoogleGenAI({ apiKey });
}

// Validate dimensions for Gemini models
function validateGeminiDimensions(dimensions?: number): number {
  const defaultDim = GEMINI_CONFIG.defaultDimensions;
  
  if (!dimensions) {
    return defaultDim;
  }
  
  if (!GEMINI_CONFIG.supportedDimensions.includes(dimensions)) {
    console.warn(`⚠️ Dimension ${dimensions} not in supported list, using default ${defaultDim}`);
    return defaultDim;
  }
  
  return dimensions;
}

// Test Gemini API connectivity
export async function testGeminiConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log('🔍 Testing Gemini API connection...');
    
    const client = createGeminiClient();
    
    // Test with a minimal embedding request
    const testResponse = await client.models.embedContent({
      model: 'text-embedding-004',
      contents: 'test connection',
      config: {
        outputDimensionality: 512,
        taskType: 'SEMANTIC_SIMILARITY'
      }
    });
    
    console.log('✅ Gemini API connection successful!');
    
    return {
      success: true,
      details: {
        model: 'text-embedding-004',
        embedding_length: testResponse.embeddings?.[0]?.values?.length || 0,
        dimensions_requested: 512,
        dimensions_returned: testResponse.embeddings?.[0]?.values?.length || 0
      }
    };
    
  } catch (error: any) {
    console.error('❌ Gemini API connection failed:', error.message);
    
    return {
      success: false,
      error: error.message,
      details: {
        status: error.status || 'unknown',
        type: error.constructor.name
      }
    };
  }
}

// Validate Gemini credentials
export function validateGeminiCredentials(): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    issues.push('Missing GEMINI_API_KEY environment variable');
    recommendations.push('Get a free API key from https://aistudio.google.com/app/apikey');
    recommendations.push('Set GEMINI_API_KEY in your environment variables');
  } else if (apiKey === 'your-gemini-api-key-here') {
    issues.push('GEMINI_API_KEY is set to placeholder value');
    recommendations.push('Replace with your actual Gemini API key');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

// Core embedding generation function
export async function generateGeminiEmbedding(
  text: string,
  options: GeminiEmbeddingOptions = {}
): Promise<GeminiEmbeddingResponse> {
  const startTime = Date.now();
  
  // Validate inputs
  if (!text || typeof text !== 'string') {
    throw new Error('Text input is required and must be a string');
  }
  
  if (text.length > GEMINI_CONFIG.maxTextLength) {
    throw new Error(`Text length (${text.length}) exceeds maximum allowed length (${GEMINI_CONFIG.maxTextLength})`);
  }
  
  // Configure request
  const model = options.model || GEMINI_CONFIG.defaultModel;
  const dimensions = validateGeminiDimensions(options.dimensions);
  const taskType = options.taskType || 'RETRIEVAL_DOCUMENT';
  const modelConfig = GEMINI_EMBEDDING_MODELS[model];
  
  if (!modelConfig) {
    throw new Error(`Unsupported Gemini model: ${model}`);
  }
  
  // Check cache first
  const cacheKey = `gemini:${model}:${dimensions}:${taskType}:${text}`;
  const cached = geminiEmbeddingCache.get(cacheKey);
  
  if (cached) {
    console.log('🎯 Cache hit for Gemini embedding');
    return {
      embedding: cached.embedding,
      metadata: {
        ...cached.metadata,
        generated_at: new Date().toISOString(),
        performance_metrics: {
          generation_time_ms: Date.now() - startTime,
          tokens_per_second: 0 // Cache hit, no actual generation
        },
        provider: 'gemini',
        text_length: text.length,
        model_version: model
      }
    };
  }
  
  const gemini = createGeminiClient();
  
  console.log(`🔍 Generating Gemini embedding using ${model} (${dimensions}D) for: "${text.substring(0, 100)}..."`);
  
  // Retry logic with exponential backoff
  let lastError: any;
  for (let attempt = 1; attempt <= GEMINI_CONFIG.maxRetries; attempt++) {
    const attemptStartTime = Date.now();
    
    try {
      console.log('📡 Making Gemini API request:', {
        model,
        dimensions,
        taskType,
        textLength: text.length,
        attempt
      });
      
      const response = await gemini.models.embedContent({
        model,
        contents: text,
        config: {
          outputDimensionality: dimensions,
          taskType,
          title: options.title
        }
      });
      
      const generationTime = Date.now() - attemptStartTime;
      let embedding = response.embeddings?.[0]?.values || [];
      
      if (!embedding.length) {
        throw new Error('Empty embedding vector returned from Gemini API');
      }

      // Handle dimension compatibility with database schema
      if (dimensions && dimensions !== embedding.length) {
        if (dimensions === 1536 && embedding.length === 768) {
          // Pad Gemini 768 -> 1536 by duplicating vectors
          const paddedEmbedding = [...embedding, ...embedding];
          embedding = paddedEmbedding;
          console.log(`🔧 Padded Gemini embedding from 768 to 1536 dimensions`);
        } else if (dimensions < embedding.length) {
          // Truncate if needed
          embedding = embedding.slice(0, dimensions);
          console.log(`🔧 Truncated embedding to ${dimensions} dimensions`);
        }
      }
      
      // Estimate usage (Gemini doesn't provide detailed token usage)
      const estimatedTokens = Math.ceil(text.length / 4); // Rough estimate
      
      const embeddingResponse: GeminiEmbeddingResponse = {
        embedding,
        metadata: {
          model,
          dimensions: embedding.length,
          taskType,
          generated_at: new Date().toISOString(),
          usage: {
            input_tokens: estimatedTokens,
            total_tokens: estimatedTokens,
            estimated_cost: estimatedTokens * modelConfig.costPerToken
          },
          text_length: text.length,
          model_version: model,
          performance_metrics: {
            generation_time_ms: generationTime,
            tokens_per_second: estimatedTokens / (generationTime / 1000)
          },
          provider: 'gemini'
        }
      };
      
      // Cache the result
      geminiEmbeddingCache.set(cacheKey, {
        embedding,
        timestamp: Date.now(),
        metadata: {
          model,
          dimensions: embedding.length,
          taskType,
          usage: embeddingResponse.metadata.usage,
          performance_metrics: {
            generation_time_ms: generationTime
          }
        }
      });
      
      console.log(`✅ Gemini embedding generated successfully in ${generationTime}ms`);
      console.log(`📊 Vector dimensions: ${embedding.length}, tokens: ${estimatedTokens}, cost: $${embeddingResponse.metadata.usage.estimated_cost.toFixed(6)}`);
      
      // Cleanup cache periodically
      if (Math.random() < 0.1) {
        cleanupGeminiCache();
      }
      
      return embeddingResponse;
      
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Gemini API request failed (attempt ${attempt}/${GEMINI_CONFIG.maxRetries}):`, error.message);
      
      if (attempt < GEMINI_CONFIG.maxRetries) {
        const retryDelay = GEMINI_CONFIG.initialRetryDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        await delay(retryDelay);
      }
    }
  }
  
  throw new Error(`Failed to generate Gemini embedding after ${GEMINI_CONFIG.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Export configuration for external use
export { GEMINI_CONFIG, GEMINI_EMBEDDING_MODELS };