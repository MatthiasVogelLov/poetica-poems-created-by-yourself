
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import KeywordsStatsTable from './KeywordsStatsTable';
import DownloadButton from './DownloadButton';

interface KeywordsCardProps {
  keywordsUsed: number;
  keywordsTodayUsed: number;
}

const KeywordsCard = ({ keywordsUsed, keywordsTodayUsed }: KeywordsCardProps) => {
  // Create data structure compatible with our download component
  const keywordsData = [
    { 
      name: 'Mit Schlüsselwörtern', 
      value: keywordsUsed, 
      todayValue: keywordsTodayUsed 
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Schlüsselwörter</h3>
          <DownloadButton 
            currentData={keywordsData} 
            dataTitle="Schlüsselwörter Statistik" 
          />
        </div>
        <KeywordsStatsTable 
          keywordsUsed={keywordsUsed} 
          keywordsTodayUsed={keywordsTodayUsed} 
        />
      </CardContent>
    </Card>
  );
};

export default KeywordsCard;
