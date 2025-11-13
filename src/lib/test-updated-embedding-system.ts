/**
 * Comprehensive test suite for the updated OpenAI embedding system
 * Tests all new features: latest models, error handling, cost tracking, batch optimization
 */

import {
  generateEmbeddingWithMetadata,
  generateQueryEmbedding,
  generateHospitalEmbedding,
  generateEmbeddingWithBudgetCheck,
  getModelConfig,
  validateDimensions,
  estimateEmbeddingCost,
  getCostMonitor,
  getEmbeddingCacheStats,
  clearEmbeddingCache,
  EmbeddingModel,
  HospitalData,
  EMBEDDING_MODELS
} from './services/embedding-server';

import {
  generateBatchHospitalEmbeddingsOptimized,
  BatchProcessingOptions
} from './services/embedding-batch-optimized';

// Test data
const mockHospital: HospitalData = {
  name: "St. Mary's Medical Center",
  description: "A comprehensive healthcare facility specializing in cardiac care, neurology, and emergency services. Features state-of-the-art equipment and experienced medical professionals.",
  type: 'GENERAL',
  city: 'Los Angeles',
  state: 'CA',
  trauma_level: 'II',
  emergency_services: true,
  bed_count: 350,
  established: '1985',
  phone: '(555) 123-4567',
  website: 'https://stmarysmedical.example.com',
  metadata: {
    specialties: ['Cardiology', 'Neurology', 'Emergency Medicine', 'Orthopedics'],
    accreditations: ['Joint Commission', 'Magnet Recognition'],
    languages: ['English', 'Spanish', 'Mandarin'],
    programs: ['Cardiac Rehabilitation', 'Stroke Center', 'Trauma Center']
  }
};

const mockHospitals: HospitalData[] = [
  mockHospital,
  {
    name: "Children's Hospital of Orange County",
    description: "Dedicated pediatric care facility with specialized departments for children's health needs.",
    type: 'CHILDRENS',
    city: 'Orange',
    state: 'CA',
    trauma_level: 'I',
    emergency_services: true,
    bed_count: 150,
    metadata: {
      specialties: ['Pediatrics', 'Neonatal Care', 'Pediatric Surgery'],
      programs: ['NICU', 'Pediatric ICU']
    }
  },
  {
    name: "West Coast Rehabilitation Center",
    description: "Specialized rehabilitation services for post-surgical and injury recovery.",
    type: 'REHABILITATION',
    city: 'San Diego',
    state: 'CA',
    emergency_services: false,
    bed_count: 75,
    metadata: {
      specialties: ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy'],
      programs: ['Stroke Recovery', 'Sports Medicine']
    }
  }
];

// Test runner interface
interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  details?: any;
  error?: string;
}

class EmbeddingSystemTester {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting comprehensive embedding system tests...\n');
    
    try {
      // Clear cache before testing
      clearEmbeddingCache();
      
      // Core functionality tests
      await this.testModelConfigurations();
      await this.testBasicEmbeddingGeneration();
      await this.testAdvancedEmbeddingOptions();
      await this.testErrorHandling();
      
      // Hospital-specific tests
      await this.testHospitalEmbedding();
      await this.testBatchProcessing();
      
      // Cost and monitoring tests
      await this.testCostEstimation();
      await this.testBudgetMonitoring();
      await this.testCacheManagement();
      
      // Performance tests
      await this.testPerformanceMetrics();
      
      this.printTestSummary();
      
    } catch (error) {
      console.error('❌ Test suite failed to complete:', error);
    }
  }

  private async runTest(testName: string, testFn: () => Promise<any>): Promise<void> {
    this.startTime = Date.now();
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const result = await testFn();
      const duration = Date.now() - this.startTime;
      
      this.results.push({
        testName,
        passed: true,
        duration,
        details: result
      });
      
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - this.startTime;
      
      this.results.push({
        testName,
        passed: false,
        duration,
        error: error.message
      });
      
      console.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message}`);
    }
    
    console.log(''); // Add spacing
  }

  private async testModelConfigurations(): Promise<void> {
    await this.runTest('Model Configuration Validation', async () => {
      const models: EmbeddingModel[] = ['text-embedding-3-small', 'text-embedding-3-large'];
      const configs = [];
      
      for (const model of models) {
        const config = getModelConfig(model);
        
        // Validate config structure
        if (!config.model || !config.dimensions || !config.costPerToken) {
          throw new Error(`Invalid config for ${model}`);
        }
        
        // Test dimension validation
        const validDims = validateDimensions(model, config.dimensions);
        if (validDims !== config.dimensions) {
          throw new Error(`Dimension validation failed for ${model}`);
        }
        
        configs.push({ model, config });
      }
      
      return { testedModels: models.length, configs };
    });
  }

  private async testBasicEmbeddingGeneration(): Promise<void> {
    await this.runTest('Basic Embedding Generation', async () => {
      const testQueries = [
        'cardiac surgery',
        'pediatric emergency care',
        'orthopedic rehabilitation services'
      ];
      
      const embeddings = [];
      
      for (const query of testQueries) {
        const embedding = await generateQueryEmbedding(query);
        
        if (!Array.isArray(embedding) || embedding.length !== 1536) {
          throw new Error(`Invalid embedding for query: ${query}`);
        }
        
        embeddings.push({
          query,
          dimensions: embedding.length,
          firstValue: embedding[0]
        });
      }
      
      return { totalQueries: testQueries.length, embeddings };
    });
  }

  private async testAdvancedEmbeddingOptions(): Promise<void> {
    await this.runTest('Advanced Embedding Options', async () => {
      const testQuery = 'advanced cardiac surgery procedures';
      const results = [];
      
      // Test different models
      for (const model of Object.keys(EMBEDDING_MODELS) as EmbeddingModel[]) {
        const result = await generateEmbeddingWithMetadata(testQuery, {
          model,
          user: 'test-user-123'
        });
        
        if (!result.embedding || !result.metadata) {
          throw new Error(`Failed to generate embedding with ${model}`);
        }
        
        results.push({
          model,
          dimensions: result.metadata.dimensions,
          cost: result.metadata.usage.estimated_cost,
          tokens: result.metadata.usage.total_tokens,
          generationTime: result.metadata.performance_metrics?.generation_time_ms
        });
      }
      
      return { models: results };
    });
  }

  private async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling', async () => {
      const errorTests = [];
      
      // Test empty input
      try {
        await generateEmbeddingWithMetadata('');
        throw new Error('Should have failed with empty input');
      } catch (error: any) {
        errorTests.push({ test: 'empty_input', handled: true, error: error.message });
      }
      
      // Test very long input
      try {
        const longText = 'word '.repeat(3000); // Very long text
        const result = await generateEmbeddingWithMetadata(longText);
        errorTests.push({ 
          test: 'long_input', 
          handled: true, 
          truncated: true,
          finalLength: result.metadata.text_length
        });
      } catch (error: any) {
        errorTests.push({ test: 'long_input', handled: true, error: error.message });
      }
      
      return { errorTests };
    });
  }

  private async testHospitalEmbedding(): Promise<void> {
    await this.runTest('Hospital Embedding Generation', async () => {
      const result = await generateHospitalEmbedding(mockHospital, {
        model: 'text-embedding-3-small',
        user: 'test-system'
      });
      
      if (!result.embedding || !result.metadata) {
        throw new Error('Hospital embedding generation failed');
      }
      
      // Validate metadata includes hospital-specific fields
      const requiredFields = ['hospital_fields_included', 'text_structure'];
      for (const field of requiredFields) {
        if (!result.metadata[field]) {
          throw new Error(`Missing required metadata field: ${field}`);
        }
      }
      
      return {
        embedding_dimensions: result.embedding.length,
        fields_included: result.metadata.hospital_fields_included,
        text_structure: result.metadata.text_structure,
        usage_logged: result.usageLogId ? true : false
      };
    });
  }

  private async testBatchProcessing(): Promise<void> {
    await this.runTest('Optimized Batch Processing', async () => {
      const options: BatchProcessingOptions = {
        model: 'text-embedding-3-small',
        maxConcurrency: 2,
        adaptiveBatchSize: true,
        trackUsage: true,
        enableSmartCaching: true,
        costBudgetCheck: false // Disable for testing
      };
      
      const { results, stats } = await generateBatchHospitalEmbeddingsOptimized(mockHospitals, options);
      
      if (results.length !== mockHospitals.length) {
        throw new Error(`Expected ${mockHospitals.length} results, got ${results.length}`);
      }
      
      // Validate all embeddings are present
      for (const result of results) {
        if (!result.embedding || result.embedding.length === 0) {
          throw new Error('Invalid embedding in batch result');
        }
      }
      
      return {
        processed: stats.totalProcessed,
        failed: stats.totalFailed,
        cost: stats.totalCost,
        tokens: stats.totalTokens,
        time_ms: stats.totalTimeMs,
        cache_hit_rate: stats.cacheHitRate,
        batch_optimization: stats.batchSizeOptimization
      };
    });
  }

  private async testCostEstimation(): Promise<void> {
    await this.runTest('Cost Estimation', async () => {
      const testCases = [
        { tokens: 100, model: 'text-embedding-3-small' as EmbeddingModel },
        { tokens: 1000, model: 'text-embedding-3-small' as EmbeddingModel },
        { tokens: 100, model: 'text-embedding-3-large' as EmbeddingModel },
        { tokens: 1000, model: 'text-embedding-3-large' as EmbeddingModel }
      ];
      
      const estimates = testCases.map(({ tokens, model }) => {
        const cost = estimateEmbeddingCost(tokens, model);
        return { tokens, model, estimated_cost: cost };
      });
      
      // Validate that large model costs more than small model
      const smallCost = estimates[1].estimated_cost; // 1000 tokens, small model
      const largeCost = estimates[3].estimated_cost; // 1000 tokens, large model
      
      if (largeCost <= smallCost) {
        throw new Error('Large model should cost more than small model');
      }
      
      return { estimates };
    });
  }

  private async testBudgetMonitoring(): Promise<void> {
    await this.runTest('Budget Monitoring', async () => {
      const monitor = getCostMonitor();
      
      // Test current usage retrieval
      const usage = await monitor.getCurrentUsage();
      if (typeof usage.daily !== 'number' || typeof usage.monthly !== 'number') {
        throw new Error('Invalid usage data structure');
      }
      
      // Test budget checks
      const smallCostCheck = await monitor.checkBudget(0.01); // $0.01
      if (!smallCostCheck.allowed) {
        throw new Error('Small budget check should be allowed');
      }
      
      const largeCostCheck = await monitor.checkBudget(1000); // $1000
      if (largeCostCheck.allowed) {
        throw new Error('Large budget check should be blocked');
      }
      
      return {
        current_usage: usage,
        small_cost_allowed: smallCostCheck.allowed,
        large_cost_blocked: !largeCostCheck.allowed,
        large_cost_reason: largeCostCheck.reason
      };
    });
  }

  private async testCacheManagement(): Promise<void> {
    await this.runTest('Cache Management', async () => {
      // Clear cache first
      clearEmbeddingCache();
      
      // Generate some embeddings to populate cache
      const query1 = 'test query one for caching';
      const query2 = 'test query two for caching';
      
      await generateQueryEmbedding(query1);
      await generateQueryEmbedding(query2);
      
      const cacheStats1 = getEmbeddingCacheStats();
      
      if (cacheStats1.size !== 2) {
        throw new Error(`Expected 2 cache entries, got ${cacheStats1.size}`);
      }
      
      // Test cache hit by regenerating same query
      await generateQueryEmbedding(query1);
      
      const cacheStats2 = getEmbeddingCacheStats();
      
      // Cache size should remain the same (cache hit)
      if (cacheStats2.size !== 2) {
        throw new Error(`Cache hit failed, size changed from 2 to ${cacheStats2.size}`);
      }
      
      return {
        initial_cache_size: cacheStats1.size,
        after_cache_hit: cacheStats2.size,
        total_memory_mb: cacheStats2.total_memory_mb,
        model_distribution: cacheStats2.model_distribution
      };
    });
  }

  private async testPerformanceMetrics(): Promise<void> {
    await this.runTest('Performance Metrics', async () => {
      const testQuery = 'performance testing query for metrics validation';
      
      const result = await generateEmbeddingWithMetadata(testQuery, {
        model: 'text-embedding-3-small'
      });
      
      // Validate performance metrics are present
      if (!result.metadata.performance_metrics) {
        throw new Error('Performance metrics not found in metadata');
      }
      
      const metrics = result.metadata.performance_metrics;
      
      if (typeof metrics.generation_time_ms !== 'number' || metrics.generation_time_ms <= 0) {
        throw new Error('Invalid generation time metric');
      }
      
      if (typeof metrics.tokens_per_second !== 'number' || metrics.tokens_per_second < 0) {
        throw new Error('Invalid tokens per second metric');
      }
      
      return {
        generation_time_ms: metrics.generation_time_ms,
        tokens_per_second: metrics.tokens_per_second,
        total_tokens: result.metadata.usage.total_tokens,
        estimated_cost: result.metadata.usage.estimated_cost
      };
    });
  }

  private printTestSummary(): void {
    console.log('\n🏁 Test Summary:');
    console.log('================================');
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => r.passed === false).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ${failed > 0 ? '❌' : ''}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Success Rate: ${(passed / this.results.length * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  • ${r.testName}: ${r.error}`));
    }
    
    console.log('\nPerformance Summary:');
    this.results.forEach(r => {
      const status = r.passed ? '✅' : '❌';
      console.log(`  ${status} ${r.testName}: ${r.duration}ms`);
    });
    
    console.log('\n🎉 Embedding system testing completed!');
  }
}

// Export the test runner
export async function runEmbeddingSystemTests(): Promise<void> {
  const tester = new EmbeddingSystemTester();
  await tester.runAllTests();
}

// Export for individual testing
export { EmbeddingSystemTester };
export type { TestResult };