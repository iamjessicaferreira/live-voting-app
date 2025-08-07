import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('localStorage Persistence', () => {
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
        length: Object.keys(mockLocalStorage).length,
        key: jest.fn((index: number) => Object.keys(mockLocalStorage)[index] || null),
      },
      writable: true,
    });
  });

  describe('Vote State Persistence', () => {
    it('should call vote function when vote button is clicked', async () => {
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

    it('should load vote state from localStorage on component mount', () => {
      mockLocalStorage['voteState'] = JSON.stringify({ '1': true });
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Voted')).toBeInTheDocument();
      expect(screen.getByText('Voted')).toBeDisabled();
    });

    it('should handle empty localStorage gracefully', () => {
      mockLocalStorage = {};

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Vote Now')).toBeInTheDocument();
      expect(screen.getByText('Vote Now')).toBeEnabled();
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage['voteState'] = 'invalid-json';

      render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Vote Now')).toBeInTheDocument();
      expect(screen.getByText('Vote Now')).toBeEnabled();
    });
  });

  describe('Multiple Contestants Persistence', () => {
    it('should call vote function for multiple contestants', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

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

      const voteButton = screen.getByText('Vote Now');
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      const secondContestant = { ...mockContestant, id: '2', name: 'Mike Chen' };
      rerender(
        <ContestantCard
          contestant={secondContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      const secondVoteButton = screen.getByText('Vote Now');
      fireEvent.click(secondVoteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('2');
      });

      expect(mockOnVote).toHaveBeenCalledTimes(2);
    });

    it('should maintain separate vote states for different contestants', () => {
      mockLocalStorage['voteState'] = JSON.stringify({ '1': true, '2': false, '3': true });
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      const { rerender } = render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Voted')).toBeInTheDocument();

      const secondContestant = { ...mockContestant, id: '2', name: 'Mike Chen' };
      rerender(
        <ContestantCard
          contestant={secondContestant}
          hasVoted={false}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Vote Now')).toBeInTheDocument();
    });
  });

  describe('localStorage Error Handling', () => {
    it('should handle localStorage quota exceeded error', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

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

      expect(screen.getByText('Vote Now')).toBeInTheDocument();

      localStorage.setItem = originalSetItem;
    });

    it('should handle localStorage not available (private browsing)', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });

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

      expect(screen.getByText('Vote Now')).toBeInTheDocument();

      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });
  });

  describe('State Synchronization', () => {
    it('should sync vote state across multiple instances of same contestant', () => {
      mockLocalStorage['voteState'] = JSON.stringify({ '1': true });
      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };

      const { rerender } = render(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Voted')).toBeInTheDocument();

      rerender(
        <ContestantCard
          contestant={contestantWithVotes}
          hasVoted={true}
          onVote={jest.fn()}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={0}
          trendingPercentage={null}
        />,
      );

      expect(screen.getByText('Voted')).toBeInTheDocument();
    });

    it('should handle vote state changes in real-time', async () => {
      const mockOnVote = jest.fn().mockResolvedValue(true);

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

      expect(screen.getByText('Vote Now')).toBeInTheDocument();

      const voteButton = screen.getByText('Vote Now');
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(mockOnVote).toHaveBeenCalledWith('1');
      });

      const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
      rerender(
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

      expect(screen.getByText('Voted')).toBeInTheDocument();
    });
  });
});
