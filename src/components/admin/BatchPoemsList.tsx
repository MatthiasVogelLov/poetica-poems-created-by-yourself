
import React from 'react';
import BatchPoemsHeader from './BatchPoemsHeader';
import PoemsTable from './PoemsTable';
import EmptyPoemsList from './EmptyPoemsList';
import LoadingState from './LoadingState';
import PaginationControls from './table/PaginationControls';

interface BatchPoemsListProps {
  poems: any[];
  isLoading: boolean;
  onStatusChange: (id: string, status: 'published' | 'deleted' | 'hidden') => void;
  onRefresh: () => void;
  publishingState?: Record<string, boolean>;
  hidingState?: Record<string, boolean>;
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
  hidingState = {},
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
        hidingState={hidingState}
      />
      
      {visibleCount > poemsPerPage && (
        <PaginationControls
          page={page}
          startRange={(page - 1) * poemsPerPage + 1}
          endRange={Math.min(page * poemsPerPage, visibleCount)}
          visibleCount={visibleCount}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default BatchPoemsList;
