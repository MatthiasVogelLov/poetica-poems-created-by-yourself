
import React, { useState } from 'react';
import { useStatsData } from '@/hooks/use-stats-data';
import StatsOverview from './StatsOverview';
import FeatureUsageCard from './FeatureUsageCard';
import KeywordsCard from './KeywordsCard';
import CategoryTabs from './CategoryTabs';
import StatsLoadingState from './StatsLoadingState';
import StatsErrorState from './StatsErrorState';
import DownloadButton from './DownloadButton';
import DateRangeFilter from './DateRangeFilter';

const StatsGrid = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { stats, loading, error } = useStatsData({ startDate, endDate });

  const handleResetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (loading) {
    return <StatsLoadingState />;
  }

  if (error) {
    return <StatsErrorState error={error} />;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Statistiken</h2>
        <DownloadButton allStats={stats} />
      </div>
      
      <DateRangeFilter 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={handleResetDates}
      />
      
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
