'use client';

import { useState, useCallback, useRef } from 'react';

interface UseAsyncOperationOptions<T, E = Error> {
  onSuccess?: (result: T) => void;
  onError?: (error: E) => void;
  onFinally?: () => void;
}

export const useAsyncOperation = <T, E = Error>(options: UseAsyncOperationOptions<T, E> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      optionsRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? (err as E) : (new Error('Operation failed, please try again.') as E);
      setError(error);
      optionsRef.current.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
      optionsRef.current.onFinally?.();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, execute, clearError };
};
