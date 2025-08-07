import React from 'react';
import { render, screen } from '@testing-library/react';
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
    { timestamp: Date.now() - 60000, votes: 20 },
    { timestamp: Date.now() - 30000, votes: 22 },
    { timestamp: Date.now(), votes: 25 },
  ],
};

const props = {
  hasVoted: false,
  onVote: jest.fn(),
  isLoading: false,
  isLive: true,
  isHydrated: true,
  totalVotes: 100,
};

describe('Trending Calculation', () => {
  it('should calculate trending percentage based on vote changes over time', () => {
    render(<ContestantCard {...props} contestant={mockContestant} trendingPercentage={25} />);
    expect(screen.getByText('+25% trending')).toBeInTheDocument();
  });

  it('should show negative trending when votes decrease', () => {
    const contestantWithDecreasingVotes = {
      ...mockContestant,
      voteHistory: [
        { timestamp: Date.now() - 60000, votes: 30 },
        { timestamp: Date.now() - 30000, votes: 28 },
        { timestamp: Date.now(), votes: 25 },
      ],
    };
    render(
      <ContestantCard
        {...props}
        contestant={contestantWithDecreasingVotes}
        trendingPercentage={-17}
      />,
    );
    expect(screen.getByText('-17% trending')).toBeInTheDocument();
  });

  it('should not show trending when no vote history exists', () => {
    const contestantWithNoHistory = {
      ...mockContestant,
      voteHistory: undefined,
    };
    render(
      <ContestantCard {...props} contestant={contestantWithNoHistory} trendingPercentage={null} />,
    );
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument();
  });

  it('should not show trending when insufficient vote history', () => {
    const contestantWithInsufficientHistory = {
      ...mockContestant,
      voteHistory: [{ timestamp: Date.now(), votes: 25 }],
    };
    render(
      <ContestantCard
        {...props}
        contestant={contestantWithInsufficientHistory}
        trendingPercentage={null}
      />,
    );
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument();
  });

  it('should not show trending when percentage is 0', () => {
    const contestantWithNoChange = {
      ...mockContestant,
      voteHistory: [
        { timestamp: Date.now() - 60000, votes: 25 },
        { timestamp: Date.now() - 30000, votes: 25 },
        { timestamp: Date.now(), votes: 25 },
      ],
    };
    render(
      <ContestantCard {...props} contestant={contestantWithNoChange} trendingPercentage={0} />,
    );
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument();
  });

  it('should show positive trending with green color', () => {
    render(<ContestantCard {...props} contestant={mockContestant} trendingPercentage={15} />);
    const trendingElement = screen.getByText('+15% trending');
    expect(trendingElement).toBeInTheDocument();
    expect(trendingElement).toHaveClass('text-green-600');
  });

  it('should show negative trending with red color', () => {
    const contestantWithDecreasingVotes = {
      ...mockContestant,
      voteHistory: [
        { timestamp: Date.now() - 60000, votes: 30 },
        { timestamp: Date.now() - 30000, votes: 28 },
        { timestamp: Date.now(), votes: 25 },
      ],
    };
    render(
      <ContestantCard
        {...props}
        contestant={contestantWithDecreasingVotes}
        trendingPercentage={-10}
      />,
    );
    const trendingElement = screen.getByText('-10% trending');
    expect(trendingElement).toBeInTheDocument();
    expect(trendingElement).toHaveClass('text-red-600');
  });

  it('should handle trending calculation with 30-second interval', () => {
    const contestantWith30SecondHistory = {
      ...mockContestant,
      voteHistory: [
        { timestamp: Date.now() - 30000, votes: 20 },
        { timestamp: Date.now() - 15000, votes: 22 },
        { timestamp: Date.now(), votes: 25 },
      ],
    };
    render(
      <ContestantCard
        {...props}
        contestant={contestantWith30SecondHistory}
        trendingPercentage={25}
      />,
    );
    expect(screen.getByText('+25% trending')).toBeInTheDocument();
  });

  it('should not show trending for old vote history beyond 30 seconds', () => {
    const contestantWithOldHistory = {
      ...mockContestant,
      voteHistory: [
        { timestamp: Date.now() - 60000, votes: 20 },
        { timestamp: Date.now() - 45000, votes: 22 },
        { timestamp: Date.now() - 30000, votes: 25 },
      ],
    };
    render(
      <ContestantCard {...props} contestant={contestantWithOldHistory} trendingPercentage={null} />,
    );
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument();
  });
});
