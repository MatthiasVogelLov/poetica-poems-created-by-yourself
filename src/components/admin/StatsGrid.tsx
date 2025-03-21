
import React, { useState } from 'react';
import { useStatsData } from '@/hooks/use-stats-data';
import StatsOverview from './StatsOverview';
import UnifiedStatsTable from './UnifiedStatsTable';
import DateRangeFilter from './DateRangeFilter';
import StatsLoadingState from './StatsLoadingState';
import StatsErrorState from './StatsErrorState';
import DownloadButton from './DownloadButton';
import { Card, CardContent } from '@/components/ui/card';

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

  // Prepare subscriber data
  const subscriberData = [
    { 
      name: 'Abonnenten', 
      value: stats.subscribersCount || 0, 
      todayValue: stats.subscribersTodayCount || 0 
    }
  ];

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
        subscribersCount={stats.subscribersCount || 0}
        subscribersTodayCount={stats.subscribersTodayCount || 0}
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-medium mb-4">Vollständige Statistiken</h3>
          <UnifiedStatsTable 
            featureData={stats.featureData}
            audienceData={stats.audienceData}
            occasionData={stats.occasionData}
            styleData={stats.styleData}
            lengthData={stats.lengthData}
            keywordsData={[
              { 
                name: 'Mit Schlüsselwörtern', 
                value: stats.keywordsUsed, 
                todayValue: stats.keywordsTodayUsed 
              }
            ]}
            subscriberData={subscriberData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;
