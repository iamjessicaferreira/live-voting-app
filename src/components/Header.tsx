'use client';

import { TheaterComedy, HowToVote, Group } from '@mui/icons-material';

interface HeaderProps {
  isLive: boolean;
  onToggleLive: () => void;
  onResetVotes: () => void;
  totalVotes: number;
  activeContestants: number;
}

export const Header: React.FC<HeaderProps> = ({
  isLive,
  onToggleLive,
  onResetVotes,
  totalVotes,
  activeContestants,
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 space-y-3 sm:space-y-0">
          <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TheaterComedy className="text-purple-600" />
              Talent show
            </h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              ></div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="flex sm:hidden items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-1">
              <HowToVote className="text-blue-600" fontSize="small" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Group className="text-green-600" fontSize="small" />
              <span>{activeContestants} active</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <HowToVote className="text-blue-600" />
              <span>{totalVotes} total votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Group className="text-green-600" />
              <span>{activeContestants} active contestants</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={onToggleLive}
              className={`px-2 py-1.5 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                isLive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isLive ? 'Stop Live' : 'Start Live'}
            </button>

            <button
              onClick={onResetVotes}
              className="px-2 py-1.5 sm:px-3 rounded-md text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
