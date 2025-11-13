/**
 * Embedding Configuration Management
 * Centralized configuration for embedding providers
 */

import { EmbeddingProvider } from '../services/embedding-provider';

// Environment-based configuration
export interface EmbeddingEnvironmentConfig {
  provider: EmbeddingProvider;
  openai: {
    apiKey?: string;
    projectId?: string;
    defaultModel: string;
    defaultDimensions: number;
  };
  gemini: {
    apiKey?: string;
    defaultModel: string;
    defaultDimensions: number;
  };
  fallback: {
    enabled: boolean;
    order: EmbeddingProvider[];
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
  batch: {
    defaultSize: number;
    maxConcurrency: number;
  };
}

/**
 * Load embedding configuration from environment variables
 */
export function loadEmbeddingConfig(): EmbeddingEnvironmentConfig {
  const provider = (process.env.EMBEDDING_PROVIDER as EmbeddingProvider) || 'gemini';
  
  return {
    provider,
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      projectId: process.env.OPENAI_PROJECT_ID,
      defaultModel: 'text-embedding-3-small',
      defaultDimensions: 1536
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      defaultModel: 'text-embedding-004',
      defaultDimensions: 768
    },
    fallback: {
      enabled: process.env.EMBEDDING_FALLBACK !== 'false',
      order: ['gemini', 'openai'] // Prefer Gemini first
    },
    cache: {
      enabled: process.env.EMBEDDING_CACHE !== 'false',
      ttl: parseInt(process.env.EMBEDDING_CACHE_TTL || '3600') * 1000 // 1 hour default
    },
    batch: {
      defaultSize: parseInt(process.env.EMBEDDING_BATCH_SIZE || '20'),
      maxConcurrency: parseInt(process.env.EMBEDDING_MAX_CONCURRENCY || '3')
    }
  };
}

/**
 * Validate configuration completeness
 */
export function validateEmbeddingConfig(config: EmbeddingEnvironmentConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if at least one provider is configured
  const hasOpenAI = !!config.openai.apiKey;
  const hasGemini = !!config.gemini.apiKey;
  
  if (!hasOpenAI && !hasGemini) {
    errors.push('No embedding provider is configured. Set either OPENAI_API_KEY or GEMINI_API_KEY.');
  }
  
  // Check primary provider configuration
  if (config.provider === 'openai' && !hasOpenAI) {
    errors.push('EMBEDDING_PROVIDER is set to "openai" but OPENAI_API_KEY is missing.');
  }
  
  if (config.provider === 'gemini' && !hasGemini) {
    errors.push('EMBEDDING_PROVIDER is set to "gemini" but GEMINI_API_KEY is missing.');
  }
  
  // Warnings for missing fallback providers
  if (config.fallback.enabled) {
    if (config.provider === 'openai' && !hasGemini) {
      warnings.push('Fallback is enabled but Gemini is not configured. Consider setting GEMINI_API_KEY.');
    }
    if (config.provider === 'gemini' && !hasOpenAI) {
      warnings.push('Fallback is enabled but OpenAI is not configured. Consider setting OPENAI_API_KEY.');
    }
  }
  
  // Check placeholder values
  if (config.openai.apiKey === 'your-openai-api-key-here') {
    errors.push('OPENAI_API_KEY is set to placeholder value. Replace with your actual API key.');
  }
  
  if (config.gemini.apiKey === 'your-gemini-api-key-here') {
    errors.push('GEMINI_API_KEY is set to placeholder value. Replace with your actual API key.');
  }
  
  // Validate batch settings
  if (config.batch.defaultSize < 1 || config.batch.defaultSize > 100) {
    warnings.push('EMBEDDING_BATCH_SIZE should be between 1 and 100.');
  }
  
  if (config.batch.maxConcurrency < 1 || config.batch.maxConcurrency > 10) {
    warnings.push('EMBEDDING_MAX_CONCURRENCY should be between 1 and 10.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get API key URLs for each provider
 */
export function getProviderSetupUrls(): Record<EmbeddingProvider, string> {
  return {
    openai: 'https://platform.openai.com/api-keys',
    gemini: 'https://aistudio.google.com/app/apikey'
  };
}

/**
 * Generate environment variable template
 */
export function generateEnvTemplate(): string {
  return `# Embedding Provider Configuration

# Primary provider (gemini|openai)
EMBEDDING_PROVIDER=gemini

# Google Gemini Configuration (recommended - free tier available)
# Get your free API key from: ${getProviderSetupUrls().gemini}
GEMINI_API_KEY=your-gemini-api-key-here

# OpenAI Configuration (backup/alternative)
# Get your API key from: ${getProviderSetupUrls().openai}
OPENAI_API_KEY=your-openai-api-key-here
# OPENAI_PROJECT_ID=your-project-id-here  # Only needed for non-project-scoped keys

# Optional: Embedding Settings
# EMBEDDING_FALLBACK=true                 # Enable fallback to secondary provider
# EMBEDDING_CACHE=true                    # Enable embedding caching
# EMBEDDING_CACHE_TTL=3600               # Cache TTL in seconds (default: 1 hour)
# EMBEDDING_BATCH_SIZE=20                # Batch size for bulk operations
# EMBEDDING_MAX_CONCURRENCY=3           # Max concurrent requests
`;
}

/**
 * Display configuration status
 */
export function displayConfigStatus(config: EmbeddingEnvironmentConfig): void {
  console.log('🔧 Embedding Configuration Status');
  console.log('================================');
  console.log(`Primary Provider: ${config.provider}`);
  console.log(`OpenAI Configured: ${config.openai.apiKey ? '✅' : '❌'}`);
  console.log(`Gemini Configured: ${config.gemini.apiKey ? '✅' : '❌'}`);
  console.log(`Fallback Enabled: ${config.fallback.enabled ? '✅' : '❌'}`);
  console.log(`Cache Enabled: ${config.cache.enabled ? '✅' : '❌'}`);
  console.log(`Batch Size: ${config.batch.defaultSize}`);
  console.log(`Max Concurrency: ${config.batch.maxConcurrency}`);
  
  const validation = validateEmbeddingConfig(config);
  
  if (validation.errors.length > 0) {
    console.log('\n❌ Configuration Errors:');
    validation.errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️ Configuration Warnings:');
    validation.warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  if (validation.isValid) {
    console.log('\n✅ Configuration is valid and ready to use!');
  } else {
    console.log('\n❌ Please fix the configuration errors above.');
  }
  
  console.log('\n🔗 Setup URLs:');
  Object.entries(getProviderSetupUrls()).forEach(([provider, url]) => {
    console.log(`  ${provider}: ${url}`);
  });
}

/**
 * Runtime configuration instance
 */
export const embeddingConfig = loadEmbeddingConfig();