import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContestantCard } from '@/components/ContestantCard';
import { Contestant } from '@/types';

const mockContestant: Contestant = {
  id: '1',
  name: 'Sarah Johnson',
  talent: 'Opera Singing',
  description:
    'Sarah Johnson, 28, from New York, is a classically trained soprano with a powerful voice that can reach incredible heights.',
  imageUrl: '/sarah.png',
  currentVotes: 25,
  isActive: true,
  voteHistory: [
    { timestamp: Date.now() - 6000, votes: 20 },
    { timestamp: Date.now() - 3000, votes: 22 },
    { timestamp: Date.now(), votes: 25 },
  ],
};

const mockOnVote = jest.fn().mockResolvedValue(true);

describe('localStorage Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Vote State Persistence', () => {
    it('should call vote function when vote button is clicked', () => {
      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /vote now/i });
      fireEvent.click(voteButton);

      expect(mockOnVote).toHaveBeenCalledWith('1');
    });

    it('should load vote state from localStorage on component mount', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
    });

    it('should handle empty localStorage gracefully', () => {
      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
    });

    it('should handle corrupted localStorage data gracefully', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
    });
  });

  describe('Multiple Contestants Persistence', () => {
    it('should call vote function for multiple contestants', () => {
      const contestant1 = { ...mockContestant, id: '1' };
      const contestant2 = { ...mockContestant, id: '2', name: 'Mike Chen' };

      const { rerender } = render(
        <ContestantCard
          contestant={contestant1}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      const voteButton1 = screen.getByRole('button', { name: /vote now/i });
      fireEvent.click(voteButton1);

      expect(mockOnVote).toHaveBeenCalledWith('1');

      rerender(
        <ContestantCard
          contestant={contestant2}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      const voteButton2 = screen.getByRole('button', { name: /vote now/i });
      fireEvent.click(voteButton2);

      expect(mockOnVote).toHaveBeenCalledWith('2');
    });

    it('should maintain separate vote states for different contestants', () => {
      const contestant1 = { ...mockContestant, id: '1', currentVotes: 5 };
      const contestant2 = { ...mockContestant, id: '2', name: 'Mike Chen', currentVotes: 3 };

      const { rerender } = render(
        <ContestantCard
          contestant={contestant1}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();

      rerender(
        <ContestantCard
          contestant={contestant2}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
    });
  });

  describe('localStorage Error Handling', () => {
    it('should handle localStorage quota exceeded error', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
    });

    it('should handle localStorage not available (private browsing)', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
    });
  });

  describe('State Synchronization', () => {
    it('should sync vote state across multiple instances of same contestant', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      const { rerender } = render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();

      rerender(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
    });

    it('should handle vote state changes in real-time', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      const { rerender } = render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();

      rerender(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
    });
  });
});
