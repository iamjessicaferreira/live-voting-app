'use client';

import { useState, useCallback } from 'react';
import { Contestant, VoteHistoryEntry } from '@/types';
import { useGlobalError } from '@/components/GlobalErrorHandler';
import { usePolling } from './usePolling';

const TRENDING_INTERVAL_MS = 30000;
const POLLING_INTERVAL_MS = 3000;
const VOTE_PROBABILITY = 0.3;
const MAX_VOTE_INCREMENT = 3;

interface UseLiveVotesOptions {
  initialContestants: Contestant[];
}

export const useLiveVotes = ({ initialContestants }: UseLiveVotesOptions) => {
  const [contestants, setContestants] = useState<Contestant[]>(initialContestants);
  const [isLive, setIsLive] = useState(true);
  const { showError } = useGlobalError();

  const updateVoteHistory = useCallback(
    (contestant: Contestant, newVoteCount: number): VoteHistoryEntry[] => {
      const now = Date.now();
      const history = contestant.voteHistory || [];

      const updatedHistory = [...history, { timestamp: now, votes: newVoteCount }].filter(
        (entry) => now - entry.timestamp <= TRENDING_INTERVAL_MS,
      );

      return updatedHistory;
    },
    [],
  );

  const calculateVoteIncrement = useCallback((): number => {
    const shouldReceiveVote = Math.random() < VOTE_PROBABILITY;
    return shouldReceiveVote ? Math.floor(Math.random() * MAX_VOTE_INCREMENT) + 1 : 0;
  }, []);

  const updateContestantVotes = useCallback(
    (contestant: Contestant): Contestant => {
      if (!contestant.isActive) return contestant;

      const voteIncrement = calculateVoteIncrement();
      const newVoteCount = contestant.currentVotes + voteIncrement;
      const updatedHistory = updateVoteHistory(contestant, newVoteCount);

      return {
        ...contestant,
        currentVotes: newVoteCount,
        voteHistory: updatedHistory,
      };
    },
    [calculateVoteIncrement, updateVoteHistory],
  );

  const calculateTrendingPercentage = useCallback((contestant: Contestant): number | null => {
    if (!contestant.voteHistory || contestant.voteHistory.length < 2) {
      return null;
    }

    const now = Date.now();
    const recentHistory = contestant.voteHistory.filter(
      (entry) => now - entry.timestamp <= TRENDING_INTERVAL_MS,
    );

    if (recentHistory.length < 2) {
      return null;
    }

    const oldestEntry = recentHistory[0];
    const newestEntry = recentHistory[recentHistory.length - 1];

    const votesNow = newestEntry.votes;
    const votesTSecondsAgo = oldestEntry.votes;
    const maxVotesTSecondsAgo = Math.max(votesTSecondsAgo, 1);

    const trendingPercentage = ((votesNow - votesTSecondsAgo) / maxVotesTSecondsAgo) * 100;

    return Math.round(trendingPercentage);
  }, []);

  const simulateVoteUpdate = useCallback(() => {
    try {
      setContestants((prevContestants) => {
        return prevContestants.map(updateContestantVotes);
      });
    } catch {
      showError({
        message: 'Unable to update live votes. Please refresh the page.',
        type: 'server',
      });
    }
  }, [updateContestantVotes, showError]);

  const { isPolling } = usePolling({
    interval: POLLING_INTERVAL_MS,
    enabled: isLive,
    onPoll: simulateVoteUpdate,
    onError: () => {
      showError({
        message: 'Live updates temporarily unavailable. Please refresh the page.',
        type: 'network',
      });
    },
  });

  const toggleLiveUpdates = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  const resetVotes = useCallback(() => {
    setContestants(initialContestants);
  }, [initialContestants]);

  const addVote = useCallback(
    (contestantId: string) => {
      setContestants((prevContestants) => {
        return prevContestants.map((contestant) => {
          if (contestant.id === contestantId) {
            const newVoteCount = contestant.currentVotes + 1;
            const updatedHistory = updateVoteHistory(contestant, newVoteCount);
            return {
              ...contestant,
              currentVotes: newVoteCount,
              voteHistory: updatedHistory,
            };
          }
          return contestant;
        });
      });
    },
    [updateVoteHistory],
  );

  return {
    contestants,
    isLive,
    toggleLiveUpdates,
    resetVotes,
    addVote,
    calculateTrendingPercentage,
    isPolling,
  };
};
