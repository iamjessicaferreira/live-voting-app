'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue: T;
  onError?: (error: Error) => void;
}

export const useLocalStorage = <T>({ key, defaultValue, onError }: UseLocalStorageOptions<T>) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data from storage');
      onErrorRef.current?.(error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const updateValue = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save data to storage');
        onErrorRef.current?.(error);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove data from storage');
      onErrorRef.current?.(error);
    }
  }, [key, defaultValue]);

  return { value, setValue: updateValue, removeValue, isHydrated };
};
