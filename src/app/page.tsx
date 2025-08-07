'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TheaterComedy } from '@mui/icons-material';
import { Header } from '@/components/Header';
import { ContestantCard } from '@/components/ContestantCard';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { useVoting } from '@/hooks/useVoting';
import { useLiveVotes } from '@/hooks/useLiveVotes';
import { initialContestants } from '@/data/contestants';
import { useMemo } from 'react';
import { GlobalErrorProvider } from '@/components/GlobalErrorHandler';

export default function Home() {
  const {
    contestants,
    isLive,
    toggleLiveUpdates,
    resetVotes: resetLiveVotes,
    addVote,
    calculateTrendingPercentage,
  } = useLiveVotes({ initialContestants });

  const {
    hasVotedFor,
    castVote,
    error,
    clearError,
    isLoadingFor,
    resetVotes: resetUserVotes,
    isHydrated,
  } = useVoting({
    contestants,
    onVoteSuccess: addVote,
    isLive,
  });

  const totalVoteCount = useMemo(() => {
    return contestants.reduce((sum, contestant) => sum + contestant.currentVotes, 0);
  }, [contestants]);

  const activeContestantCount = useMemo(() => {
    return contestants.filter((contestant) => contestant.isActive).length;
  }, [contestants]);

  const handleResetAllVotes = () => {
    resetLiveVotes();
    resetUserVotes();
  };

  const renderContestantCards = () => {
    return contestants.map((contestant) => (
      <ContestantCard
        key={contestant.id}
        contestant={contestant}
        hasVoted={hasVotedFor(contestant.id)}
        onVote={castVote}
        isLoading={isLoadingFor(contestant.id)}
        isLive={isLive}
        isHydrated={isHydrated}
        trendingPercentage={calculateTrendingPercentage(contestant)}
      />
    ));
  };

  const renderEmptyState = () => (
    <div className="text-center py-8 sm:py-12">
      <div className="mb-4">
        <TheaterComedy className="text-6xl sm:text-8xl text-purple-600 mx-auto" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        No contestants available
      </h3>
      <p className="text-sm sm:text-base text-gray-600">
        Check back later for more talent show contestants!
      </p>
    </div>
  );

  return (
    <ErrorBoundary>
      <GlobalErrorProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            isLive={isLive}
            onToggleLive={toggleLiveUpdates}
            onResetVotes={handleResetAllVotes}
            totalVotes={totalVoteCount}
            activeContestants={activeContestantCount}
          />

          <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Help your favorite performer to win
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Right now, amazing vocals, stunning dance moves, and jaw-dropping magic are lighting
                up the stage, so pick your favorite act and cast your vote to send them to victory!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contestants.length > 0 ? renderContestantCards() : renderEmptyState()}
            </div>

            {error && <ErrorDisplay error={error} onClear={clearError} />}
          </main>
        </div>
      </GlobalErrorProvider>
    </ErrorBoundary>
  );
}
