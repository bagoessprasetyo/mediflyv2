'use client';

import { useCallback, useRef } from 'react';
import { useTokenUsage } from '@/contexts/token-usage-context';
import { TokenTrackingRequest, ModelName, ActionType } from '@/types/usage';

interface UseTokenTrackerReturn {
  track: (request: Partial<TokenTrackingRequest> & { action_type: string }) => Promise<void>;
  trackAsync: <T>(
    asyncFn: () => Promise<T>,
    trackingData: Omit<TokenTrackingRequest, 'duration_ms' | 'success' | 'error_message'>
  ) => Promise<T>;
  trackQuery: (
    endpoint: string,
    model?: ModelName,
    tokens?: { input: number; output: number }
  ) => Promise<void>;
  trackMutation: (
    endpoint: string,
    action: ActionType,
    model?: ModelName,
    tokens?: { input: number; output: number }
  ) => Promise<void>;
  estimateTokens: (text: string) => number;
  getSessionId: () => string | null;
}

/**
 * Hook for tracking token usage across the application
 * Integrates with the TokenUsageContext to provide easy tracking methods
 */
export function useTokenTracker(): UseTokenTrackerReturn {
  const { trackUsage, currentSession } = useTokenUsage();
  const performanceRef = useRef<{ [key: string]: number }>({});

  // Estimate token count from text (rough approximation)
  const estimateTokens = useCallback((text: string): number => {
    if (!text) return 0;
    
    // Rough estimation: ~4 characters per token for English text
    // This is a simplification - real tokenization is more complex
    const charCount = text.length;
    const estimatedTokens = Math.ceil(charCount / 4);
    
    // Add some overhead for special tokens, formatting, etc.
    return Math.ceil(estimatedTokens * 1.1);
  }, []);

  // Get current session ID
  const getSessionId = useCallback(() => {
    return currentSession?.id || null;
  }, [currentSession]);

  // Basic tracking function
  const track = useCallback(async (request: Partial<TokenTrackingRequest> & { action_type: string }) => {
    const startTime = performance.now();
    
    try {
      await trackUsage({
        action_type: request.action_type,
        endpoint: request.endpoint,
        model_name: request.model_name,
        input_tokens: request.input_tokens,
        output_tokens: request.output_tokens,
        request_data: request.request_data,
        response_data: request.response_data,
        success: request.success,
        error_message: request.error_message,
        // Override duration_ms with calculated value if not provided
        duration_ms: request.duration_ms ?? Math.round(performance.now() - startTime),
      });
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  }, [trackUsage]);

  // Track async operations with automatic timing and error handling
  const trackAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    trackingData: Omit<TokenTrackingRequest, 'duration_ms' | 'success' | 'error_message'>
  ): Promise<T> => {
    const startTime = performance.now();
    const operationId = `${trackingData.action_type}_${Date.now()}`;
    
    performanceRef.current[operationId] = startTime;

    try {
      const result = await asyncFn();
      const duration = Math.round(performance.now() - startTime);
      
      await trackUsage({
        ...trackingData,
        duration_ms: duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      
      await trackUsage({
        ...trackingData,
        duration_ms: duration,
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    } finally {
      delete performanceRef.current[operationId];
    }
  }, [trackUsage]);

  // Simplified tracking for queries (read operations)
  const trackQuery = useCallback(async (
    endpoint: string,
    model: ModelName = 'supabase-query',
    tokens?: { input: number; output: number }
  ) => {
    const defaultTokens = { input: 10, output: 50 }; // Default estimation for DB queries
    const actualTokens = tokens || defaultTokens;

    await track({
      action_type: 'query',
      endpoint,
      model_name: model,
      input_tokens: actualTokens.input,
      output_tokens: actualTokens.output,
    });
  }, [track]);

  // Simplified tracking for mutations (write operations)
  const trackMutation = useCallback(async (
    endpoint: string,
    action: ActionType,
    model: ModelName = 'supabase-mutation',
    tokens?: { input: number; output: number }
  ) => {
    const defaultTokens = { input: 20, output: 30 }; // Default estimation for DB mutations
    const actualTokens = tokens || defaultTokens;

    await track({
      action_type: action,
      endpoint,
      model_name: model,
      input_tokens: actualTokens.input,
      output_tokens: actualTokens.output,
    });
  }, [track]);

  return {
    track,
    trackAsync,
    trackQuery,
    trackMutation,
    estimateTokens,
    getSessionId,
  };
}

// Helper hooks for common patterns

/**
 * Hook for tracking TanStack Query operations
 */
export function useQueryTracker() {
  const { trackQuery } = useTokenTracker();

  const trackTanStackQuery = useCallback(async (
    queryKey: readonly unknown[],
    result?: unknown,
    error?: Error
  ) => {
    const endpoint = Array.isArray(queryKey) ? queryKey.join('/') : String(queryKey);
    
    await trackQuery(
      endpoint,
      'supabase-query',
      {
        input: 5, // Minimal input for read operations
        output: result ? 25 : 5, // Estimate based on result size
      }
    );
  }, [trackQuery]);

  return { trackTanStackQuery };
}

/**
 * Hook for tracking form submissions and mutations
 */
export function useMutationTracker() {
  const { trackMutation } = useTokenTracker();

  const trackFormSubmission = useCallback(async (
    formName: string,
    formData: Record<string, unknown>,
    action: ActionType = 'create'
  ) => {
    const dataSize = JSON.stringify(formData).length;
    const estimatedTokens = Math.ceil(dataSize / 4);

    await trackMutation(
      `/forms/${formName}`,
      action,
      'supabase-mutation',
      {
        input: estimatedTokens,
        output: 10, // Minimal output for form submissions
      }
    );
  }, [trackMutation]);

  const trackApiCall = useCallback(async (
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload?: unknown
  ) => {
    const actionMap: Record<string, ActionType> = {
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const payloadSize = payload ? JSON.stringify(payload).length : 0;
    const estimatedInputTokens = Math.ceil(payloadSize / 4) + 10; // Add overhead

    await trackMutation(
      endpoint,
      actionMap[method],
      'default',
      {
        input: estimatedInputTokens,
        output: 20, // Estimated response size
      }
    );
  }, [trackMutation]);

  return {
    trackFormSubmission,
    trackApiCall,
  };
}

/**
 * Hook for tracking AI/LLM operations
 */
export function useAITracker() {
  const { track, estimateTokens } = useTokenTracker();

  const trackAICall = useCallback(async (
    prompt: string,
    response: string,
    model: ModelName = 'claude-3-sonnet',
    endpoint?: string
  ) => {
    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(response);

    await track({
      action_type: 'generation',
      endpoint: endpoint || '/ai/chat',
      model_name: model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      request_data: { prompt_length: prompt.length },
      response_data: { response_length: response.length },
    });
  }, [track, estimateTokens]);

  const trackImageGeneration = useCallback(async (
    prompt: string,
    model: ModelName = 'default',
    imageCount: number = 1
  ) => {
    const inputTokens = estimateTokens(prompt);
    // Image generation typically has minimal text output but high computational cost
    const outputTokens = imageCount * 100; // Estimated "cost" per image

    await track({
      action_type: 'generation',
      endpoint: '/ai/image',
      model_name: model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      request_data: { prompt_length: prompt.length, image_count: imageCount },
    });
  }, [track, estimateTokens]);

  return {
    trackAICall,
    trackImageGeneration,
  };
}

/**
 * Hook for tracking file operations
 */
export function useFileTracker() {
  const { track } = useTokenTracker();

  const trackFileUpload = useCallback(async (
    fileName: string,
    fileSize: number,
    fileType: string
  ) => {
    // Estimate "tokens" based on file size (for cost tracking purposes)
    const estimatedTokens = Math.ceil(fileSize / 1000); // 1 token per KB

    await track({
      action_type: 'file_upload',
      endpoint: '/files/upload',
      model_name: 'local',
      input_tokens: estimatedTokens,
      output_tokens: 5,
      request_data: { file_name: fileName, file_size: fileSize, file_type: fileType },
    });
  }, [track]);

  const trackFileProcessing = useCallback(async (
    fileName: string,
    processingType: string,
    duration: number
  ) => {
    // Estimate tokens based on processing time
    const estimatedTokens = Math.ceil(duration / 100); // 1 token per 100ms of processing

    await track({
      action_type: 'file_process',
      endpoint: `/files/process/${processingType}`,
      model_name: 'local',
      input_tokens: estimatedTokens,
      output_tokens: estimatedTokens,
      duration_ms: duration,
      request_data: { file_name: fileName, processing_type: processingType },
    });
  }, [track]);

  return {
    trackFileUpload,
    trackFileProcessing,
  };
}