
import React from 'react';
import BatchPoemsHeader from './BatchPoemsHeader';
import PoemsTable from './PoemsTable';
import EmptyPoemsList from './EmptyPoemsList';
import LoadingState from './LoadingState';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BatchPoemsListProps {
  poems: any[];
  isLoading: boolean;
  onStatusChange: (id: string, status: 'published' | 'deleted') => void;
  onRefresh: () => void;
  publishingState?: Record<string, boolean>;
  page?: number;
  totalCount?: number;
  visibleCount?: number;
  hasMore?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  poemsPerPage?: number;
}

const BatchPoemsList: React.FC<BatchPoemsListProps> = ({ 
  poems, 
  isLoading, 
  onStatusChange,
  onRefresh,
  publishingState = {},
  page = 1,
  totalCount = 0,
  visibleCount = 0,
  hasMore = false,
  onNextPage,
  onPrevPage,
  poemsPerPage = 10
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (poems.length === 0) {
    return <EmptyPoemsList />;
  }

  const startRange = ((page - 1) * poemsPerPage) + 1;
  const endRange = Math.min(page * poemsPerPage, visibleCount);

  return (
    <div className="space-y-6">
      <BatchPoemsHeader 
        poemsCount={totalCount} 
        visibleCount={visibleCount}
        onRefresh={onRefresh} 
        poems={poems} 
      />
      
      <PoemsTable 
        poems={poems} 
        onStatusChange={onStatusChange}
        publishingState={publishingState}
      />
      
      {visibleCount > poemsPerPage && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Zeige {startRange} bis {endRange} von {visibleCount} sichtbaren Gedichten
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNextPage}
              disabled={!hasMore}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPoemsList;
