import React from 'react';
import PoemsList from './PoemsList';
import CreatePoemButton from './CreatePoemButton';
import PopularKeywords from './PopularKeywords';
import SearchBar from './SearchBar';
import FilterSection from './FilterSection';
import HeroSection from './HeroSection';
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
  const getFeaturedPoem = () => {
    if (filteredPoems.length === 0) return null;
    
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash |= 0;
    }
    
    const index = Math.abs(hash) % filteredPoems.length;
    return filteredPoems[index];
  };
  
  const featuredPoem = getFeaturedPoem();
  
  return (
    <>
      {/* Remove the redundant PoemsLand title here as it's now in HeroSection */}
      
      <HeroSection 
        featuredPoem={featuredPoem} 
        onPoemClick={navigateToPoemDetail} 
      />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-1 space-y-6">
            <FilterSection
              occasionFilter={occasionFilter}
              contentTypeFilter={contentTypeFilter}
              styleFilter={styleFilter}
              audienceFilter={audienceFilter}
              setOccasionFilter={setOccasionFilter}
              setContentTypeFilter={setContentTypeFilter}
              setStyleFilter={setStyleFilter}
              setAudienceFilter={setAudienceFilter}
              clearFilters={clearFilters}
              getUniqueOccasions={getUniqueOccasions}
              getUniqueContentTypes={getUniqueContentTypes}
              getUniqueStyles={getUniqueStyles}
              getUniqueAudiences={getUniqueAudiences}
              getOccasionDisplay={getOccasionDisplay}
              getContentTypeDisplay={getContentTypeDisplay}
              getStyleDisplay={getStyleDisplay}
              getAudienceDisplay={getAudienceDisplay}
              searchQuery={searchQuery}
              keywordFilters={keywordFilters}
            />
            
            <PopularKeywords 
              keywords={popularKeywords}
              selectedKeywords={keywordFilters}
              onKeywordClick={toggleKeywordFilter}
              onClearAllKeywords={clearKeywordFilters}
            />
          </div>
          
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
      </div>
      
      <CreatePoemButton onClick={handleCreatePoem} />
    </>
  );
};

export default PoemsListView;
