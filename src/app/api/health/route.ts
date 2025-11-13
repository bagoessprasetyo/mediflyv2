import { NextResponse } from 'next/server';
import { HealthMonitor } from '@/lib/utils/error-monitoring';
import { getEmbeddingCacheStats } from '@/lib/services/embedding-server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const checks = await HealthMonitor.getSystemHealth();
    const cacheStats = getEmbeddingCacheStats();
    
    // Test basic Supabase connectivity
    let supabaseStatus = 'unknown';
    let databaseInfo = {};
    
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('hospitals')
        .select('count')
        .limit(1);
        
      if (error) {
        supabaseStatus = 'error';
        databaseInfo = { error: error.message };
      } else {
        supabaseStatus = 'healthy';
        databaseInfo = { connected: true };
      }
    } catch (dbError) {
      supabaseStatus = 'error';
      databaseInfo = { error: dbError instanceof Error ? dbError.message : 'Unknown database error' };
    }

    const overallStatus = checks.every(check => check.status === 'healthy') && supabaseStatus === 'healthy'
      ? 'healthy'
      : checks.some(check => check.status === 'degraded') || supabaseStatus === 'degraded'
      ? 'degraded'
      : 'unhealthy';

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: supabaseStatus,
          ...databaseInfo
        },
        openai: {
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
          cache: cacheStats
        }
      },
      checks,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || 'unknown'
    };

    return NextResponse.json(healthData, {
      status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 207 : 503
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}

// Also support POST for more detailed health checks
export async function POST() {
  return GET(); // For now, same as GET
}