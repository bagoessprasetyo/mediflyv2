/**
 * OpenAI Authentication Debugging Utilities
 * Use this to diagnose and fix quota/authentication issues
 */

import { 
  validateOpenAICredentials, 
  testOpenAIConnection 
} from './services/embedding-server';

// Comprehensive diagnostic function
export async function diagnoseOpenAISetup(): Promise<void> {
  console.log('🔍 OpenAI Authentication Diagnostic Tool');
  console.log('========================================');
  
  // Step 1: Check environment variables
  console.log('\n📋 Step 1: Environment Variables Check');
  const credentials = validateOpenAICredentials();
  
  if (credentials.isValid) {
    console.log('✅ All required credentials are configured');
  } else {
    console.log('❌ Credential issues found:');
    credentials.issues.forEach(issue => console.log(`  • ${issue}`));
    
    console.log('\n💡 Recommendations:');
    credentials.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  // Step 2: Display current configuration
  console.log('\n🔧 Step 2: Current Configuration');
  console.log('Environment variables found:');
  console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  OPENAI_PROJECT_ID: ${process.env.OPENAI_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`  OPENAI_ORG_ID: ${process.env.OPENAI_ORG_ID ? '✅ Set' : '❌ Missing'}`);
  
  if (process.env.OPENAI_API_KEY) {
    const key = process.env.OPENAI_API_KEY;
    console.log(`  API Key format: ${key.slice(0, 7)}... (${key.length} chars)`);
  }
  
  if (process.env.OPENAI_PROJECT_ID) {
    console.log(`  Project ID: ${process.env.OPENAI_PROJECT_ID}`);
  }
  
  // Step 3: Test API connection
  if (credentials.isValid) {
    console.log('\n🌐 Step 3: Testing API Connection');
    const connectionTest = await testOpenAIConnection();
    
    if (connectionTest.success) {
      console.log('✅ OpenAI API connection successful!');
      console.log('Response details:', connectionTest.details);
    } else {
      console.log('❌ OpenAI API connection failed');
      console.log('Error:', connectionTest.error);
      console.log('Details:', JSON.stringify(connectionTest.details, null, 2));
      
      // Provide specific guidance based on error type
      if (connectionTest.details?.status === 429) {
        console.log('\n🚨 QUOTA ERROR DETECTED');
        console.log('This is likely due to one of these issues:');
        console.log('1. Missing or incorrect Project ID');
        console.log('2. API key not associated with the correct project');
        console.log('3. Billing issues (despite having credits)');
        console.log('4. Rate limits on the specific project');
        
        console.log('\n🛠️  SOLUTION STEPS:');
        console.log('1. Get your Project ID from: https://platform.openai.com/settings/organization/projects');
        console.log('2. Set OPENAI_PROJECT_ID environment variable');
        console.log('3. Ensure your API key has access to this project');
        console.log('4. Verify project billing settings');
      }
    }
  } else {
    console.log('\n⏭️  Skipping API test due to credential issues');
  }
  
  // Step 4: Environment setup guidance
  console.log('\n📝 Step 4: Environment Setup Instructions');
  console.log('Add these to your .env.local file:');
  console.log('');
  console.log('# Required for OpenAI API');
  console.log('OPENAI_API_KEY=sk-your-api-key-here');
  console.log('');
  console.log('# Required for newer OpenAI accounts (recommended)');
  console.log('OPENAI_PROJECT_ID=proj_your-project-id-here');
  console.log('');
  console.log('# Optional: if you\'re part of an organization');
  console.log('OPENAI_ORG_ID=org-your-org-id-here');
  console.log('');
  
  console.log('🔗 Get your credentials from:');
  console.log('  • API Keys: https://platform.openai.com/api-keys');
  console.log('  • Project ID: https://platform.openai.com/settings/organization/projects');
  console.log('  • Organization: https://platform.openai.com/account/organization');
}

// Quick test function for specific configuration
export async function quickTestWithConfig(config: {
  apiKey?: string;
  projectId?: string;
  organizationId?: string;
}): Promise<void> {
  console.log('🧪 Quick Test with Custom Configuration');
  console.log('=====================================');
  
  // Temporarily override environment
  const originalEnv = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID,
    OPENAI_ORG_ID: process.env.OPENAI_ORG_ID
  };
  
  if (config.apiKey) process.env.OPENAI_API_KEY = config.apiKey;
  if (config.projectId) process.env.OPENAI_PROJECT_ID = config.projectId;
  if (config.organizationId) process.env.OPENAI_ORG_ID = config.organizationId;
  
  try {
    await diagnoseOpenAISetup();
  } finally {
    // Restore original environment
    process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY || '';
    process.env.OPENAI_PROJECT_ID = originalEnv.OPENAI_PROJECT_ID || '';
    process.env.OPENAI_ORG_ID = originalEnv.OPENAI_ORG_ID || '';
  }
}

// Compare with working curl command
export function generateWorkingCurlExample(): void {
  console.log('🔄 Working cURL Command Example');
  console.log('===============================');
  console.log('');
  console.log('Test your credentials directly with this command:');
  console.log('');
  
  const apiKey = process.env.OPENAI_API_KEY || 'your-api-key';
  const projectId = process.env.OPENAI_PROJECT_ID;
  
  let curlCmd = `curl https://api.openai.com/v1/embeddings \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`;
  
  if (projectId) {
    curlCmd += ` \\
  -H "OpenAI-Project: ${projectId}"`;
  }
  
  curlCmd += ` \\
  -d '{
    "input": "test connection",
    "model": "text-embedding-3-small",
    "dimensions": 512
  }'`;
  
  console.log(curlCmd);
  console.log('');
  console.log('If this works but the app doesn\'t, compare the headers and configuration.');
}

// Export for use in API routes or debugging
export { validateOpenAICredentials, testOpenAIConnection };