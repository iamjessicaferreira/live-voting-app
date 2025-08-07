import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ContestantCard } from '@/components/ContestantCard';
import { Contestant } from '@/types';

const mockContestant: Contestant = {
  id: '1',
  name: 'Sarah Johnson',
  talent: 'Opera Singing',
  description:
    'Sarah Johnson, 28, from New York, is a classically trained soprano with a powerful voice that can reach incredible heights.',
  imageUrl: '/sarah.png',
  currentVotes: 0,
  isActive: true,
  voteHistory: [{ timestamp: Date.now(), votes: 0 }],
};

describe('Vote Button Disabling and Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  describe('Button States', () => {
    it('should enable vote button when contestant is active and show is live', () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');
      expect(voteButton).toBeEnabled();
      expect(voteButton).toHaveClass('cursor-pointer');
    });

    it('should disable vote button when contestant is inactive', () => {
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
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Not Active');
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
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voting Closed');
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });

    it('should disable vote button when not hydrated', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={false}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Loading...');
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });

    it('should disable vote button when loading', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voting...');
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });

    it('should disable vote button after voting', () => {
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
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voted');
      expect(voteButton).toBeDisabled();
      expect(voteButton).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Button Interactions', () => {
    it('should call onVote when enabled button is clicked', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });
    });

    it('should not call onVote when disabled button is clicked', () => {
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
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voted');
      fireEvent.click(voteButton);

      expect(mockOnVote).not.toHaveBeenCalled();
    });

    it('should handle keyboard interactions for enabled button', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');

      fireEvent.keyDown(voteButton, { key: 'Enter' });
      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      mockOnVote.mockClear();

      fireEvent.keyDown(voteButton, { key: ' ' });
      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner and disable button during voting', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Voting...')).toBeInTheDocument();
      expect(screen.getByText('Voting...')).toBeDisabled();
    });

    it('should center loading spinner and text', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voting...');
      expect(voteButton).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid clicks gracefully', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');

      fireEvent.click(voteButton);
      fireEvent.click(voteButton);
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      expect(mockOnVote).toHaveBeenCalled();
    });

    it('should handle vote failure gracefully', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(false);

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Vote Now');
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      expect(screen.getByText('Vote Now')).toBeEnabled();
    });

    it('should handle contestant becoming inactive after voting', () => {
      const mockOnVote = jest.fn();
      const { rerender } = render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Vote Now')).toBeEnabled();

      const inactiveContestant = { ...mockContestant, isActive: false };
      rerender(
        <ContestantCard
          contestant={inactiveContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Not Active')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for disabled state', () => {
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
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voted');
      expect(voteButton).toHaveAttribute('disabled');
    });

    it('should have proper ARIA attributes for loading state', () => {
      const mockOnVote = jest.fn();

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={true}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const voteButton = screen.getByText('Voting...');
      expect(voteButton).toHaveAttribute('disabled');
    });
  });
});
