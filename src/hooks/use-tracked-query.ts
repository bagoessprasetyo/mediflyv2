'use client';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useQueryTracker, useMutationTracker } from '@/hooks/use-token-tracker';
import { useCallback, useEffect } from 'react';

/**
 * Enhanced useQuery with automatic token usage tracking
 */
export function useTrackedQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  options: UseQueryOptions<TQueryFnData, TError, TData> & {
    trackingEndpoint?: string;
  }
) {
  const { trackTanStackQuery } = useQueryTracker();
  const { queryKey, queryFn, trackingEndpoint, ...restOptions } = options;

  // Wrap the query function to track token usage
  const trackedQueryFn = useCallback(async (context: any) => {
    if (!queryFn || typeof queryFn !== 'function') return undefined;

    const startTime = performance.now();
    let result;
    let error;

    try {
      result = await (queryFn as any)(context);
      return result;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      // Track the query regardless of success/failure
      try {
        await trackTanStackQuery(queryKey, result, error as Error);
      } catch (trackingError) {
        console.warn('Failed to track query usage:', trackingError);
      }
    }
  }, [queryFn, queryKey, trackTanStackQuery]);

  return useQuery({
    ...restOptions,
    queryKey,
    queryFn: trackedQueryFn,
  });
}

/**
 * Enhanced useMutation with automatic token usage tracking
 */
export function useTrackedMutation<TData = unknown, TError = unknown, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables> & {
    trackingEndpoint?: string;
    trackingAction?: string;
  }
) {
  const { trackApiCall } = useMutationTracker();
  const { mutationFn, trackingEndpoint = '/api/mutation', trackingAction = 'POST', ...restOptions } = options;

  // Wrap the mutation function to track token usage
  const trackedMutationFn = useCallback(async (variables: TVariables) => {
    if (!mutationFn || typeof mutationFn !== 'function') return undefined;

    let result;
    let error;

    try {
      result = await (mutationFn as any)(variables);
      return result;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      // Track the mutation regardless of success/failure
      try {
        await trackApiCall(
          trackingEndpoint,
          trackingAction as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          variables
        );
      } catch (trackingError) {
        console.warn('Failed to track mutation usage:', trackingError);
      }
    }
  }, [mutationFn, trackingEndpoint, trackingAction, trackApiCall]);

  return useMutation({
    ...restOptions,
    mutationFn: trackedMutationFn,
  });
}

/**
 * Higher-order function to wrap existing query hooks with tracking
 */
export function withQueryTracking<T extends (...args: any[]) => any>(
  queryHook: T,
  endpoint?: string
): T {
  return ((...args: Parameters<T>) => {
    const result = queryHook(...args);
    const { trackTanStackQuery } = useQueryTracker();

    // Track on data change
    useEffect(() => {
      if (result.data || result.error) {
        const queryKey = result.queryKey || ['unknown'];
        trackTanStackQuery(queryKey, result.data, result.error).catch(err => 
          console.warn('Failed to track query:', err)
        );
      }
    }, [result.data, result.error, result.queryKey, trackTanStackQuery]);

    return result;
  }) as T;
}

/**
 * Higher-order function to wrap existing mutation hooks with tracking
 */
export function withMutationTracking<T extends (...args: any[]) => any>(
  mutationHook: T,
  endpoint?: string,
  action?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
): T {
  return ((...args: Parameters<T>) => {
    const result = mutationHook(...args);
    const { trackApiCall } = useMutationTracker();

    // Wrap the mutate function to add tracking
    const originalMutate = result.mutate;
    const originalMutateAsync = result.mutateAsync;

    const trackedMutate = useCallback((variables: any, options?: any) => {
      // Track before mutation
      trackApiCall(
        endpoint || '/api/mutation',
        action || 'POST',
        variables
      ).catch(err => console.warn('Failed to track mutation:', err));

      return originalMutate(variables, options);
    }, [originalMutate]);

    const trackedMutateAsync = useCallback(async (variables: any, options?: any) => {
      // Track before mutation
      await trackApiCall(
        endpoint || '/api/mutation',
        action || 'POST',
        variables
      ).catch(err => console.warn('Failed to track mutation:', err));

      return originalMutateAsync(variables, options);
    }, [originalMutateAsync]);

    return {
      ...result,
      mutate: trackedMutate,
      mutateAsync: trackedMutateAsync,
    };
  }) as T;
}