'use client';

import OpenAI from 'openai';

// Types for embedding operations
export interface EmbeddingRequest {
  text: string;
  model?: 'text-embedding-3-small' | 'text-embedding-3-large';
  dimensions?: number;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  model: string;
  dimensions: number;
}

export interface BatchEmbeddingRequest {
  texts: string[];
  model?: 'text-embedding-3-small' | 'text-embedding-3-large';
  dimensions?: number;
  batchSize?: number;
}

export interface BatchEmbeddingResponse {
  embeddings: number[][];
  totalUsage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  model: string;
  dimensions: number;
  processedCount: number;
}

// Modern embedding configuration aligned with server implementation
const EMBEDDING_CONFIG = {
  models: {
    small: 'text-embedding-3-small' as const,
    large: 'text-embedding-3-large' as const,
  },
  dimensions: {
    small: 1536,
    large: 3072,
  },
  supportedDimensions: {
    'text-embedding-3-small': [512, 1024, 1536],
    'text-embedding-3-large': [256, 1024, 3072]
  },
  defaultModel: 'text-embedding-3-small' as const,
  defaultDimensions: 1536,
  maxTokensPerRequest: 8191, // Updated to match OpenAI's actual limit
  maxBatchSize: 100,
  rateLimitDelay: 1000,
  costPerToken: {
    'text-embedding-3-small': 0.00000002, // $0.02 per 1M tokens
    'text-embedding-3-large': 0.00000013, // $0.13 per 1M tokens
  },
  enableModernFeatures: true, // Flag to enable new OpenAI features
};

// Enhanced OpenAI client with modern configuration and project ID support
function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID || process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID;
  const organizationId = process.env.OPENAI_ORG_ID || process.env.NEXT_PUBLIC_OPENAI_ORG_ID;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
  }
  
  // Log configuration for debugging (client-side)
  console.log('🔧 OpenAI Client Configuration (Client-side):', {
    hasApiKey: !!apiKey,
    hasProjectId: !!projectId,
    hasOrgId: !!organizationId,
    apiKeyPrefix: apiKey ? `${apiKey.slice(0, 7)}...` : 'none'
  });
  
  const clientConfig: any = {
    apiKey,
    dangerouslyAllowBrowser: true, // Only for client-side usage
    timeout: 30000, // 30 second timeout
    maxRetries: 0, // Handle retries manually
    defaultHeaders: {
      'User-Agent': 'MediFly-Client-Embedding-Service/1.1'
    }
  };
  
  // Add project ID if provided
  if (projectId) {
    clientConfig.project = projectId;
    console.log('✅ Using OpenAI Project ID (Client):', projectId);
  } else {
    console.warn('⚠️ No OPENAI_PROJECT_ID set for client. This may cause quota issues.');
  }
  
  // Add organization ID if provided
  if (organizationId) {
    clientConfig.organization = organizationId;
    console.log('✅ Using OpenAI Organization ID (Client):', organizationId);
  }

  return new OpenAI(clientConfig);
}

// Utility function to validate dimensions
function validateDimensions(model: string, dimensions?: number): number {
  const supportedDims = EMBEDDING_CONFIG.supportedDimensions[model as keyof typeof EMBEDDING_CONFIG.supportedDimensions];
  const defaultDim = model === 'text-embedding-3-large' ? 3072 : 1536;
  
  if (!dimensions) {
    return defaultDim;
  }
  
  if (supportedDims && !supportedDims.includes(dimensions)) {
    console.warn(`⚠️ Dimension ${dimensions} not supported for ${model}. Using default ${defaultDim}`);
    return defaultDim;
  }
  
  return dimensions;
}

// Utility function to estimate costs
function estimateCost(tokenCount: number, model: string): number {
  const costPerToken = EMBEDDING_CONFIG.costPerToken[model as keyof typeof EMBEDDING_CONFIG.costPerToken];
  return costPerToken ? tokenCount * costPerToken : 0;
}

// Utility functions
function validateText(text: string): void {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }
  
  if (text.length === 0) {
    throw new Error('Text cannot be empty');
  }
  
  // Rough token estimation (1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(text.length / 4);
  if (estimatedTokens > EMBEDDING_CONFIG.maxTokensPerRequest) {
    throw new Error(`Text is too long. Estimated ${estimatedTokens} tokens, max ${EMBEDDING_CONFIG.maxTokensPerRequest}`);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main embedding service
export class EmbeddingService {
  private openai: OpenAI;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor() {
    this.openai = createOpenAIClient();
  }

  // Rate limiting helper
  private async enforceRateLimit(): Promise<void> {
    this.requestCount++;
    const now = Date.now();
    
    if (this.lastRequestTime > 0) {
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < EMBEDDING_CONFIG.rateLimitDelay) {
        await delay(EMBEDDING_CONFIG.rateLimitDelay - timeSinceLastRequest);
      }
    }
    
    this.lastRequestTime = Date.now();
  }

  // Enhanced embedding generation with modern features
  async generateEmbedding({
    text,
    model = EMBEDDING_CONFIG.defaultModel,
    dimensions = EMBEDDING_CONFIG.defaultDimensions,
  }: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      validateText(text);
      await this.enforceRateLimit();

      // Validate credentials before proceeding
      const validation = validateClientCredentials();
      if (!validation.isValid) {
        console.error('❌ Invalid OpenAI credentials:', validation.issues);
        throw new Error(`OpenAI configuration error: ${validation.issues.join(', ')}`);
      }

      // Validate and adjust dimensions if necessary
      const validatedDimensions = validateDimensions(model, dimensions);
      
      console.log(`🔍 Generating embedding for text: "${text.substring(0, 100)}..." using ${model} (${validatedDimensions}D)`);

      const startTime = Date.now();
      const response = await this.openai.embeddings.create({
        model,
        input: text,
        dimensions: validatedDimensions,
        encoding_format: 'float', // Modern encoding format
      });
      
      const generationTime = Date.now() - startTime;

      const embedding = response.data[0]?.embedding;
      if (!embedding) {
        throw new Error('No embedding returned from OpenAI API');
      }

      const totalTokens = response.usage?.total_tokens || 0;
      const estimatedCost = estimateCost(totalTokens, model);

      console.log(`✅ Generated embedding with ${embedding.length} dimensions, ${totalTokens} tokens, ~$${estimatedCost.toFixed(6)} cost (${generationTime}ms)`);

      return {
        embedding,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          total_tokens: totalTokens,
        },
        model: response.model,
        dimensions: embedding.length,
      };
    } catch (error: any) {
      console.error('Error generating embedding:', error);
      
      // Modern OpenAI SDK error handling
      if (error instanceof OpenAI.APIError) {
        if (error.status === 429) {
          if (error.type === 'rate_limit_exceeded') {
            throw new Error('Rate limit exceeded. Please wait and try again.');
          } else if (error.type === 'insufficient_quota') {
            throw new Error('OpenAI quota exceeded. Please check your billing.');
          }
        }
        
        if (error.status === 401) {
          throw new Error('Invalid OpenAI API key.');
        }
        
        if (error.status === 400) {
          throw new Error(`Invalid request: ${error.message}`);
        }
        
        if (error.status >= 500) {
          throw new Error(`OpenAI server error: ${error.message}`);
        }
      }
      
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  // Generate embeddings in batches
  async generateBatchEmbeddings({
    texts,
    model = EMBEDDING_CONFIG.defaultModel,
    dimensions = EMBEDDING_CONFIG.defaultDimensions,
    batchSize = EMBEDDING_CONFIG.maxBatchSize,
  }: BatchEmbeddingRequest): Promise<BatchEmbeddingResponse> {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Texts must be a non-empty array');
    }

    // Validate all texts
    texts.forEach((text, index) => {
      try {
        validateText(text);
      } catch (error) {
        throw new Error(`Invalid text at index ${index}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    console.log(`🚀 Starting batch embedding generation for ${texts.length} texts`);

    const allEmbeddings: number[][] = [];
    let totalUsage = { prompt_tokens: 0, total_tokens: 0 };
    let processedCount = 0;

    // Process in smaller batches to respect OpenAI limits
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      try {
        await this.enforceRateLimit();

        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)} (${batch.length} items)`);

        const response = await this.openai.embeddings.create({
          model,
          input: batch,
          dimensions,
        });

        const batchEmbeddings = response.data.map(item => item.embedding);
        allEmbeddings.push(...batchEmbeddings);

        totalUsage.prompt_tokens += response.usage?.prompt_tokens || 0;
        totalUsage.total_tokens += response.usage?.total_tokens || 0;
        processedCount += batch.length;

        console.log(`✅ Batch completed. Processed ${processedCount}/${texts.length} items`);

      } catch (error: any) {
        console.error(`❌ Error processing batch starting at index ${i}:`, error);
        
        // For batch operations, we might want to continue with individual processing
        console.log('🔄 Falling back to individual processing for this batch...');
        
        for (const text of batch) {
          try {
            const individualResult = await this.generateEmbedding({ text, model, dimensions });
            allEmbeddings.push(individualResult.embedding);
            totalUsage.prompt_tokens += individualResult.usage.prompt_tokens;
            totalUsage.total_tokens += individualResult.usage.total_tokens;
            processedCount++;
          } catch (individualError) {
            console.error(`❌ Failed to process individual text: "${text.substring(0, 50)}..."`, individualError);
            // Push a zero vector as placeholder or skip - depending on requirements
            // For now, we'll skip failed embeddings
          }
        }
      }
    }

    console.log(`🎉 Batch embedding generation completed. Processed ${processedCount}/${texts.length} texts`);

    return {
      embeddings: allEmbeddings,
      totalUsage,
      model,
      dimensions,
      processedCount,
    };
  }

  // Enhanced hospital embedding generation
  async generateHospitalEmbedding(hospital: {
    name: string;
    description?: string;
    type?: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
    city?: string;
    state?: string;
    trauma_level?: string;
    emergency_services?: boolean;
  }, options: { model?: string; dimensions?: number } = {}): Promise<EmbeddingResponse> {
    const embeddingText = this.prepareHospitalText(hospital);
    
    return this.generateEmbedding({
      text: embeddingText,
      model: (options.model || EMBEDDING_CONFIG.defaultModel) as 'text-embedding-3-small' | 'text-embedding-3-large',
      dimensions: options.dimensions || EMBEDDING_CONFIG.defaultDimensions,
    });
  }

  // Prepare hospital data for embedding
  private prepareHospitalText(hospital: {
    name: string;
    description?: string;
    type?: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
    city?: string;
    state?: string;
    trauma_level?: string;
    emergency_services?: boolean;
  }): string {
    let text = hospital.name || '';

    if (hospital.description) {
      text += `. ${hospital.description}`;
    }

    if (hospital.type) {
      text += `. Type: ${hospital.type.replace(/_/g, ' ')}`;
    }

    if (hospital.city && hospital.state) {
      text += `. Located in ${hospital.city}, ${hospital.state}`;
    }

    if (hospital.trauma_level) {
      text += `. Trauma Level: ${hospital.trauma_level}`;
    }

    if (hospital.emergency_services) {
      text += '. Provides emergency services';
    }

    return text.trim();
  }

  // Calculate similarity between two embeddings
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    // Cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, Math.min(1, similarity)); // Clamp between 0 and 1
  }

  // Get usage statistics
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      rateLimitDelay: EMBEDDING_CONFIG.rateLimitDelay,
    };
  }
}

// Singleton instance
let embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!embeddingService) {
    embeddingService = new EmbeddingService();
  }
  return embeddingService;
}

// Enhanced helper functions for common operations
export async function generateQueryEmbedding(
  query: string, 
  options: { model?: string; dimensions?: number } = {}
): Promise<number[]> {
  const service = getEmbeddingService();
  const result = await service.generateEmbedding({ 
    text: query,
    model: options.model as any,
    dimensions: options.dimensions
  });
  return result.embedding;
}

export async function generateHospitalEmbedding(
  hospital: {
    name: string;
    description?: string;
    type?: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
    city?: string;
    state?: string;
    trauma_level?: string;
    emergency_services?: boolean;
  },
  options: { model?: string; dimensions?: number; trackCost?: boolean } = {}
): Promise<{ embedding: number[]; metadata: any }> {
  const service = getEmbeddingService();
  const result = await service.generateHospitalEmbedding(hospital);
  
  const estimatedCost = options.trackCost ? 
    estimateCost(result.usage.total_tokens, result.model) : undefined;
  
  return {
    embedding: result.embedding,
    metadata: {
      model: result.model,
      dimensions: result.dimensions,
      usage: result.usage,
      estimated_cost: estimatedCost,
      generated_at: new Date().toISOString(),
      enhanced_features: EMBEDDING_CONFIG.enableModernFeatures,
    },
  };
}

// Enhanced helper functions for modern embedding features
export function getAvailableModels() {
  return Object.values(EMBEDDING_CONFIG.models);
}

export function getSupportedDimensions(model: string): number[] | undefined {
  return EMBEDDING_CONFIG.supportedDimensions[model as keyof typeof EMBEDDING_CONFIG.supportedDimensions];
}

export function estimateEmbeddingCost(tokenCount: number, model: string): number {
  return estimateCost(tokenCount, model);
}

export function getModelInfo(model: string) {
  const isLarge = model.includes('large');
  return {
    model,
    maxDimensions: isLarge ? 3072 : 1536,
    supportedDimensions: getSupportedDimensions(model),
    costPerToken: EMBEDDING_CONFIG.costPerToken[model as keyof typeof EMBEDDING_CONFIG.costPerToken],
    description: isLarge ? 'High-performance model for complex tasks' : 'Balanced model for general use'
  };
}

// Client-side function to validate credentials
export function validateClientCredentials(): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID || process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID;
  
  if (!apiKey) {
    issues.push('Missing OpenAI API key');
    recommendations.push('Set OPENAI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY');
  }
  
  if (!projectId) {
    issues.push('Missing OpenAI Project ID');
    recommendations.push('Set OPENAI_PROJECT_ID or NEXT_PUBLIC_OPENAI_PROJECT_ID');
    recommendations.push('Get your project ID from OpenAI platform settings');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

// Export configuration for external use
export { EMBEDDING_CONFIG };