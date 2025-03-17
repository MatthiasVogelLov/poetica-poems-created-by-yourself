
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatsTable from './StatsTable';
import { StatItem } from '@/hooks/use-stats-data';

interface FeatureUsageCardProps {
  featureData: StatItem[];
}

const FeatureUsageCard = ({ featureData }: FeatureUsageCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <StatsTable 
          title="Feature Nutzung" 
          data={featureData} 
        />
      </CardContent>
    </Card>
  );
};

export default FeatureUsageCard;
