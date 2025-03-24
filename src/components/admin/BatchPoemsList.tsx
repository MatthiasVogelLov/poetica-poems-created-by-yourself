
import React from 'react';
import BatchPoemsHeader from './BatchPoemsHeader';
import PoemsTable from './PoemsTable';
import EmptyPoemsList from './EmptyPoemsList';
import LoadingState from './LoadingState';

interface BatchPoemsListProps {
  poems: any[];
  isLoading: boolean;
  onStatusChange: (id: string, status: 'published' | 'deleted') => void;
  onRefresh: () => void;
  publishingState?: Record<string, boolean>;
}

const BatchPoemsList: React.FC<BatchPoemsListProps> = ({ 
  poems, 
  isLoading, 
  onStatusChange,
  onRefresh,
  publishingState = {}
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
        poemsCount={poems.length} 
        onRefresh={onRefresh} 
        poems={poems} 
      />
      
      <PoemsTable 
        poems={poems} 
        onStatusChange={onStatusChange}
        publishingState={publishingState}
      />
    </div>
  );
};

export default BatchPoemsList;
