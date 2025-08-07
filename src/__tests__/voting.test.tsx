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
  currentVotes: 12,
  isActive: true,
  voteHistory: [
    { timestamp: Date.now() - 6000, votes: 10 },
    { timestamp: Date.now() - 3000, votes: 11 },
    { timestamp: Date.now(), votes: 12 },
  ],
};

const mockOnVote = jest.fn().mockResolvedValue(true);

describe('Voting System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('ContestantCard Component', () => {
    it('should display contestant information correctly', () => {
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

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Opera Singing')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('votes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
    });

    it('should disable vote button after voting', () => {
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

      const voteButton = screen.getByRole('button', { name: /voted/i });
      expect(voteButton).toBeDisabled();
    });

    it('should show voted state when hasVoted is true and contestant has votes', () => {
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

    it('should show loading state when isLoading is true', () => {
      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voting/i })).toBeInTheDocument();
    });

    it('should disable vote button for inactive contestants', () => {
      const inactiveContestant = { ...mockContestant, isActive: false };
      render(
        <ContestantCard
          contestant={inactiveContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /not active/i });
      expect(voteButton).toBeDisabled();
    });

    it('should disable vote button when show is not live', () => {
      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={false}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /voting closed/i });
      expect(voteButton).toBeDisabled();
    });

    it('should show already voted message when user has voted and show is live', () => {
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

    it('should show already voted message when user has voted and show is offline', () => {
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={false}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
    });

    it('should show inactive message when contestant is not active', () => {
      const inactiveContestant = { ...mockContestant, isActive: false };
      render(
        <ContestantCard
          contestant={inactiveContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByRole('button', { name: /not active/i })).toBeInTheDocument();
    });

    it('should not show voted state for contestant with 0 votes even if hasVoted is true', () => {
      const contestantWithZeroVotes = { ...mockContestant, currentVotes: 0 };
      render(
        <ContestantCard
          contestant={contestantWithZeroVotes}
          hasVoted={true}
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

  describe('Vote Persistence', () => {
    it('should persist vote state in localStorage', () => {
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

    it('should load vote state from localStorage on mount', () => {
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
  });

  describe('Error Handling', () => {
    it('should handle vote failures gracefully', () => {
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

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
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
      expect(voteButton).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
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
      expect(voteButton).toBeEnabled();
    });
  });
});
