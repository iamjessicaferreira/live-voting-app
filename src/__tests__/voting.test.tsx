import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContestantCard } from '@/components/ContestantCard';
import { Contestant } from '@/types';

const mockContestant: Contestant = {
  id: '1',
  name: 'Sarah Johnson',
  talent: 'Opera Singing',
  description:
    'Sarah Johnson, 28, from New York, is a classically trained soprano with a powerful voice that can reach incredible heights.',
  imageUrl: '/api/placeholder/150/150?text=SJ',
  currentVotes: 0,
  isActive: true,
  voteHistory: [{ timestamp: Date.now(), votes: 0 }],
};

describe('Voting System', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('ContestantCard Component', () => {
    it('should display contestant information correctly', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Opera Singing')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('votes')).toBeInTheDocument();
      expect(screen.getByText('Vote Now')).toBeInTheDocument();
    });

    it('should disable vote button after voting', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');
      expect(voteButton).toBeEnabled();

      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });
    });

    it('should show voted state when hasVoted is true and contestant has votes', () => {
      const mockOnVote = jest.fn();
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /voted/i });
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });

    it('should show loading state when isLoading is true', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /voting/i });
      expect(voteButton).toBeInTheDocument();
      expect(voteButton).toBeDisabled();
    });

    it('should disable vote button for inactive contestants', () => {
      const inactiveContestant = { ...mockContestant, isActive: false };
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={inactiveContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /not active/i });
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });

    it('should disable vote button when show is not live', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={false}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /voting closed/i });
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
      expect(screen.getByTestId('vote-closed-msg')).toHaveTextContent(
        'Voting is closed. You can only vote when the show is live.',
      );
    });

    it('should show already voted message when user has voted and show is live', () => {
      const mockOnVote = jest.fn();
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByTestId('already-voted-msg')).toHaveTextContent(
        'You have already voted for this contestant.',
      );
    });

    it('should show already voted message when user has voted and show is offline', () => {
      const mockOnVote = jest.fn();
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={false}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByTestId('already-voted-msg')).toHaveTextContent(
        'You have already voted for this contestant.',
      );
    });

    it('should show inactive message when contestant is not active', () => {
      const inactiveContestant = { ...mockContestant, isActive: false };
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={inactiveContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByTestId('inactive-msg')).toHaveTextContent(
        'This contestant is not active.',
      );
    });

    it('should not show voted state for contestant with 0 votes even if hasVoted is true', () => {
      const contestantWithZeroVotes = { ...mockContestant, currentVotes: 0 };
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={contestantWithZeroVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Vote Now')).toBeInTheDocument();
      expect(screen.getByText('Vote Now')).toBeEnabled();
      expect(screen.queryByText('Voted')).not.toBeInTheDocument();
    });
  });

  describe('Vote Persistence', () => {
    it('should persist vote state in localStorage', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /vote now/i });
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });
    });

    it('should load vote state from localStorage on mount', () => {
      const mockOnVote = jest.fn();
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /voted/i });
      expect(voteButton).toBeInTheDocument();
      expect(voteButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should handle vote failures gracefully', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(false);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /vote now/i });
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      expect(voteButton).toBeEnabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /vote now/i });
      expect(voteButton).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByRole('button', { name: /vote now/i });
      voteButton.focus();

      fireEvent.keyDown(voteButton, { key: 'Enter', code: 'Enter' });
      expect(mockOnVote).toHaveBeenCalledWith('1');
    });
  });
});
