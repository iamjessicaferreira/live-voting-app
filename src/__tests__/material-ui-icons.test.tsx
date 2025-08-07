import React from 'react';
import { render, screen } from '@testing-library/react';
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

const mockOnToggleLive = jest.fn();
const mockOnResetVotes = jest.fn();
const mockOnVote = jest.fn().mockResolvedValue(true);

describe('Material UI Icons', () => {
  it('should render Material UI icons in Header component', () => {
    render(
      <Header
        isLive={true}
        onToggleLive={mockOnToggleLive}
        onResetVotes={mockOnResetVotes}
        totalVotes={100}
        activeContestants={6}
      />,
    );

    expect(screen.getByText('Talent show')).toBeInTheDocument();

    expect(screen.getByText('100 votes')).toBeInTheDocument();
    expect(screen.getByText('6 active')).toBeInTheDocument();
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
        totalVotes={100}
        trendingPercentage={25}
      />,
    );

    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Opera Singing')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('votes')).toBeInTheDocument();
    expect(screen.getByText('Vote Now')).toBeInTheDocument();
    expect(screen.getByText('+25% trending')).toBeInTheDocument();
  });

  it('should show voted state with Material UI icons', () => {
    render(
      <ContestantCard
        contestant={mockContestant}
        hasVoted={true}
        onVote={mockOnVote}
        isLoading={false}
        isLive={true}
        isHydrated={true}
        totalVotes={100}
        trendingPercentage={25}
      />,
    );

    expect(screen.getByText('Voted')).toBeInTheDocument();
  });
});
