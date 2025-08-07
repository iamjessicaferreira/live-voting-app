'use client';

import { Contestant } from '@/types';
import { HowToVote, CheckCircle } from '@mui/icons-material';

interface VoteButtonProps {
  contestant: Contestant;
  hasVoted: boolean;
  onVote: (contestantId: string) => Promise<boolean>;
  isLoading: boolean;
  isLive: boolean;
  isHydrated: boolean;
  shouldShowVotedState: boolean;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  contestant,
  hasVoted,
  onVote,
  isLoading,
  isLive,
  isHydrated,
  shouldShowVotedState,
}) => {
  const handleVote = async () => {
    if (hasVoted || isLoading || !contestant.isActive || !isLive) return;
    await onVote(contestant.id);
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      await handleVote();
    }
  };

  const getButtonState = () => {
    if (!isHydrated)
      return { text: 'Loading...', className: 'bg-gray-100 text-gray-400 cursor-not-allowed' };
    if (shouldShowVotedState)
      return { text: 'Voted', className: 'bg-green-100 text-green-700 cursor-not-allowed' };
    if (isLoading)
      return { text: 'Voting...', className: 'bg-blue-100 text-blue-700 cursor-not-allowed' };
    if (!contestant.isActive)
      return { text: 'Not Active', className: 'bg-gray-100 text-gray-400 cursor-not-allowed' };
    if (!isLive)
      return { text: 'Voting Closed', className: 'bg-gray-100 text-gray-400 cursor-not-allowed' };
    return {
      text: 'Vote Now',
      className: 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer',
    };
  };

  const getButtonContent = () => {
    const state = getButtonState();

    if (state.text === 'Loading...') return state.text;
    if (state.text === 'Voted')
      return (
        <>
          <CheckCircle className="mr-2 text-green-600" />
          Voted
        </>
      );
    if (state.text === 'Voting...')
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          Voting...
        </>
      );
    if (state.text === 'Vote Now')
      return (
        <>
          <HowToVote className="mr-2" />
          Vote Now
        </>
      );
    return state.text;
  };

  const state = getButtonState();

  return (
    <>
      <button
        onClick={handleVote}
        onKeyDown={handleKeyDown}
        disabled={
          !isHydrated || shouldShowVotedState || isLoading || !contestant.isActive || !isLive
        }
        className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 flex items-center justify-center ${state.className}`}
      >
        {getButtonContent()}
      </button>

      {shouldShowVotedState && contestant.isActive && (
        <p className="mt-2 text-xs text-green-700 text-center" data-testid="already-voted-msg">
          You have already voted for this contestant.
        </p>
      )}
      {!hasVoted && !isLive && contestant.isActive && (
        <p className="mt-2 text-xs text-gray-500 text-center" data-testid="vote-closed-msg">
          Voting is closed. You can only vote when the show is live.
        </p>
      )}
      {!contestant.isActive && (
        <p className="mt-2 text-xs text-gray-400 text-center" data-testid="inactive-msg">
          This contestant is not active.
        </p>
      )}
    </>
  );
};
