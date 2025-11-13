import OpenAI from 'openai';

// Enhanced types for hospital data (aligned with current schema)
export interface HospitalData {
  name: string;
  description?: string;
  type?: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
  city?: string;
  state?: string;
  trauma_level?: string;
  emergency_services?: boolean;
  // New schema fields
  bed_count?: number;
  established?: string;
  phone?: string;
  website?: string;
  metadata?: {
    specialties?: string[];
    accreditations?: string[];
    languages?: string[];
    programs?: string[];
    [key: string]: any;
  };
}

// Modern embedding model configuration types
export type EmbeddingModel = 'text-embedding-3-small' | 'text-embedding-3-large';
export type EncodingFormat = 'float' | 'base64';

export interface EmbeddingOptions {
  model?: EmbeddingModel;
  dimensions?: number;
  encodingFormat?: EncodingFormat;
  user?: string; // For tracking usage by user/organization
}

export interface AdvancedEmbeddingConfig {
  model: EmbeddingModel;
  dimensions: number;
  encodingFormat: EncodingFormat;
  maxInputTokens: number;
  recommendedBatchSize: number;
  costPerToken: number; // For cost estimation
  description: string;
}

export interface EmbeddingResult {
  embedding: number[];
  metadata: {
    model: string;
    dimensions: number;
    generated_at: string;
    usage: {
      prompt_tokens: number;
      total_tokens: number;
      estimated_cost?: number;
    };
    text_length: number;
    cache_hit?: boolean;
    encoding_format: EncodingFormat;
    model_version: string;
    performance_metrics?: {
      generation_time_ms: number;
      tokens_per_second?: number;
    };
  };
}

// Enhanced cache with metadata and cost tracking
interface CacheEntry {
  embedding: number[];
  timestamp: number;
  metadata: {
    model: string;
    dimensions: number;
    encoding_format: EncodingFormat;
    usage: {
      prompt_tokens: number;
      total_tokens: number;
      estimated_cost: number;
    };
    performance_metrics: {
      generation_time_ms: number;
    };
  };
}

// Modern embedding model configurations
const EMBEDDING_MODELS: Record<EmbeddingModel, AdvancedEmbeddingConfig> = {
  'text-embedding-3-small': {
    model: 'text-embedding-3-small',
    dimensions: 1536,
    encodingFormat: 'float',
    maxInputTokens: 8191,
    recommendedBatchSize: 100,
    costPerToken: 0.00002 / 1000, // $0.02 per 1M tokens
    description: 'Latest small model - balanced performance and cost'
  },
  'text-embedding-3-large': {
    model: 'text-embedding-3-large',
    dimensions: 3072,
    encodingFormat: 'float',
    maxInputTokens: 8191,
    recommendedBatchSize: 50, // Smaller batches for large embeddings
    costPerToken: 0.00013 / 1000, // $0.13 per 1M tokens
    description: 'Latest large model - highest performance'
  }
};

// Configuration constants with enhanced options
const EMBEDDING_CONFIG = {
  defaultModel: 'text-embedding-3-small' as EmbeddingModel,
  fallbackModel: 'text-embedding-3-small' as EmbeddingModel,
  supportedDimensions: {
    'text-embedding-3-small': [512, 1024, 1536], // Dimension reduction options
    'text-embedding-3-large': [256, 1024, 3072] // Dimension reduction options
  },
  defaultDimensions: {
    'text-embedding-3-small': 1536,
    'text-embedding-3-large': 3072
  },
  cache_ttl: 1000 * 60 * 60, // 1 hour
  max_retries: 3,
  initial_retry_delay: 1000,
  max_text_length: 8000,
  enableCostTracking: true,
  enablePerformanceMetrics: true,
};

// Simple in-memory cache for embeddings
export const embeddingCache = new Map<string, CacheEntry>();

// Exponential backoff retry logic (internal use)
async function delayInternal(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Clean up expired cache entries
function cleanupEmbeddingCache() {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, value] of embeddingCache.entries()) {
    if (now - value.timestamp > EMBEDDING_CONFIG.cache_ttl) {
      embeddingCache.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
  }
}

// Enhanced OpenAI client creation with modern configuration and project ID support
export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID;
  const organizationId = process.env.OPENAI_ORG_ID;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
  }
  
  // Log configuration for debugging (without exposing sensitive data)
  console.log('🔧 OpenAI Client Configuration:', {
    hasApiKey: !!apiKey,
    hasProjectId: !!projectId,
    hasOrgId: !!organizationId,
    apiKeyPrefix: apiKey ? `${apiKey.slice(0, 7)}...` : 'none'
  });
  
  const clientConfig: any = {
    apiKey,
    timeout: 60000, // 60 second timeout for batch operations
    maxRetries: 0, // We handle retries manually for better control
    defaultHeaders: {
      'User-Agent': 'MediFly-Embedding-Service/1.1'
    }
  };
  
  // Handle project ID for different API key types
  if (apiKey.startsWith('sk-proj-')) {
    // Project-scoped API key - project ID is embedded, do not add explicit header
    console.log('✅ Using project-scoped API key (project ID embedded in key)');
    if (projectId) {
      console.warn('⚠️ OPENAI_PROJECT_ID detected with project-scoped key. Ignoring to prevent conflicts.');
    }
    // Do not set clientConfig.project for project-scoped keys
  } else if (projectId) {
    // Regular API key with separate project ID
    clientConfig.project = projectId;
    console.log('✅ Using OpenAI Project ID:', projectId);
  } else {
    console.warn('⚠️ No OPENAI_PROJECT_ID set. This may cause quota issues for newer OpenAI accounts.');
  }
  
  // Add organization ID if provided
  if (organizationId) {
    clientConfig.organization = organizationId;
    console.log('✅ Using OpenAI Organization ID:', organizationId);
  }

  return new OpenAI(clientConfig);
}

// Utility function to get model configuration
export function getModelConfig(model: EmbeddingModel): AdvancedEmbeddingConfig {
  return EMBEDDING_MODELS[model];
}

// Utility function to validate OpenAI credentials
export function validateOpenAICredentials(): { 
  isValid: boolean; 
  issues: string[]; 
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  const apiKey = process.env.OPENAI_API_KEY;
  const projectId = process.env.OPENAI_PROJECT_ID;
  const organizationId = process.env.OPENAI_ORG_ID;
  
  if (!apiKey) {
    issues.push('Missing OPENAI_API_KEY environment variable');
    recommendations.push('Set OPENAI_API_KEY in your environment variables');
  } else if (!apiKey.startsWith('sk-')) {
    issues.push('OPENAI_API_KEY appears to be invalid (should start with sk-)');
    recommendations.push('Verify your OpenAI API key is correct');
  }
  
  // Project ID validation depends on API key type
  if (apiKey && apiKey.startsWith('sk-proj-')) {
    // Project-scoped key - project ID is embedded, external one causes conflicts
    if (projectId) {
      issues.push('OPENAI_PROJECT_ID set with project-scoped key (may cause conflicts)');
      recommendations.push('Remove OPENAI_PROJECT_ID when using project-scoped API key (sk-proj-)');
    }
  } else if (!projectId) {
    // Regular key - project ID is recommended for newer accounts
    issues.push('Missing OPENAI_PROJECT_ID environment variable');
    recommendations.push('Set OPENAI_PROJECT_ID for newer OpenAI accounts to avoid quota issues');
    recommendations.push('Get your project ID from https://platform.openai.com/settings/organization/projects');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}

// Utility function to test OpenAI API connectivity
export async function testOpenAIConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log('🔍 Testing OpenAI API connection...');
    
    const validation = validateOpenAICredentials();
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Invalid credentials configuration',
        details: validation
      };
    }
    
    const client = createOpenAIClient();
    
    // Test with a minimal embedding request
    const testResponse = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'test connection',
      dimensions: 512, // Use smaller dimensions for test
    });
    
    console.log('✅ OpenAI API connection successful!');
    
    return {
      success: true,
      details: {
        model: testResponse.model,
        usage: testResponse.usage,
        embedding_length: testResponse.data[0]?.embedding.length
      }
    };
    
  } catch (error: any) {
    console.error('❌ OpenAI API connection failed:', error.message);
    
    let errorDetails: any = {
      message: error.message,
      type: error.constructor.name
    };
    
    if (error instanceof OpenAI.APIError) {
      errorDetails = {
        ...errorDetails,
        status: error.status,
        code: error.code,
        type: error.type,
        headers: error.headers
      };
    }
    
    return {
      success: false,
      error: error.message,
      details: errorDetails
    };
  }
}

// Utility function to estimate costs
export function estimateEmbeddingCost(tokenCount: number, model: EmbeddingModel): number {
  const config = EMBEDDING_MODELS[model];
  return tokenCount * config.costPerToken;
}

// Utility function to validate dimensions for model
export function validateDimensions(model: EmbeddingModel, dimensions?: number): number {
  const supportedDims = EMBEDDING_CONFIG.supportedDimensions[model];
  const defaultDim = EMBEDDING_CONFIG.defaultDimensions[model];
  
  if (!dimensions) {
    return defaultDim;
  }
  
  if (!supportedDims.includes(dimensions)) {
    console.warn(`⚠️ Dimension ${dimensions} not supported for ${model}. Using default ${defaultDim}`);
    return defaultDim;
  }
  
  return dimensions;
}

// Server-side embedding generation with modern OpenAI SDK patterns
export async function generateQueryEmbedding(
  query: string,
  options: Partial<EmbeddingOptions> = {},
  useCache: boolean = true
): Promise<number[]> {
  const result = await generateEmbeddingWithMetadata(query, options, useCache);
  return result.embedding;
}

// Enhanced embedding generation with full metadata and modern options
export async function generateEmbeddingWithMetadata(
  text: string,
  options: Partial<EmbeddingOptions> = {},
  useCache: boolean = true
): Promise<EmbeddingResult> {
  const startTime = Date.now();
  // Clean up expired cache entries periodically
  if (embeddingCache.size > 100) {
    cleanupEmbeddingCache();
  }

  // Validate input
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    throw new Error('Text cannot be empty');
  }

  if (trimmedText.length > EMBEDDING_CONFIG.max_text_length) {
    console.warn(`⚠️ Text length (${trimmedText.length}) exceeds recommended limit (${EMBEDDING_CONFIG.max_text_length}). Truncating...`);
    // Truncate at word boundary
    const truncated = trimmedText.substring(0, EMBEDDING_CONFIG.max_text_length);
    const lastSpace = truncated.lastIndexOf(' ');
    text = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
  }

  // Check cache first
  const cacheKey = text.toLowerCase();
  if (useCache && embeddingCache.has(cacheKey)) {
    const cached = embeddingCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < EMBEDDING_CONFIG.cache_ttl) {
      console.log(`✅ Using cached embedding for: "${text.substring(0, 50)}..."`);
      return {
        embedding: cached.embedding,
        metadata: {
          ...cached.metadata,
          generated_at: new Date(cached.timestamp).toISOString(),
          text_length: text.length,
          cache_hit: true,
          model_version: options.model || EMBEDDING_CONFIG.defaultModel,
        },
      };
    } else {
      embeddingCache.delete(cacheKey);
    }
  }

  // Determine model configuration
  const selectedModel = options.model || EMBEDDING_CONFIG.defaultModel;
  const modelConfig = getModelConfig(selectedModel);
  const dimensions = validateDimensions(selectedModel, options.dimensions);
  const encodingFormat = options.encodingFormat || modelConfig.encodingFormat;
  
  const openai = createOpenAIClient();

  console.log(`🔍 Generating embedding using ${selectedModel} (${dimensions}D) for: "${text.substring(0, 100)}..."`);

  // Retry logic with exponential backoff and modern error handling
  let lastError: any;
  for (let attempt = 1; attempt <= EMBEDDING_CONFIG.max_retries; attempt++) {
    const attemptStartTime = Date.now();
    
    try {
      console.log('📡 Making OpenAI API request:', {
        model: selectedModel,
        dimensions,
        encodingFormat,
        textLength: text.length,
        attempt
      });
      
      const response = await openai.embeddings.create({
        model: selectedModel,
        input: text,
        dimensions,
        encoding_format: encodingFormat,
        user: options.user, // Optional user tracking
      });
      
      const generationTime = Date.now() - attemptStartTime;

      const embeddingData = response.data[0];
      if (!embeddingData?.embedding) {
        throw new Error('No embedding returned from OpenAI API');
      }

      const totalTokens = response.usage?.total_tokens || 0;
      const estimatedCost = EMBEDDING_CONFIG.enableCostTracking ? 
        estimateEmbeddingCost(totalTokens, selectedModel) : 0;

      const result: EmbeddingResult = {
        embedding: embeddingData.embedding,
        metadata: {
          model: response.model,
          dimensions: embeddingData.embedding.length,
          generated_at: new Date().toISOString(),
          text_length: text.length,
          usage: {
            prompt_tokens: response.usage?.prompt_tokens || 0,
            total_tokens: totalTokens,
            estimated_cost: estimatedCost,
          },
          cache_hit: false,
          encoding_format: encodingFormat,
          model_version: `${selectedModel}-v1.0`,
          performance_metrics: EMBEDDING_CONFIG.enablePerformanceMetrics ? {
            generation_time_ms: generationTime,
            tokens_per_second: totalTokens > 0 ? (totalTokens / (generationTime / 1000)) : 0
          } : undefined,
        },
      };

      // Cache successful result with enhanced metadata
      if (useCache) {
        embeddingCache.set(cacheKey, {
          embedding: embeddingData.embedding,
          timestamp: Date.now(),
          metadata: {
            model: response.model,
            dimensions: embeddingData.embedding.length,
            encoding_format: encodingFormat,
            usage: {
              ...result.metadata.usage,
              estimated_cost: result.metadata.usage.estimated_cost || 0
            },
            performance_metrics: {
              generation_time_ms: generationTime
            }
          },
        });
      }

      console.log(`✅ Generated embedding with ${embeddingData.embedding.length} dimensions, ${totalTokens} tokens, ~$${estimatedCost.toFixed(6)} cost (${generationTime}ms, attempt ${attempt})`);
      return result;

    } catch (error: any) {
      lastError = error;
      const attemptDuration = Date.now() - attemptStartTime;
      
      console.error(`❌ Embedding generation attempt ${attempt} failed after ${attemptDuration}ms:`, error.message);
      
      // Modern OpenAI SDK error handling with comprehensive error types
      if (error instanceof OpenAI.APIError) {
        // Handle specific OpenAI API errors with detailed categorization
        const errorContext = {
          status: error.status,
          code: error.code,
          type: error.type,
          message: error.message,
          attempt,
          model: selectedModel,
          text_length: text.length
        };
        
        // Rate limiting and quota errors
        if (error.status === 429) {
          if (error.type === 'insufficient_quota') {
            console.error('🚨 OpenAI quota exhausted. Immediate action required:', errorContext);
            throw new Error(`OpenAI quota exhausted: ${error.message}. Please check billing or upgrade plan.`);
          }
          
          if (error.type === 'rate_limit_exceeded') {
            console.warn('⚠️ Rate limit hit, implementing backoff:', errorContext);
            if (attempt < EMBEDDING_CONFIG.max_retries) {
              // Longer delay for rate limits
              const rateLimitDelay = EMBEDDING_CONFIG.initial_retry_delay * Math.pow(3, attempt);
              const jitter = Math.random() * 2000;
              const delayWithJitter = rateLimitDelay + jitter;
              
              console.log(`🔄 Rate limit retry in ${Math.round(delayWithJitter)}ms... (attempt ${attempt}/${EMBEDDING_CONFIG.max_retries})`);
              await delayInternal(delayWithJitter);
              continue;
            }
          }
        }
        
        // Authentication errors
        if (error.status === 401) {
          console.error('🔐 Authentication failed:', errorContext);
          throw new Error(`Invalid OpenAI API key: ${error.message}`);
        }
        
        // Model or input errors
        if (error.status === 400) {
          if (error.type === 'invalid_request_error') {
            console.error('📝 Invalid request configuration:', errorContext);
            throw new Error(`Invalid embedding request: ${error.message}`);
          }
        }
        
        // Permission errors
        if (error.status === 403) {
          console.error('🚫 Permission denied:', errorContext);
          throw new Error(`OpenAI access denied: ${error.message}`);
        }
        
        // Model not found
        if (error.status === 404) {
          console.error('🔍 Model not found, trying fallback:', errorContext);
          if (selectedModel !== EMBEDDING_CONFIG.fallbackModel) {
            console.log(`🔄 Retrying with fallback model: ${EMBEDDING_CONFIG.fallbackModel}`);
            return generateEmbeddingWithMetadata(text, {
              ...options,
              model: EMBEDDING_CONFIG.fallbackModel
            }, useCache);
          }
          throw new Error(`Embedding model not found: ${error.message}`);
        }
        
        // Server errors (500+) - retry with backoff
        if (error.status >= 500 && attempt < EMBEDDING_CONFIG.max_retries) {
          const serverErrorDelay = EMBEDDING_CONFIG.initial_retry_delay * Math.pow(2, attempt - 1);
          const jitter = Math.random() * 1000;
          const delayWithJitter = serverErrorDelay + jitter;
          
          console.log(`🔄 Server error retry in ${Math.round(delayWithJitter)}ms... (attempt ${attempt}/${EMBEDDING_CONFIG.max_retries})`);
          console.debug('Server error context:', errorContext);
          await delayInternal(delayWithJitter);
          continue;
        }
        
        // Connection timeouts and network errors
        if (!error.status && attempt < EMBEDDING_CONFIG.max_retries) {
          const networkDelay = EMBEDDING_CONFIG.initial_retry_delay * Math.pow(1.5, attempt - 1);
          console.log(`🌐 Network retry in ${networkDelay}ms... (attempt ${attempt}/${EMBEDDING_CONFIG.max_retries})`);
          await delayInternal(networkDelay);
          continue;
        }
        
        // Log unhandled API errors for monitoring
        console.error('🚨 Unhandled OpenAI API error:', errorContext);
      } else {
        // Non-API errors (network, timeout, abort, etc.)
        const errorType = error.constructor.name;
        console.error(`❌ ${errorType} error:`, {
          name: error.name,
          message: error.message,
          attempt,
          model: selectedModel,
          stack: error.stack?.split('\n').slice(0, 3).join('\n')
        });
        
        if (attempt < EMBEDDING_CONFIG.max_retries) {
          let retryDelay = EMBEDDING_CONFIG.initial_retry_delay * Math.pow(2, attempt - 1);
          
          // Different strategies for different error types
          if (error.name === 'AbortError') {
            retryDelay *= 2; // Longer delay for aborted requests
          } else if (error.name === 'TimeoutError') {
            retryDelay *= 1.5; // Moderate delay for timeouts
          }
          
          console.log(`🔄 ${errorType} retry in ${retryDelay}ms... (attempt ${attempt}/${EMBEDDING_CONFIG.max_retries})`);
          await delayInternal(retryDelay);
          continue;
        }
      }
      
      // Final attempt failed
      break;
    }
  }
  
  const totalTime = Date.now() - startTime;
  const finalError = new Error(
    `Failed to generate embedding after ${EMBEDDING_CONFIG.max_retries} attempts (${totalTime}ms total): ${lastError.message}`
  );
  
  // Add context for debugging
  (finalError as any).context = {
    model: selectedModel,
    dimensions,
    text_length: text.length,
    total_time_ms: totalTime,
    final_error_type: lastError.constructor.name,
    final_error_status: lastError.status,
  };
  
  console.error('🚨 Embedding generation completely failed:', (finalError as any).context);
  throw finalError;
}

// Enhanced hospital embedding function with usage tracking
export async function generateHospitalEmbedding(
  hospital: HospitalData,
  options: Partial<EmbeddingOptions> = {},
  trackUsage: boolean = true
): Promise<{ embedding: number[]; metadata: any; usageLogId?: string }> {
  const embeddingText = prepareHospitalEmbeddingText(hospital);
  
  const result = await generateEmbeddingWithMetadata(embeddingText, options, true);
  
  let usageLogId: string | undefined;
  
  // Track usage in database if enabled and hospital has an ID
  if (trackUsage && (hospital as any).id) {
    try {
      usageLogId = await logEmbeddingUsage({
        hospitalId: (hospital as any).id,
        model: result.metadata.model,
        dimensions: result.metadata.dimensions,
        encodingFormat: result.metadata.encoding_format,
        promptTokens: result.metadata.usage.prompt_tokens,
        totalTokens: result.metadata.usage.total_tokens,
        estimatedCost: result.metadata.usage.estimated_cost || 0,
        generationTimeMs: result.metadata.performance_metrics?.generation_time_ms || 0,
        cacheHit: result.metadata.cache_hit || false,
        userId: options.user,
        metadata: {
          hospital_name: hospital.name,
          hospital_type: hospital.type,
          text_length: result.metadata.text_length,
          fields_included: getIncludedHospitalFields(hospital),
          text_structure: analyzeTextStructure(embeddingText)
        }
      });
    } catch (error) {
      console.warn('⚠️ Failed to log embedding usage:', error);
      // Don't fail the embedding generation if logging fails
    }
  }
  
  return {
    embedding: result.embedding,
    metadata: {
      ...result.metadata,
      hospital_fields_included: getIncludedHospitalFields(hospital),
      text_structure: analyzeTextStructure(embeddingText),
      usage_logged: !!usageLogId,
    },
    usageLogId,
  };
}

// Enhanced text preparation for hospital embeddings with current schema
export function prepareHospitalEmbeddingText(hospital: HospitalData): string {
  const parts: string[] = [];

  // Primary identifier
  if (hospital.name) {
    parts.push(hospital.name);
  }

  // Hospital type and classification
  if (hospital.type) {
    const formattedType = hospital.type.replace(/_/g, ' ').toLowerCase();
    parts.push(`${formattedType} hospital`);
  }

  // Location information
  if (hospital.city && hospital.state) {
    parts.push(`located in ${hospital.city}, ${hospital.state}`);
  } else if (hospital.city) {
    parts.push(`located in ${hospital.city}`);
  }

  // Scale and capacity indicators
  if (hospital.bed_count) {
    if (hospital.bed_count > 500) {
      parts.push(`large hospital with ${hospital.bed_count} beds`);
    } else if (hospital.bed_count > 200) {
      parts.push(`medium-sized hospital with ${hospital.bed_count} beds`);
    } else {
      parts.push(`${hospital.bed_count}-bed facility`);
    }
  }

  // Historical context
  if (hospital.established) {
    const year = hospital.established;
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(year);
    if (age > 100) {
      parts.push(`established in ${year}, over ${Math.floor(age/10)*10} years of medical service`);
    } else if (age > 25) {
      parts.push(`established in ${year}, ${Math.floor(age/5)*5}+ years of medical care`);
    } else {
      parts.push(`established in ${year}`);
    }
  }

  // Emergency and trauma services (high priority for medical searches)
  if (hospital.emergency_services) {
    if (hospital.trauma_level) {
      parts.push(`provides Level ${hospital.trauma_level} trauma center and emergency services`);
    } else {
      parts.push('provides emergency medical services');
    }
  } else if (hospital.trauma_level) {
    parts.push(`Level ${hospital.trauma_level} trauma center`);
  }

  // Rich metadata content
  if (hospital.metadata) {
    // Medical specialties (high relevance for medical searches)
    if (hospital.metadata.specialties && Array.isArray(hospital.metadata.specialties)) {
      const specialties = hospital.metadata.specialties.slice(0, 6); // Limit to top 6 specialties
      parts.push(`medical specialties include ${specialties.join(', ')}`);
    }

    // Programs and services
    if (hospital.metadata.programs && Array.isArray(hospital.metadata.programs)) {
      const programs = hospital.metadata.programs.slice(0, 4);
      parts.push(`specialized programs: ${programs.join(', ')}`);
    }

    // Quality indicators
    if (hospital.metadata.accreditations && Array.isArray(hospital.metadata.accreditations)) {
      parts.push(`accredited by ${hospital.metadata.accreditations.join(', ')}`);
    }

    // Language accessibility
    if (hospital.metadata.languages && Array.isArray(hospital.metadata.languages)) {
      if (hospital.metadata.languages.length > 1) {
        parts.push(`multilingual services in ${hospital.metadata.languages.join(', ')}`);
      }
    }

    // Research and teaching aspects
    if (hospital.metadata.medical_school) {
      parts.push(`affiliated with ${hospital.metadata.medical_school}`);
    }
    
    if (hospital.metadata.research_programs && Array.isArray(hospital.metadata.research_programs)) {
      parts.push(`research focus: ${hospital.metadata.research_programs.join(', ')}`);
    }
  }

  // Detailed description (lower priority, truncated if too long)
  if (hospital.description) {
    let description = hospital.description.trim();
    // Truncate very long descriptions to leave room for structured data
    if (description.length > 200) {
      description = description.substring(0, 200) + '...';
    }
    parts.push(description);
  }

  // Contact and accessibility information
  if (hospital.website) {
    parts.push('online services available');
  }

  const fullText = parts.join('. ');
  
  // Final length check and optimization
  if (fullText.length > EMBEDDING_CONFIG.max_text_length) {
    console.warn(`🔧 Hospital embedding text too long (${fullText.length} chars), optimizing...`);
    return optimizeHospitalText(parts);
  }

  return fullText;
}

// Optimize text length while preserving most important information
function optimizeHospitalText(parts: string[]): string {
  // Priority order: name, type, location, emergency services, specialties, description
  const priorityParts = parts.slice(0, 6); // Keep most important parts
  let optimized = priorityParts.join('. ');
  
  // If still too long, progressively shorten
  if (optimized.length > EMBEDDING_CONFIG.max_text_length) {
    optimized = parts.slice(0, 4).join('. ');
  }
  
  return optimized;
}

// Track which hospital fields were included in the embedding
export function getIncludedHospitalFields(hospital: HospitalData): string[] {
  const fields: string[] = [];
  
  if (hospital.name) fields.push('name');
  if (hospital.type) fields.push('type');
  if (hospital.city) fields.push('city');
  if (hospital.state) fields.push('state');
  if (hospital.bed_count) fields.push('bed_count');
  if (hospital.established) fields.push('established');
  if (hospital.emergency_services) fields.push('emergency_services');
  if (hospital.trauma_level) fields.push('trauma_level');
  if (hospital.description) fields.push('description');
  if (hospital.metadata) fields.push('metadata');
  
  return fields;
}

// Analyze the structure of the prepared text for metadata
export function analyzeTextStructure(text: string): { word_count: number; sentence_count: number; has_specialties: boolean; has_location: boolean } {
  return {
    word_count: text.split(/\s+/).length,
    sentence_count: text.split(/[.!?]+/).length - 1,
    has_specialties: text.toLowerCase().includes('specialties') || text.toLowerCase().includes('programs'),
    has_location: text.toLowerCase().includes('located in') || text.toLowerCase().includes('city'),
  };
}

// Batch processing for multiple hospitals using OpenAI batch API
export async function generateBatchHospitalEmbeddings(
  hospitals: HospitalData[],
  batchSize: number = 20
): Promise<Array<{ embedding: number[]; metadata: any; hospital_id?: string }>> {
  if (!Array.isArray(hospitals) || hospitals.length === 0) {
    throw new Error('Hospitals must be a non-empty array');
  }

  console.log(`🚀 Starting batch embedding generation for ${hospitals.length} hospitals`);

  const results: Array<{ embedding: number[]; metadata: any; hospital_id?: string }> = [];
  
  // Process in smaller batches to respect OpenAI limits
  for (let i = 0; i < hospitals.length; i += batchSize) {
    const batch = hospitals.slice(i, i + batchSize);
    
    console.log(`📋 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(hospitals.length / batchSize)} (${batch.length} hospitals)`);
    
    try {
      // Prepare texts for all hospitals in batch
      const batchTexts = batch.map(hospital => prepareHospitalEmbeddingText(hospital));
      
      // Create batch embedding request
      const openai = createOpenAIClient();
      const response = await openai.embeddings.create({
        model: EMBEDDING_CONFIG.defaultModel,
        input: batchTexts,
      });

      // Process batch results
      for (let j = 0; j < batch.length; j++) {
        const hospital = batch[j];
        const embeddingData = response.data[j];
        
        if (embeddingData?.embedding) {
          const result = {
            embedding: embeddingData.embedding,
            metadata: {
              model: response.model,
              dimensions: embeddingData.embedding.length,
              generated_at: new Date().toISOString(),
              text_length: batchTexts[j].length,
              usage_share: {
                prompt_tokens: Math.round((response.usage?.prompt_tokens || 0) / batch.length),
                total_tokens: Math.round((response.usage?.total_tokens || 0) / batch.length),
              },
              hospital_fields_included: getIncludedHospitalFields(hospital),
              text_structure: analyzeTextStructure(batchTexts[j]),
              batch_info: {
                batch_size: batch.length,
                batch_index: j,
                total_batches: Math.ceil(hospitals.length / batchSize),
              },
            },
            hospital_id: (hospital as any).id, // Include ID if available
          };
          
          results.push(result);
          
          // Cache individual results
          const cacheKey = batchTexts[j].toLowerCase();
          embeddingCache.set(cacheKey, {
            embedding: embeddingData.embedding,
            timestamp: Date.now(),
            metadata: {
              model: response.model,
              dimensions: embeddingData.embedding.length,
              encoding_format: 'float',
              usage: {
                ...result.metadata.usage_share,
                estimated_cost: 0
              },
              performance_metrics: {
                generation_time_ms: 0
              }
            },
          });
        } else {
          console.error(`❌ No embedding returned for hospital: ${hospital.name}`);
        }
      }

      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed successfully (${batch.length} embeddings)`);
      
      // Brief delay between batches to be respectful of rate limits
      if (i + batchSize < hospitals.length) {
        await delayInternal(500); // 500ms between batches
      }

    } catch (error: any) {
      console.error(`❌ Batch processing failed for batch starting at index ${i}:`, error.message);
      
      // Fall back to individual processing for this batch
      console.log(`🔄 Falling back to individual processing for ${batch.length} hospitals...`);
      
      for (const hospital of batch) {
        try {
          const individualResult = await generateHospitalEmbedding(hospital);
          results.push({
            ...individualResult,
            hospital_id: (hospital as any).id,
          });
        } catch (individualError) {
          console.error(`❌ Failed to process individual hospital: ${hospital.name}`, individualError);
          // Continue with next hospital instead of failing entire batch
        }
      }
    }
  }

  console.log(`🎉 Batch embedding generation completed. Processed ${results.length}/${hospitals.length} hospitals`);
  return results;
}

// Usage tracking interface
export interface EmbeddingUsageLog {
  hospitalId: string;
  model: string;
  dimensions: number;
  encodingFormat: EncodingFormat;
  promptTokens: number;
  totalTokens: number;
  estimatedCost: number;
  generationTimeMs: number;
  cacheHit?: boolean;
  userId?: string;
  metadata?: Record<string, any>;
}

// Function to log embedding usage to database
export async function logEmbeddingUsage(usage: EmbeddingUsageLog): Promise<string> {
  // This would typically call your Supabase client
  // For now, we'll return a mock ID and log the usage
  const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('📊 Embedding usage logged:', {
    id: logId,
    hospital: usage.hospitalId,
    model: usage.model,
    tokens: usage.totalTokens,
    cost: usage.estimatedCost,
    time_ms: usage.generationTimeMs,
    cache_hit: usage.cacheHit
  });
  
  // TODO: Implement actual database logging with Supabase
  // const { data, error } = await supabase.rpc('log_embedding_usage', {
  //   p_hospital_id: usage.hospitalId,
  //   p_model: usage.model,
  //   p_dimensions: usage.dimensions,
  //   p_encoding_format: usage.encodingFormat,
  //   p_prompt_tokens: usage.promptTokens,
  //   p_total_tokens: usage.totalTokens,
  //   p_estimated_cost: usage.estimatedCost,
  //   p_generation_time_ms: usage.generationTimeMs,
  //   p_cache_hit: usage.cacheHit,
  //   p_user_id: usage.userId,
  //   p_metadata: usage.metadata
  // });
  
  return logId;
}

// Enhanced cache statistics for monitoring
export function getEmbeddingCacheStats() {
  cleanupEmbeddingCache();
  
  const entries = Array.from(embeddingCache.values());
  const totalUsage = entries.reduce((sum, entry) => {
    return sum + (entry.metadata?.usage?.total_tokens || 0);
  }, 0);
  
  const totalCost = entries.reduce((sum, entry) => {
    return sum + (entry.metadata?.usage?.estimated_cost || 0);
  }, 0);
  
  return {
    size: embeddingCache.size,
    total_memory_mb: Math.round((embeddingCache.size * 1536 * 8) / (1024 * 1024) * 100) / 100,
    total_tokens_cached: totalUsage,
    total_cost_cached: totalCost,
    cache_hit_potential: embeddingCache.size,
    avg_tokens_per_entry: entries.length > 0 ? Math.round(totalUsage / entries.length) : 0,
    avg_cost_per_entry: entries.length > 0 ? totalCost / entries.length : 0,
    oldest_entry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
    newest_entry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null,
    model_distribution: entries.reduce((dist, entry) => {
      const model = entry.metadata.model;
      dist[model] = (dist[model] || 0) + 1;
      return dist;
    }, {} as Record<string, number>),
    sample_keys: Array.from(embeddingCache.keys()).slice(0, 3).map(k => k.substring(0, 50) + '...'),
  };
}

// Function to clear cache if needed
export function clearEmbeddingCache(): void {
  const sizeBefore = embeddingCache.size;
  embeddingCache.clear();
  console.log(`🗑️ Embedding cache cleared (removed ${sizeBefore} entries)`);
}

// Cost monitoring and budget management
export interface CostMonitor {
  dailyLimit: number;
  monthlyLimit: number;
  warningThreshold: number;
  getCurrentUsage(): Promise<{ daily: number; monthly: number }>;
  checkBudget(estimatedCost: number): Promise<{ allowed: boolean; reason?: string }>;
}

export class EmbeddingCostMonitor implements CostMonitor {
  public dailyLimit: number;
  public monthlyLimit: number;
  public warningThreshold: number;

  constructor(
    dailyLimit: number = 10.0, // $10 daily limit
    monthlyLimit: number = 200.0, // $200 monthly limit
    warningThreshold: number = 0.8 // 80% warning threshold
  ) {
    this.dailyLimit = dailyLimit;
    this.monthlyLimit = monthlyLimit;
    this.warningThreshold = warningThreshold;
  }

  async getCurrentUsage(): Promise<{ daily: number; monthly: number }> {
    // TODO: Implement actual database queries to get usage from embedding_usage_logs
    // For now, return mock data
    return {
      daily: 2.34,
      monthly: 45.67
    };
  }

  async checkBudget(estimatedCost: number): Promise<{ allowed: boolean; reason?: string }> {
    const usage = await this.getCurrentUsage();
    
    // Check daily limit
    if (usage.daily + estimatedCost > this.dailyLimit) {
      return {
        allowed: false,
        reason: `Would exceed daily budget: $${(usage.daily + estimatedCost).toFixed(4)} > $${this.dailyLimit}`
      };
    }
    
    // Check monthly limit
    if (usage.monthly + estimatedCost > this.monthlyLimit) {
      return {
        allowed: false,
        reason: `Would exceed monthly budget: $${(usage.monthly + estimatedCost).toFixed(4)} > $${this.monthlyLimit}`
      };
    }
    
    // Check warning thresholds
    const dailyPercent = (usage.daily + estimatedCost) / this.dailyLimit;
    const monthlyPercent = (usage.monthly + estimatedCost) / this.monthlyLimit;
    
    if (dailyPercent >= this.warningThreshold || monthlyPercent >= this.warningThreshold) {
      console.warn(`⚠️ Embedding budget warning: ${Math.max(dailyPercent, monthlyPercent) * 100}% of limit reached`);
    }
    
    return { allowed: true };
  }
}

// Global cost monitor instance
let costMonitor: EmbeddingCostMonitor | null = null;

export function getCostMonitor(): EmbeddingCostMonitor {
  if (!costMonitor) {
    // Get limits from environment variables or use defaults
    const dailyLimit = parseFloat(process.env.EMBEDDING_DAILY_BUDGET || '10.0');
    const monthlyLimit = parseFloat(process.env.EMBEDDING_MONTHLY_BUDGET || '200.0');
    const warningThreshold = parseFloat(process.env.EMBEDDING_WARNING_THRESHOLD || '0.8');
    
    costMonitor = new EmbeddingCostMonitor(dailyLimit, monthlyLimit, warningThreshold);
  }
  return costMonitor;
}

// Enhanced function that checks budget before generating embeddings
export async function generateEmbeddingWithBudgetCheck(
  text: string,
  options: Partial<EmbeddingOptions> = {},
  useCache: boolean = true
): Promise<EmbeddingResult> {
  const monitor = getCostMonitor();
  const selectedModel = options.model || EMBEDDING_CONFIG.defaultModel;
  
  // Estimate cost before generation
  const estimatedTokens = Math.ceil(text.length / 4); // Rough estimation
  const estimatedCost = estimateEmbeddingCost(estimatedTokens, selectedModel);
  
  // Check budget
  const budgetCheck = await monitor.checkBudget(estimatedCost);
  if (!budgetCheck.allowed) {
    throw new Error(`Embedding generation blocked by budget limit: ${budgetCheck.reason}`);
  }
  
  // Proceed with generation
  return generateEmbeddingWithMetadata(text, options, useCache);
}

// Utility function for delay with jitter (exported for testing)
export async function delay(ms: number, jitter: boolean = false): Promise<void> {
  const delayTime = jitter ? ms + Math.random() * 1000 : ms;
  return new Promise(resolve => setTimeout(resolve, delayTime));
}

// Export updated configuration
export { EMBEDDING_CONFIG, EMBEDDING_MODELS };