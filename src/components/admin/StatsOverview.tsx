
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from './StatCard';
import KeywordsCard from './KeywordsCard';
import FeatureUsageCard from './FeatureUsageCard';

interface StatsOverviewProps {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
  subscribersCount: number;
  subscribersTodayCount: number;
  unpaidPoems?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalPoems,
  todayPoems,
  keywordsUsed,
  subscribersCount,
  subscribersTodayCount,
  unpaidPoems = 0
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title="Erstellte Gedichte"
        count={totalPoems}
        subtitle={`Heute: ${todayPoems}`}
        bgClass="bg-violet-50"
        textClass="text-violet-500"
        iconClass="text-violet-400"
      />
      
      <KeywordsCard 
        keywordsUsed={keywordsUsed} 
        totalPoems={totalPoems} 
      />

      <FeatureUsageCard
        title="Abonnenten"
        count={subscribersCount}
        subtitle={`Heute: ${subscribersTodayCount}`}
        bgClass="bg-emerald-50"
        textClass="text-emerald-600"
        iconClass="text-emerald-400"
      />
      
      <StatCard 
        title="Unvollständige Gedichte"
        count={unpaidPoems}
        subtitle="Nicht vollständig angezeigt/bezahlt"
        bgClass="bg-amber-50"
        textClass="text-amber-600"
        iconClass="text-amber-400"
      />
    </div>
  );
};

export default StatsOverview;
