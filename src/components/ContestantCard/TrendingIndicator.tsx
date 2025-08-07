'use client';

interface TrendingIndicatorProps {
  trendingPercentage?: number | null;
}

export const TrendingIndicator: React.FC<TrendingIndicatorProps> = ({ trendingPercentage }) => {
  if (trendingPercentage === null || trendingPercentage === undefined || trendingPercentage === 0) {
    return null;
  }

  const getTrendingColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`text-xs sm:text-sm font-medium ${getTrendingColor(trendingPercentage)}`}>
      {trendingPercentage > 0 ? '+' : ''}
      {trendingPercentage}% trending
    </div>
  );
};
