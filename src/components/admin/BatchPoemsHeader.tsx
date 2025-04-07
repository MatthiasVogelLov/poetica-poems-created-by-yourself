
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DownloadButton from './DownloadButton';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { useTranslations } from '@/hooks/use-translations';

interface BatchPoemsHeaderProps {
  poemsCount: number;
  visibleCount: number;
  onRefresh: () => void;
  poems: any[];
}

const BatchPoemsHeader: React.FC<BatchPoemsHeaderProps> = ({ 
  poemsCount, 
  visibleCount,
  onRefresh, 
  poems 
}) => {
  const { t, language } = useTranslations();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-medium">
        {t('admin.batchCreation.poemsList')} ({visibleCount} {t('admin.visible')} {t('admin.of')} {poemsCount} {t('admin.total')})
      </h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} size="sm">
          <RefreshCw size={16} className="mr-2" />
          {t('admin.refresh')}
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
