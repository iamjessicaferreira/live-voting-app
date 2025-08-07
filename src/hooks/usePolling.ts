'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  interval: number;
  enabled: boolean;
  onPoll: () => void | Promise<void>;
  onError?: (error: Error) => void;
}

export const usePolling = ({ interval, enabled, onPoll, onError }: UsePollingOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const onPollRef = useRef(onPoll);
  const onErrorRef = useRef(onError);

  onPollRef.current = onPoll;
  onErrorRef.current = onError;

  const startPolling = useCallback(() => {
    if (intervalRef.current || isPollingRef.current) return;

    const poll = async () => {
      if (!enabled) return;

      isPollingRef.current = true;
      try {
        await onPollRef.current();
      } catch (error) {
        onErrorRef.current?.(error as Error);
      } finally {
        isPollingRef.current = false;
      }
    };

    poll();

    intervalRef.current = setInterval(poll, interval);
  }, [interval, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    isPolling: isPollingRef.current,
    startPolling,
    stopPolling,
  };
};
