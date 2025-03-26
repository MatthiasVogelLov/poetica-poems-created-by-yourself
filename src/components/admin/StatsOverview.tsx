
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from './StatCard';
import KeywordsCard from './KeywordsCard';
import FeatureUsageCard from './FeatureUsageCard';

interface StatsOverviewProps {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
  keywordsTodayUsed?: number;
  subscribersCount: number;
  subscribersTodayCount: number;
  unpaidPoems?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalPoems,
  todayPoems,
  keywordsUsed,
  keywordsTodayUsed = 0,
  subscribersCount,
  subscribersTodayCount,
  unpaidPoems = 0
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title="Erstellte Gedichte"
        value={totalPoems}
        description={`Heute: ${todayPoems}`}
      />
      
      <KeywordsCard 
        keywordsUsed={keywordsUsed} 
        keywordsTodayUsed={keywordsTodayUsed} 
      />

      <FeatureUsageCard 
        featureData={[
          { 
            name: 'Abonnenten', 
            value: subscribersCount, 
            todayValue: subscribersTodayCount 
          }
        ]}
      />
      
      <StatCard 
        title="Unvollständige Gedichte"
        value={unpaidPoems}
        description="Nicht vollständig angezeigt/bezahlt"
      />
    </div>
  );
};

export default StatsOverview;
