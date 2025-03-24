
import React from 'react';
import PoemFilters from './PoemFilters';
import PoemsList from './PoemsList';
import CreatePoemButton from './CreatePoemButton';
import { Poem } from '@/hooks/use-poems';

interface PoemsListViewProps {
  filteredPoems: Poem[];
  isLoading: boolean;
  occasionFilter: string;
  contentTypeFilter: string;
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  navigateToPoemDetail: (id: string) => void;
  handleCreatePoem: () => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
}

const PoemsListView: React.FC<PoemsListViewProps> = ({
  filteredPoems,
  isLoading,
  occasionFilter,
  contentTypeFilter,
  setOccasionFilter,
  setContentTypeFilter,
  clearFilters,
  getUniqueOccasions,
  getUniqueContentTypes,
  handleDeletePoem,
  navigateToPoemDetail,
  handleCreatePoem,
  getOccasionDisplay,
  getContentTypeDisplay,
}) => {
  return (
    <>
      <h1 className="text-3xl font-serif mb-8 text-center">PoemsLand</h1>
      
      <PoemFilters 
        occasionFilter={occasionFilter}
        contentTypeFilter={contentTypeFilter}
        setOccasionFilter={setOccasionFilter}
        setContentTypeFilter={setContentTypeFilter}
        clearFilters={clearFilters}
        occasions={getUniqueOccasions()}
        contentTypes={getUniqueContentTypes()}
        getOccasionDisplay={getOccasionDisplay}
        getContentTypeDisplay={getContentTypeDisplay}
      />
      
      <PoemsList 
        poems={filteredPoems}
        isLoading={isLoading}
        handleDeletePoem={handleDeletePoem}
        setSelectedPoemId={navigateToPoemDetail}
        getOccasionDisplay={getOccasionDisplay}
        getContentTypeDisplay={getContentTypeDisplay}
      />
      
      <CreatePoemButton onClick={handleCreatePoem} />
    </>
  );
};

export default PoemsListView;
