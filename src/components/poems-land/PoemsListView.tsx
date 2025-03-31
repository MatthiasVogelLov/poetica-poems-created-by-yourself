
import React from 'react';
import PoemFilters from './PoemFilters';
import PoemsList from './PoemsList';
import CreatePoemButton from './CreatePoemButton';
import PopularKeywords from './PopularKeywords';
import type { Poem } from '@/types/poem-types';

interface PoemsListViewProps {
  filteredPoems: Poem[];
  isLoading: boolean;
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  keywordFilters: string[];
  popularKeywords: string[];
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  setStyleFilter: (filter: string) => void;
  setAudienceFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  toggleKeywordFilter: (keyword: string) => void;
  clearKeywordFilters: () => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  getUniqueStyles: () => string[];
  getUniqueAudiences: () => string[];
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  navigateToPoemDetail: (id: string) => void;
  handleCreatePoem: () => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getStyleDisplay: (style: string) => string;
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
  styleFilter = 'all',
  audienceFilter = 'all',
  searchQuery = '',
  keywordFilters = [],
  popularKeywords = [],
  setOccasionFilter,
  setContentTypeFilter,
  setStyleFilter,
  setAudienceFilter,
  setSearchQuery,
  toggleKeywordFilter,
  clearKeywordFilters,
  clearFilters,
  getUniqueOccasions,
  getUniqueContentTypes,
  getUniqueStyles,
  getUniqueAudiences,
  handleDeletePoem,
  navigateToPoemDetail,
  handleCreatePoem,
  getOccasionDisplay,
  getContentTypeDisplay,
  getStyleDisplay,
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
        styleFilter={styleFilter}
        audienceFilter={audienceFilter}
        searchQuery={searchQuery}
        keywordFilters={keywordFilters}
        setOccasionFilter={setOccasionFilter}
        setContentTypeFilter={setContentTypeFilter}
        setStyleFilter={setStyleFilter}
        setAudienceFilter={setAudienceFilter}
        setSearchQuery={setSearchQuery}
        toggleKeywordFilter={toggleKeywordFilter}
        clearFilters={clearFilters}
        occasions={getUniqueOccasions()}
        contentTypes={getUniqueContentTypes()}
        styles={getUniqueStyles()}
        audiences={getUniqueAudiences()}
        getOccasionDisplay={getOccasionDisplay}
        getContentTypeDisplay={getContentTypeDisplay}
        getStyleDisplay={getStyleDisplay}
        getAudienceDisplay={getAudienceDisplay}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Keywords sidebar (left side) */}
        <div className="lg:col-span-1">
          <PopularKeywords 
            keywords={popularKeywords}
            selectedKeywords={keywordFilters}
            onKeywordClick={toggleKeywordFilter}
            onClearAllKeywords={clearKeywordFilters}
          />
        </div>
        
        {/* Poems list (right side) */}
        <div className="lg:col-span-3">
          <PoemsList 
            poems={filteredPoems}
            isLoading={isLoading}
            handleDeletePoem={handleDeletePoem}
            setSelectedPoemId={navigateToPoemDetail}
            getOccasionDisplay={getOccasionDisplay}
            getContentTypeDisplay={getContentTypeDisplay}
            getStyleDisplay={getStyleDisplay}
            getAudienceDisplay={getAudienceDisplay}
            page={page}
            totalCount={totalCount}
            hasMore={hasMore}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            poemsPerPage={poemsPerPage}
          />
        </div>
      </div>
      
      <CreatePoemButton onClick={handleCreatePoem} />
    </>
  );
};

export default PoemsListView;
