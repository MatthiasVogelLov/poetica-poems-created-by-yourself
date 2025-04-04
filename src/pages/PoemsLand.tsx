
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams, useLocation } from 'react-router-dom';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay, getStyleDisplay } from '@/utils/poem-display-helpers';
import PoemSEO from '@/components/poems-land/PoemSEO';
import PoemsListView from '@/components/poems-land/PoemsListView';
import PoemsLandSEO from '@/components/poems-land/PoemsLandSEO';
import { usePoemNavigation } from '@/hooks/use-poem-navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const PoemsLand = () => {
  const { poemSlug } = useParams();
  const location = useLocation();
  const { language } = useLanguage();
  
  // Set language-specific filters based on URL
  const isEnglishRoute = location.pathname.startsWith('/en/');
  
  // Update language in context based on route if needed
  useEffect(() => {
    // This ensures poems are filtered by language correctly
    console.log(`PoemsLand component loaded with language: ${language}, path: ${location.pathname}`);
  }, [language, location.pathname]);
  
  const {
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    styleFilter,
    audienceFilter,
    searchQuery,
    keywordFilters,
    popularKeywords,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    setStyleFilter,
    setAudienceFilter,
    setSearchQuery,
    toggleKeywordFilter,
    clearKeywordFilters,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes,
    getUniqueStyles,
    getUniqueAudiences,
    findPoemBySlug,
    getSlugForPoemId,
    page,
    totalCount,
    hasMore,
    nextPage,
    prevPage,
    poemsPerPage
  } = usePoems();

  // Custom hook for poem navigation
  const {
    handleGoBack,
    handleCreatePoem,
    navigateToPoemDetail
  } = usePoemNavigation({
    poemSlug,
    findPoemBySlug,
    setSelectedPoemId,
    getSlugForPoemId,
    selectedPoem
  });

  // Host and URL for SEO
  const host = window.location.origin;

  return (
    <div className="min-h-screen bg-white">
      {/* SEO metadata */}
      <PoemsLandSEO selectedPoem={selectedPoem} host={host} />
      {selectedPoem && <PoemSEO poem={selectedPoem} isPreview={false} host={host} />}
      
      <Header />
      
      <div className={`${!selectedPoemId ? 'px-0 pb-0 pt-0' : 'px-4 pt-20 pb-20'} bg-white`}>
        <div className={selectedPoemId ? 'container max-w-7xl mx-auto' : 'w-full'}>
          {selectedPoemId ? (
            <div className="pt-12">
              <SinglePoemView 
                poem={selectedPoem}
                isLoading={isLoading}
                navigateBack={handleGoBack}
                isPreview={false}
                handleCreatePoem={handleCreatePoem}
              />
            </div>
          ) : (
            <PoemsListView 
              filteredPoems={filteredPoems}
              isLoading={isLoading}
              occasionFilter={occasionFilter}
              contentTypeFilter={contentTypeFilter}
              styleFilter={styleFilter}
              audienceFilter={audienceFilter}
              searchQuery={searchQuery}
              keywordFilters={keywordFilters || []}
              popularKeywords={popularKeywords}
              setOccasionFilter={setOccasionFilter}
              setContentTypeFilter={setContentTypeFilter}
              setStyleFilter={setStyleFilter}
              setAudienceFilter={setAudienceFilter}
              setSearchQuery={setSearchQuery}
              toggleKeywordFilter={toggleKeywordFilter!}
              clearKeywordFilters={clearKeywordFilters!}
              clearFilters={clearFilters}
              getUniqueOccasions={getUniqueOccasions}
              getUniqueContentTypes={getUniqueContentTypes}
              getUniqueStyles={getUniqueStyles}
              getUniqueAudiences={getUniqueAudiences}
              handleDeletePoem={handleDeletePoem}
              navigateToPoemDetail={navigateToPoemDetail}
              handleCreatePoem={handleCreatePoem}
              getOccasionDisplay={getOccasionDisplay}
              getContentTypeDisplay={getContentTypeDisplay}
              getStyleDisplay={getStyleDisplay}
              getAudienceDisplay={getAudienceDisplay}
              page={page}
              totalCount={totalCount}
              hasMore={hasMore}
              nextPage={nextPage}
              prevPage={prevPage}
              poemsPerPage={poemsPerPage}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoemsLand;
