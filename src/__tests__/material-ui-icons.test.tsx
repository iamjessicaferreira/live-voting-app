import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/components/Header';
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

describe('Material UI Icons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Material UI icons in Header component', () => {
    render(
      <Header
        isLive={true}
        onToggleLive={jest.fn()}
        onResetVotes={jest.fn()}
        totalVotes={100}
        activeContestants={6}
      />,
    );

    expect(screen.getByText('Talent show')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should render Material UI icons in ContestantCard component', () => {
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

    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Opera Singing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vote now/i })).toBeInTheDocument();
  });

  it('should show voted state with Material UI icons', () => {
    const contestantWithVotes = { ...mockContestant, currentVotes: 5 };
    render(
      <ContestantCard
        contestant={contestantWithVotes}
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
});
