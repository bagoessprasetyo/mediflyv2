import { NextRequest, NextResponse } from 'next/server';
import { diagnoseOpenAISetup, validateOpenAICredentials, testOpenAIConnection } from '@/lib/debug-openai-auth';

// GET: Diagnose OpenAI authentication setup
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting OpenAI authentication diagnosis...');
    
    // Capture console output for response
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(' ')}`);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      logs.push(`WARNING: ${args.join(' ')}`);
      originalWarn(...args);
    };
    
    try {
      // Run full diagnosis
      await diagnoseOpenAISetup();
      
      // Get credential validation
      const credentialCheck = validateOpenAICredentials();
      
      // Test connection
      const connectionTest = await testOpenAIConnection();
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      return NextResponse.json({
        success: true,
        diagnosis: {
          credentials: credentialCheck,
          connectionTest: connectionTest,
          logs: logs,
          environment: {
            hasApiKey: !!process.env.OPENAI_API_KEY,
            hasProjectId: !!process.env.OPENAI_PROJECT_ID,
            hasOrgId: !!process.env.OPENAI_ORG_ID,
            nodeEnv: process.env.NODE_ENV
          }
        },
        recommendations: connectionTest.success ? [
          'OpenAI API is working correctly!',
          'Your embedding system should work now.'
        ] : [
          'Check the error details above',
          'Verify your Project ID is correct',
          'Ensure API key has access to the project',
          'Check billing and quota settings'
        ],
        timestamp: new Date().toISOString()
      });
      
    } finally {
      // Restore console even if diagnosis fails
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
    
  } catch (error: any) {
    console.error('❌ Diagnosis failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST: Test with custom configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, projectId, organizationId, testOnly = false } = body;
    
    console.log('🧪 Testing with custom OpenAI configuration...');
    
    // Temporarily set environment variables for testing
    const originalEnv = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_PROJECT_ID: process.env.OPENAI_PROJECT_ID,
      OPENAI_ORG_ID: process.env.OPENAI_ORG_ID
    };
    
    if (apiKey) process.env.OPENAI_API_KEY = apiKey;
    if (projectId) process.env.OPENAI_PROJECT_ID = projectId;
    if (organizationId) process.env.OPENAI_ORG_ID = organizationId;
    
    try {
      // Validate new configuration
      const credentialCheck = validateOpenAICredentials();
      
      let connectionTest = null;
      if (!testOnly && credentialCheck.isValid) {
        connectionTest = await testOpenAIConnection();
      }
      
      return NextResponse.json({
        success: true,
        testConfiguration: {
          apiKeyProvided: !!apiKey,
          projectIdProvided: !!projectId,
          organizationIdProvided: !!organizationId
        },
        validation: credentialCheck,
        connectionTest: connectionTest,
        message: connectionTest?.success 
          ? 'Configuration test successful!' 
          : credentialCheck.isValid 
          ? 'Configuration valid but not tested'
          : 'Configuration has issues'
      });
      
    } finally {
      // Restore original environment
      process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY || '';
      process.env.OPENAI_PROJECT_ID = originalEnv.OPENAI_PROJECT_ID || '';
      process.env.OPENAI_ORG_ID = originalEnv.OPENAI_ORG_ID || '';
    }
    
  } catch (error: any) {
    console.error('❌ Custom configuration test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}