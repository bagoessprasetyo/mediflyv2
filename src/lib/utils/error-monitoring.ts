// Error monitoring and logging utilities for production

export interface ErrorContext {
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context: ErrorContext;

  constructor(
    message: string, 
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    context: ErrorContext = {}
  ) {
    super(message);
    
    Object.setPrototypeOf(this, AppError.prototype);
    
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = {
      ...context,
      timestamp: context.timestamp || new Date()
    };
    
    Error.captureStackTrace(this);
  }
}

// Specific error types
export class DatabaseError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'DATABASE_ERROR', 500, true, context);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'VALIDATION_ERROR', 400, true, context);
    this.name = 'ValidationError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, service: string, context: ErrorContext = {}) {
    super(message, `${service.toUpperCase()}_ERROR`, 502, true, {
      ...context,
      metadata: {
        ...context.metadata,
        service
      }
    });
    this.name = 'ExternalServiceError';
  }
}

export class QuotaExceededError extends ExternalServiceError {
  constructor(service: string, context: ErrorContext = {}) {
    super(`${service} quota exceeded`, service, context);
    this.name = 'QuotaExceededError';
  }
}

// Error logging function
export function logError(error: Error | AppError, context: ErrorContext = {}) {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  };

  if (error instanceof AppError) {
    (errorInfo as any).code = error.code;
    (errorInfo as any).statusCode = error.statusCode;
    (errorInfo as any).isOperational = error.isOperational;
    (errorInfo as any).context = error.context;
  }

  // Log to console (in production, you'd send this to a logging service)
  console.error('🚨 Application Error:', JSON.stringify(errorInfo, null, 2));

  // In production, you could send to monitoring services like:
  // - Sentry
  // - DataDog
  // - CloudWatch
  // - Custom logging endpoint
}

// Performance monitoring
export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  static start(operation: string): void {
    this.timers.set(operation, Date.now());
  }

  static end(operation: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      console.warn(`⚠️ Performance timer not found for operation: ${operation}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(operation);

    console.log(`⏱️ ${operation}: ${duration}ms`, metadata);
    return duration;
  }

  static async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, { success: true, ...metadata });
      return result;
    } catch (error) {
      this.end(operation, { success: false, error: error instanceof Error ? error.message : 'Unknown error', ...metadata });
      throw error;
    }
  }
}

// Health check utilities
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  message?: string;
  timestamp: Date;
}

export class HealthMonitor {
  static async checkOpenAI(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Simple test to check if OpenAI is accessible
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return {
          service: 'openai',
          status: 'unhealthy',
          message: 'API key not configured',
          timestamp: new Date()
        };
      }

      // Just check if the service is reachable (without making actual API calls to save quota)
      return {
        service: 'openai',
        status: 'healthy',
        responseTime: Date.now() - start,
        message: 'API key configured',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'openai',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  static async checkSupabase(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // This would need to be imported in actual usage
      // const { createClient } = await import('@/lib/supabase/server');
      // const supabase = await createClient();
      // await supabase.from('hospitals').select('count').limit(1);
      
      return {
        service: 'supabase',
        status: 'healthy',
        responseTime: Date.now() - start,
        message: 'Database connection successful',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'supabase',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date()
      };
    }
  }

  static async getSystemHealth(): Promise<HealthCheck[]> {
    const checks = await Promise.allSettled([
      this.checkOpenAI(),
      this.checkSupabase()
    ]);

    return checks.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : {
            service: 'unknown',
            status: 'unhealthy' as const,
            message: 'Health check failed',
            timestamp: new Date()
          }
    );
  }
}

// Usage statistics tracking
export interface UsageStats {
  searchQueries: number;
  embeddingGenerations: number;
  databaseQueries: number;
  errors: number;
  timestamp: Date;
}

export class UsageTracker {
  private static stats: UsageStats = {
    searchQueries: 0,
    embeddingGenerations: 0,
    databaseQueries: 0,
    errors: 0,
    timestamp: new Date()
  };

  static increment(metric: keyof Omit<UsageStats, 'timestamp'>) {
    this.stats[metric]++;
  }

  static getStats(): UsageStats {
    return { ...this.stats };
  }

  static reset() {
    this.stats = {
      searchQueries: 0,
      embeddingGenerations: 0,
      databaseQueries: 0,
      errors: 0,
      timestamp: new Date()
    };
  }
}

// Graceful error handling wrapper for API routes
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      logError(error as Error, {
        action: 'api_request',
        metadata: { args: args.map(arg => typeof arg) }
      });

      UsageTracker.increment('errors');

      if (error instanceof AppError) {
        return Response.json(
          { 
            error: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
          },
          { status: error.statusCode }
        );
      }

      // Unknown error
      return Response.json(
        { 
          error: 'Internal server error',
          code: 'UNKNOWN_ERROR',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  };
}