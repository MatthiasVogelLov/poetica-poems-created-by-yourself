
import React from 'react';
import { useStatsData } from '@/hooks/use-stats-data';
import StatsOverview from './StatsOverview';
import FeatureUsageCard from './FeatureUsageCard';
import KeywordsCard from './KeywordsCard';
import CategoryTabs from './CategoryTabs';
import StatsLoadingState from './StatsLoadingState';
import StatsErrorState from './StatsErrorState';

const StatsGrid = () => {
  const { stats, loading, error } = useStatsData();

  if (loading) {
    return <StatsLoadingState />;
  }

  if (error) {
    return <StatsErrorState error={error} />;
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
      
      <StatsOverview 
        totalPoems={stats.totalPoems} 
        todayPoems={stats.todayPoems} 
        keywordsUsed={stats.keywordsUsed}
      />

      <h3 className="text-xl font-medium mb-3">Feature-Nutzung</h3>
      <FeatureUsageCard featureData={stats.featureData} />
      
      <KeywordsCard 
        keywordsUsed={stats.keywordsUsed} 
        keywordsTodayUsed={stats.keywordsTodayUsed}
      />
      
      <CategoryTabs 
        audienceData={stats.audienceData}
        occasionData={stats.occasionData}
        styleData={stats.styleData}
        lengthData={stats.lengthData}
      />
    </div>
  );
};

export default StatsGrid;
