
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import KeywordsStatsTable from './KeywordsStatsTable';

interface KeywordsCardProps {
  keywordsUsed: number;
  keywordsTodayUsed: number;
}

const KeywordsCard = ({ keywordsUsed, keywordsTodayUsed }: KeywordsCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <KeywordsStatsTable 
          keywordsUsed={keywordsUsed} 
          keywordsTodayUsed={keywordsTodayUsed} 
        />
      </CardContent>
    </Card>
  );
};

export default KeywordsCard;
