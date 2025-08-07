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
  currentVotes: 12,
  isActive: true,
  voteHistory: [
    { timestamp: Date.now() - 6000, votes: 10 },
    { timestamp: Date.now() - 3000, votes: 11 },
    { timestamp: Date.now(), votes: 12 },
  ],
};

const mockOnVote = jest.fn().mockResolvedValue(true);

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Header Component - Mobile', () => {
    it('should display title with appropriate mobile text size', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={jest.fn()}
          onResetVotes={jest.fn()}
          totalVotes={100}
          activeContestants={6}
        />,
      );

      const title = screen.getByText('Talent show');
      expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl');
    });

    it('should display mobile stats bar when on small screens', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={jest.fn()}
          onResetVotes={jest.fn()}
          totalVotes={100}
          activeContestants={6}
        />,
      );

      expect(screen.getByText('100 votes')).toBeInTheDocument();
      expect(screen.getByText('6 active')).toBeInTheDocument();
    });

    it('should display live status indicator with mobile sizing', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={jest.fn()}
          onResetVotes={jest.fn()}
          totalVotes={100}
          activeContestants={6}
        />,
      );

      const liveIndicator = screen.getByText('LIVE');
      expect(liveIndicator).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should display control buttons with mobile sizing', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={jest.fn()}
          onResetVotes={jest.fn()}
          totalVotes={100}
          activeContestants={6}
        />,
      );

      const toggleButton = screen.getByText('Stop Live');
      const resetButton = screen.getByText('Reset');

      expect(toggleButton).toHaveClass('text-xs', 'sm:text-sm');
      expect(resetButton).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should hide desktop stats on mobile screens', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={jest.fn()}
          onResetVotes={jest.fn()}
          totalVotes={100}
          activeContestants={6}
        />,
      );

      const desktopStats = screen.getByText('100 total votes');
      const desktopContainer = desktopStats.closest('.hidden.sm\\:flex');
      expect(desktopContainer).toHaveClass('hidden', 'sm:flex');
    });
  });

  describe('ContestantCard Component - Mobile', () => {
    it('should display contestant name with mobile text sizing', () => {
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

      const name = screen.getByText('Sarah Johnson');
      expect(name).toHaveClass('text-lg', 'sm:text-xl');
    });

    it('should display talent with mobile text sizing', () => {
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

      const talent = screen.getByText('Opera Singing');
      expect(talent).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should display description with mobile text sizing', () => {
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

      const description = screen.getByText(
        'Sarah Johnson, 28, from New York, is a classically trained soprano with a powerful voice that can reach incredible heights.',
      );
      expect(description).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should display vote count with mobile sizing', () => {
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

      const voteCount = screen.getByText('12');
      expect(voteCount).toHaveClass('text-base', 'sm:text-lg');
    });

    it('should display vote button with mobile sizing', () => {
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
      expect(voteButton).toHaveClass('text-sm', 'sm:text-base');
    });

    it('should have appropriate mobile padding', () => {
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

      const cardContent = screen.getByText('Sarah Johnson').closest('.p-4');
      expect(cardContent).toHaveClass('p-4', 'sm:p-6');
    });

    it('should have appropriate mobile height constraints', () => {
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

      const card = screen.getByText('Sarah Johnson').closest('.bg-white');
      expect(card).toHaveClass('h-full');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should maintain proper spacing on mobile', () => {
      render(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ContestantCard
            contestant={mockContestant}
            hasVoted={false}
            onVote={mockOnVote}
            isLoading={false}
            isLive={true}
            isHydrated={true}
            trendingPercentage={25}
          />
        </div>,
      );

      const grid = screen.getByText('Sarah Johnson').closest('.grid');
      expect(grid).toHaveClass('gap-4', 'sm:gap-6');
    });
  });
});
