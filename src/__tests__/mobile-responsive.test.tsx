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
  currentVotes: 12,
  isActive: true,
};

const mockOnToggleLive = jest.fn();
const mockOnResetVotes = jest.fn();
const mockOnVote = jest.fn().mockResolvedValue(true);

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 414,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes('max-width: 640px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Header Component - Mobile', () => {
    it('should display title with appropriate mobile text size', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const title = screen.getByText('Talent show');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl');
    });

    it('should display mobile stats bar when on small screens', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const mobileStats = screen.getByText('50 votes');
      expect(mobileStats).toBeInTheDocument();

      const activeStats = screen.getByText('6 active');
      expect(activeStats).toBeInTheDocument();
    });

    it('should display live status indicator with mobile sizing', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const liveText = screen.getByText('LIVE');
      expect(liveText).toBeInTheDocument();
      expect(liveText).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should display control buttons with mobile sizing', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const stopButton = screen.getByText('Stop Live');
      const resetButton = screen.getByText('Reset');

      expect(stopButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();

      expect(stopButton).toHaveClass('text-xs', 'sm:text-sm');
      expect(resetButton).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should hide desktop stats on mobile screens', () => {
      render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const mobileStats = screen.getByText('50 votes');
      expect(mobileStats).toBeInTheDocument();
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
          totalVotes={12}
        />,
      );

      const name = screen.getByText('Sarah Johnson');
      expect(name).toBeInTheDocument();
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
          totalVotes={12}
        />,
      );

      const talent = screen.getByText('Opera Singing');
      expect(talent).toBeInTheDocument();
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
          totalVotes={12}
        />,
      );

      const description = screen.getByText(/Sarah Johnson, 28, from New York/);
      expect(description).toBeInTheDocument();
      expect(description.closest('p')).toHaveClass('text-xs', 'sm:text-sm');
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
          totalVotes={12}
        />,
      );

      const voteCount = screen.getByText('12');
      expect(voteCount).toBeInTheDocument();
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
          totalVotes={12}
        />,
      );

      const voteButton = screen.getByText('Vote Now');
      expect(voteButton).toBeInTheDocument();
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
          totalVotes={12}
        />,
      );

      const cardContent = screen.getByText('Sarah Johnson').closest('div')?.parentElement;
      expect(cardContent).toHaveClass('p-4', 'sm:p-6');
    });

    it('should have appropriate mobile height constraints', () => {
      const { container } = render(
        <ContestantCard
          contestant={mockContestant}
          hasVoted={false}
          onVote={mockOnVote}
          isLoading={false}
          isLive={true}
          isHydrated={true}
          totalVotes={12}
        />,
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('h-full');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should maintain proper spacing on mobile', () => {
      const { container } = render(
        <Header
          isLive={true}
          onToggleLive={mockOnToggleLive}
          onResetVotes={mockOnResetVotes}
          totalVotes={50}
          activeContestants={6}
        />,
      );

      const headerContainer = container.querySelector('.max-w-7xl');
      expect(headerContainer).toHaveClass('px-3', 'sm:px-4', 'lg:px-8');
    });
  });
});
