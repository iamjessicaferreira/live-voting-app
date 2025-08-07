'use client';

import { Contestant } from '@/types';

interface ContestantInfoProps {
  contestant: Contestant;
}

export const ContestantInfo: React.FC<ContestantInfoProps> = ({ contestant }) => {
  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{contestant.name}</h3>
      <p className="text-xs sm:text-sm font-medium text-blue-600 mb-2">{contestant.talent}</p>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed flex-1 mb-4">
        {contestant.description}
      </p>
    </div>
  );
};
