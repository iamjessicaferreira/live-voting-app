'use client';

import { Contestant } from '@/types';
import { VoteButton } from './VoteButton';
import { TrendingIndicator } from './TrendingIndicator';
import { ContestantInfo } from './ContestantInfo';
import { ContestantImage } from './ContestantImage';

interface ContestantCardProps {
  contestant: Contestant;
  hasVoted: boolean;
  onVote: (contestantId: string) => Promise<boolean>;
  isLoading: boolean;
  isLive: boolean;
  isHydrated: boolean;
  trendingPercentage?: number | null;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  hasVoted,
  onVote,
  isLoading,
  isLive,
  isHydrated,
  trendingPercentage,
}) => {
  const shouldShowVotedState = hasVoted && contestant.currentVotes > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <ContestantImage contestant={contestant} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <ContestantInfo contestant={contestant} />

        <div className="flex items-center justify-between mb-4 mt-auto">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {contestant.currentVotes}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">votes</span>
          </div>

          <TrendingIndicator trendingPercentage={trendingPercentage} />
        </div>

        <VoteButton
          contestant={contestant}
          hasVoted={hasVoted}
          onVote={onVote}
          isLoading={isLoading}
          isLive={isLive}
          isHydrated={isHydrated}
          shouldShowVotedState={shouldShowVotedState}
        />
      </div>
    </div>
  );
};
