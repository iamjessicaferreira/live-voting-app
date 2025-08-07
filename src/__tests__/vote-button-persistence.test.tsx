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

describe('Vote Button Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should show "Vote Now" initially', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={false}
        onVote={mockOnVote}
        isLoading={false}
        isLive={true}
        isHydrated={true}
        trendingPercentage={25}
      />,
    );

    expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
  });

  it('should show "Voted" when user has voted', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={true}
        onVote={mockOnVote}
        isLoading={false}
        isLive={true}
        isHydrated={true}
        trendingPercentage={25}
      />,
    );

    expect(screen.getByRole('button', { name: /voted/i })).toBeInTheDocument();
  });

  it('should show loading state when voting', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={false}
        onVote={mockOnVote}
        isLoading={true}
        isLive={true}
        isHydrated={true}
        trendingPercentage={25}
      />,
    );

    expect(screen.getByRole('button', { name: /voting/i })).toBeInTheDocument();
  });

  it('should call onVote when vote button is clicked', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={false}
        onVote={mockOnVote}
        isLoading={false}
        isLive={true}
        isHydrated={true}
        trendingPercentage={25}
      />,
    );

    const voteButton = screen.getByRole('button', { name: /vote now/i });
    fireEvent.click(voteButton);

    expect(mockOnVote).toHaveBeenCalledWith('1');
  });

  it('should be disabled when not hydrated', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={false}
        onVote={mockOnVote}
        isLoading={false}
        isLive={true}
        isHydrated={false}
        trendingPercentage={25}
      />,
    );

    const voteButton = screen.getByRole('button', { name: /loading/i });
    expect(voteButton).toBeDisabled();
  });
});
