
import React from 'react';
import PoemFilters from './PoemFilters';
import PoemsList from './PoemsList';
import CreatePoemButton from './CreatePoemButton';
import type { Poem } from '@/types/poem-types';

interface PoemsListViewProps {
  filteredPoems: Poem[];
  isLoading: boolean;
  occasionFilter: string;
  contentTypeFilter: string;
  audienceFilter: string;
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  setAudienceFilter: (filter: string) => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  getUniqueAudiences: () => string[];
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  navigateToPoemDetail: (id: string) => void;
  handleCreatePoem: () => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getAudienceDisplay: (audience: string) => string;
  page?: number;
  totalCount?: number;
  hasMore?: boolean;
  nextPage?: () => void;
  prevPage?: () => void;
  poemsPerPage?: number;
}

const PoemsListView: React.FC<PoemsListViewProps> = ({
  filteredPoems,
  isLoading,
  occasionFilter,
  contentTypeFilter,
  audienceFilter = 'all',
  setOccasionFilter,
  setContentTypeFilter,
  setAudienceFilter,
  clearFilters,
  getUniqueOccasions,
  getUniqueContentTypes,
  getUniqueAudiences,
  handleDeletePoem,
  navigateToPoemDetail,
  handleCreatePoem,
  getOccasionDisplay,
  getContentTypeDisplay,
  getAudienceDisplay,
  page = 1,
  totalCount = 0,
  hasMore = false,
  nextPage,
  prevPage,
  poemsPerPage = 12,
}) => {
  return (
    <>
      <h1 className="text-3xl font-serif mb-8 text-center">PoemsLand</h1>
      
      <PoemFilters 
        occasionFilter={occasionFilter}
        contentTypeFilter={contentTypeFilter}
        audienceFilter={audienceFilter}
        setOccasionFilter={setOccasionFilter}
        setContentTypeFilter={setContentTypeFilter}
        setAudienceFilter={setAudienceFilter}
        clearFilters={clearFilters}
        occasions={getUniqueOccasions()}
        contentTypes={getUniqueContentTypes()}
        audiences={getUniqueAudiences()}
        getOccasionDisplay={getOccasionDisplay}
        getContentTypeDisplay={getContentTypeDisplay}
        getAudienceDisplay={getAudienceDisplay}
      />
      
      <PoemsList 
        poems={filteredPoems}
        isLoading={isLoading}
        handleDeletePoem={handleDeletePoem}
        setSelectedPoemId={navigateToPoemDetail}
        getOccasionDisplay={getOccasionDisplay}
        getContentTypeDisplay={getContentTypeDisplay}
        getAudienceDisplay={getAudienceDisplay}
        page={page}
        totalCount={totalCount}
        hasMore={hasMore}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        poemsPerPage={poemsPerPage}
      />
      
      <CreatePoemButton onClick={handleCreatePoem} />
    </>
  );
};

export default PoemsListView;
