'use client';

import { VotingError } from '@/types';

interface ErrorDisplayProps {
  error: VotingError | null;
  onClear: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) return null;

  const getErrorIcon = (type: VotingError['type']) => {
    switch (type) {
      case 'duplicate':
        return '⚠️';
      case 'network':
        return '🌐';
      case 'validation':
        return '❌';
      default:
        return '⚠️';
    }
  };

  const getErrorColor = (type: VotingError['type']) => {
    switch (type) {
      case 'duplicate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'network':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'validation':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg border ${getErrorColor(error.type)} shadow-lg z-50`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="text-xl">{getErrorIcon(error.type)}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{error.message}</p>
        </div>
        <button
          onClick={onClear}
          className="flex-shrink-0 ml-3 text-lg hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 