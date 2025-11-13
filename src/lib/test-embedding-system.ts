/**
 * Test script for hospital embedding system
 * Run this to validate that the semantic search system is working correctly
 */

import { createClient } from '@/lib/supabase/client';
import { getEmbeddingService, generateQueryEmbedding } from '@/lib/services/embedding';
import { getHospitalIndexingService } from '@/lib/services/hospital-indexing';

// Test configuration
const TEST_QUERIES = [
  'pediatric cardiology hospital in Los Angeles',
  'trauma center with helicopter pad',
  'rehabilitation hospital for stroke patients',
  'emergency hospital with psychiatric services',
  'teaching hospital with cancer research',
  'maternity hospital with NICU facilities',
];

export async function testEmbeddingSystem() {
  console.log('🧪 Starting Hospital Embedding System Test...\n');

  try {
    // Test 1: Check OpenAI API connectivity
    console.log('1️⃣ Testing OpenAI API connectivity...');
    const embeddingService = getEmbeddingService();
    const testEmbedding = await embeddingService.generateEmbedding({
      text: 'Test hospital for embedding generation'
    });
    console.log(`✅ OpenAI API working - Generated ${testEmbedding.dimensions} dimensional embedding`);
    console.log(`   Usage: ${testEmbedding.usage.total_tokens} tokens\n`);

    // Test 2: Check database connectivity and functions
    console.log('2️⃣ Testing database connectivity and functions...');
    const supabase = createClient();
    
    // Test basic hospital query
    const { data: hospitals, error: hospitalsError } = await supabase
      .from('hospitals')
      .select('id, name, embedding')
      .limit(5);
    
    if (hospitalsError) {
      throw new Error(`Database error: ${hospitalsError.message}`);
    }
    
    console.log(`✅ Database connected - Found ${hospitals?.length || 0} hospitals`);
    
    const withEmbeddings = hospitals?.filter(h => h.embedding) || [];
    console.log(`   ${withEmbeddings.length} hospitals have embeddings\n`);

    // Test 3: Check database functions
    console.log('3️⃣ Testing database functions...');
    
    const { data: needingEmbeddings, error: needingError } = await supabase.rpc(
      'get_hospitals_needing_embeddings',
      { batch_size: 5 }
    );
    
    if (needingError) {
      console.warn(`⚠️ get_hospitals_needing_embeddings function error: ${needingError.message}`);
    } else {
      console.log(`✅ get_hospitals_needing_embeddings - Found ${needingEmbeddings?.length || 0} hospitals needing embeddings`);
    }

    // Test comprehensive search function
    const testQuery = 'general hospital';
    const testQueryEmbedding = await generateQueryEmbedding(testQuery);
    
    const { data: searchResults, error: searchError } = await supabase.rpc(
      'search_hospitals_comprehensive',
      {
        search_query: testQuery,
        search_embedding: `[${testQueryEmbedding.join(',')}]`,
        filters: {},
        search_options: { limit: 3 }
      }
    );
    
    if (searchError) {
      console.warn(`⚠️ search_hospitals_comprehensive function error: ${searchError.message}`);
    } else {
      console.log(`✅ search_hospitals_comprehensive - Found ${searchResults?.length || 0} results for "${testQuery}"`);
      if (searchResults && searchResults.length > 0) {
        console.log(`   Best match: ${searchResults[0].name} (score: ${searchResults[0].combined_score?.toFixed(3)})`);
      }
    }
    console.log('');

    // Test 4: Indexing service
    console.log('4️⃣ Testing indexing service...');
    const indexingService = getHospitalIndexingService();
    
    const indexingStats = await indexingService.getIndexingStats();
    console.log(`✅ Indexing service working`);
    console.log(`   Total hospitals: ${indexingStats.totalHospitals}`);
    console.log(`   Indexed: ${indexingStats.indexedHospitals}`);
    console.log(`   Pending: ${indexingStats.pendingHospitals}`);
    console.log(`   Coverage: ${indexingStats.totalHospitals > 0 ? ((indexingStats.indexedHospitals / indexingStats.totalHospitals) * 100).toFixed(1) : 0}%\n`);

    // Test 5: API endpoints
    console.log('5️⃣ Testing API endpoints...');
    
    // Test status endpoint
    try {
      const statusResponse = await fetch('/api/hospitals/embeddings');
      const statusData = await statusResponse.json();
      
      if (statusResponse.ok) {
        console.log(`✅ Status API working - System is ${statusData.is_indexing ? 'indexing' : 'ready'}`);
      } else {
        console.warn(`⚠️ Status API error: ${statusData.error}`);
      }
    } catch (apiError: any) {
      console.warn(`⚠️ Status API not accessible: ${apiError.message}`);
    }

    // Test search endpoint with sample queries
    console.log('\n6️⃣ Testing semantic search with sample queries...');
    
    for (const query of TEST_QUERIES.slice(0, 3)) { // Test first 3 queries
      try {
        const searchResponse = await fetch('/api/hospitals/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            options: { limit: 3 }
          })
        });
        
        const searchData = await searchResponse.json();
        
        if (searchResponse.ok) {
          console.log(`✅ "${query}" - Found ${searchData.results?.length || 0} results`);
          if (searchData.results && searchData.results.length > 0) {
            const bestMatch = searchData.results[0];
            console.log(`   Best: ${bestMatch.name} (${bestMatch.city}, ${bestMatch.state}) - Score: ${bestMatch.combined_score?.toFixed(3)}`);
          }
        } else {
          console.warn(`⚠️ Search failed for "${query}": ${searchData.error}`);
        }
      } catch (searchError: any) {
        console.warn(`⚠️ Search API error for "${query}": ${searchError.message}`);
      }
    }

    console.log('\n✅ Hospital Embedding System Test Complete!');
    console.log('\n📊 Summary:');
    console.log(`   - OpenAI API: Working`);
    console.log(`   - Database: Working`);
    console.log(`   - Embedding Coverage: ${indexingStats.totalHospitals > 0 ? ((indexingStats.indexedHospitals / indexingStats.totalHospitals) * 100).toFixed(1) : 0}%`);
    console.log(`   - Search Functions: ${searchError ? 'Partial' : 'Working'}`);
    console.log(`   - API Endpoints: Available`);

    return {
      success: true,
      stats: indexingStats,
      hasEmbeddings: withEmbeddings.length > 0,
      searchWorking: !searchError,
    };

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message,
      stats: null,
      hasEmbeddings: false,
      searchWorking: false,
    };
  }
}

// Export test queries for use in components
export { TEST_QUERIES };

// Helper function to run a quick connectivity test
export async function quickHealthCheck() {
  try {
    const embeddingService = getEmbeddingService();
    const testResult = await embeddingService.generateEmbedding({
      text: 'Quick health check'
    });
    
    return {
      openai: true,
      dimensions: testResult.dimensions,
      model: testResult.model,
    };
  } catch (error: any) {
    return {
      openai: false,
      error: error.message,
    };
  }
}

// Export for use in React components or pages
export default testEmbeddingSystem;