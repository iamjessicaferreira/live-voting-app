'use client';

import { Contestant } from '@/types';

interface ContestantImageProps {
  contestant: Contestant;
}

export const ContestantImage: React.FC<ContestantImageProps> = ({ contestant }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="relative">
      <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
        <img
          src={contestant.imageUrl}
          alt={`${contestant.name} - ${contestant.talent}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="text-white text-2xl sm:text-4xl font-bold absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400"
          style={{ display: 'none' }}
        >
          {getInitials(contestant.name)}
        </div>
      </div>
      {!contestant.isActive && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-semibold text-sm sm:text-lg">Inactive</span>
        </div>
      )}
    </div>
  );
};
