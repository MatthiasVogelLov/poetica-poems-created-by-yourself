
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DownloadButton from './DownloadButton';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';

interface BatchPoemsHeaderProps {
  poemsCount: number;
  onRefresh: () => void;
  poems: any[];
}

const BatchPoemsHeader: React.FC<BatchPoemsHeaderProps> = ({ 
  poemsCount, 
  onRefresh, 
  poems 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-medium">Batch-Gedichte ({poemsCount})</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} size="sm">
          <RefreshCw size={16} className="mr-2" />
          Aktualisieren
        </Button>
        
        <DownloadButton 
          currentData={poems.map(poem => ({
            id: poem.id,
            title: poem.title,
            status: poem.status,
            occasion: getOccasionDisplay(poem.occasion),
            content_type: getContentTypeDisplay(poem.content_type),
            created_at: poem.created_at
          }))} 
          dataTitle="Batch Poems" 
        />
      </div>
    </div>
  );
};

export default BatchPoemsHeader;
