
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatsTable from './StatsTable';
import { StatItem } from '@/types/stats';
import DownloadButton from './DownloadButton';

interface FeatureUsageCardProps {
  featureData: StatItem[];
}

const FeatureUsageCard = ({ featureData }: FeatureUsageCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Feature Nutzung</h3>
          <DownloadButton 
            currentData={featureData}
            dataTitle="Feature Nutzung"
          />
        </div>
        <StatsTable 
          title="Feature Nutzung" 
          data={featureData} 
          hideTitle={true}
        />
      </CardContent>
    </Card>
  );
};

export default FeatureUsageCard;
