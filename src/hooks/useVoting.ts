'use client';

import { useCallback, useState } from 'react';
import { Contestant, VoteState, VotingError } from '@/types';
import { simulateVoteApi } from '@/utils/api';
import { VoteValidator } from '@/utils/validation';
import { useGlobalError } from '@/components/GlobalErrorHandler';
import { useLocalStorage } from './useLocalStorage';
import { useAsyncOperation } from './useAsyncOperation';

const VOTE_STORAGE_KEY = 'talent-show-votes';

interface UseVotingOptions {
  contestants: Contestant[];
  onVoteSuccess?: (contestantId: string) => void;
  isLive?: boolean;
}

export const useVoting = ({ contestants, onVoteSuccess, isLive = true }: UseVotingOptions) => {
  const { showError } = useGlobalError();
  const [loadingMap, setLoadingMap] = useState<{ [contestantId: string]: boolean }>({});

  const {
    value: voteState,
    setValue: setVoteState,
    removeValue: clearVoteState,
    isHydrated,
  } = useLocalStorage<VoteState>({
    key: VOTE_STORAGE_KEY,
    defaultValue: {},
    onError: (error) => {
      if (error && error.message) {
        showError({
          message: 'Unable to save your vote. Please try again.',
          type: 'storage',
        });
      }
    },
  });

  const { error, execute, clearError } = useAsyncOperation<VoteState, VotingError>({
    onSuccess: () => {
      // success is handled in the execute function
    },
    onError: (error) => {
      if (error && error.message) {
        const apiErrorType = error.type === 'duplicate' ? 'validation' : error.type;
        showError({
          message: error.message,
          type: apiErrorType,
        });
      }
    },
  });

  const cleanupStaleVotes = useCallback(() => {
    const cleanedVoteState: VoteState = {};

    Object.keys(voteState).forEach((contestantId) => {
      const contestant = contestants.find((c) => c.id === contestantId);
      if (contestant && contestant.currentVotes > 0) {
        cleanedVoteState[contestantId] = voteState[contestantId];
      }
    });

    if (Object.keys(cleanedVoteState).length !== Object.keys(voteState).length) {
      setVoteState(cleanedVoteState);
    }
  }, [voteState, contestants, setVoteState]);

  const hasVotedFor = useCallback(
    (contestantId: string) => {
      if (!isHydrated) {
        return false;
      }

      const contestant = contestants.find((c) => c.id === contestantId);
      if (!contestant || contestant.currentVotes === 0) {
        return false;
      }

      return voteState[contestantId] === true;
    },
    [voteState, isHydrated, contestants],
  );

  const castVote = useCallback(
    async (contestantId: string): Promise<boolean> => {
      const validation = VoteValidator.validateCompleteVote(
        contestantId,
        contestants,
        hasVotedFor,
        isLive,
        isHydrated,
      );

      if (!validation.isValid) {
        if (validation.error && validation.error.message) {
          showError({
            message: validation.error.message,
            type: validation.error.type === 'duplicate' ? 'validation' : validation.error.type,
          });
        }
        return false;
      }

      setLoadingMap((prev) => ({ ...prev, [contestantId]: true }));

      try {
        const result = await execute(async () => {
          const apiResponse = await simulateVoteApi(contestantId);

          if (apiResponse.error) {
            throw {
              message: apiResponse.error.message,
              type: apiResponse.error.type,
            } as VotingError;
          }

          const newVoteState = { ...voteState, [contestantId]: true };
          setVoteState(newVoteState);
          onVoteSuccess?.(contestantId);

          return newVoteState;
        });

        return result !== null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        showError({
          message: errorMessage,
          type: 'server',
        });
        return false;
      } finally {
        setLoadingMap((prev) => ({ ...prev, [contestantId]: false }));
      }
    },
    [
      execute,
      voteState,
      setVoteState,
      onVoteSuccess,
      contestants,
      hasVotedFor,
      isLive,
      isHydrated,
      showError,
    ],
  );

  const resetVotes = useCallback(() => {
    clearVoteState();
    clearError();
  }, [clearVoteState, clearError]);

  const isLoadingFor = useCallback(
    (contestantId: string) => !!loadingMap[contestantId],
    [loadingMap],
  );

  return {
    hasVotedFor,
    castVote,
    error,
    clearError,
    isLoadingFor,
    resetVotes,
    isHydrated,
    cleanupStaleVotes,
  };
};
