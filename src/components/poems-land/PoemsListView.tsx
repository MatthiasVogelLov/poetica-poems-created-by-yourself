
import React from 'react';
import PoemFilters from './PoemFilters';
import PoemsList from './PoemsList';
import CreatePoemButton from './CreatePoemButton';
import PopularKeywords from './PopularKeywords';
import PoemOfTheDay from './PoemOfTheDay';
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
  // Select a featured poem for the "Poem of the Day"
  const featuredPoem = filteredPoems.length > 0 ? filteredPoems[0] : null;
  
  return (
    <>
      <h1 className="text-3xl font-serif mb-8 text-center">PoemsLand</h1>
      
      {/* Hero section with background and Poem of the Day */}
      <div className="w-full h-[70vh] mb-16 relative overflow-hidden rounded-xl shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/adcdecab-321c-4ffc-89c4-4e1969fa1fa4.png')", 
            filter: "brightness(0.7)" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center text-white mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">
                Entdecke deine poetische Welt
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
                Eine Sammlung einzigartiger Gedichte für jeden Anlass
              </p>
            </div>
            
            {featuredPoem && (
              <div className="mt-12">
                <PoemOfTheDay 
                  poem={featuredPoem} 
                  onClick={() => navigateToPoemDetail(featuredPoem.id)} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative w-full max-w-md mx-auto mb-6">
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Gedichte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Left sidebar with filters and keywords */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filter dropdowns */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-medium mb-4">Filter</h3>
            
            <div className="space-y-3">
              <select
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Anlässe</option>
                {getUniqueOccasions().map(occasion => (
                  <option key={occasion} value={occasion}>
                    {getOccasionDisplay(occasion)}
                  </option>
                ))}
              </select>
              
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Themen</option>
                {getUniqueContentTypes().map(contentType => (
                  <option key={contentType} value={contentType}>
                    {getContentTypeDisplay(contentType)}
                  </option>
                ))}
              </select>
              
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Stile</option>
                {getUniqueStyles().map(style => (
                  <option key={style} value={style}>
                    {getStyleDisplay(style)}
                  </option>
                ))}
              </select>
              
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Zielgruppen</option>
                {getUniqueAudiences().map(audience => (
                  <option key={audience} value={audience}>
                    {getAudienceDisplay(audience)}
                  </option>
                ))}
              </select>
              
              {(occasionFilter !== 'all' || 
                contentTypeFilter !== 'all' || 
                styleFilter !== 'all' || 
                audienceFilter !== 'all' || 
                searchQuery !== '' ||
                keywordFilters.length > 0) && (
                <button 
                  onClick={clearFilters}
                  className="w-full text-sm py-1.5 text-blue-600 hover:text-blue-800"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>
          
          {/* Keywords section */}
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
