
import React from 'react';
import Header from '../components/en/Header';
import Footer from '../components/en/Footer';
import { useParams } from 'react-router-dom';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay, getStyleDisplay } from '@/utils/poem-display-helpers';
import PoemSEO from '@/components/poems-land/PoemSEO';
import PoemsListView from '@/components/poems-land/PoemsListView';
import PoemsLandSEO from '@/components/poems-land/PoemsLandSEO';
import { usePoemNavigation } from '@/hooks/use-poem-navigation';
import HeroSection from '../components/en/poems-land/HeroSection';

const PoemsLand = () => {
  const { poemSlug } = useParams();
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
  
  // Use English translations for display labels
  const getEnglishOccasionDisplay = (occasion: string) => {
    const translations: { [key: string]: string } = {
      'geburtstag': 'Birthday',
      'hochzeit': 'Wedding',
      'jubilaeum': 'Anniversary',
      'valentinstag': 'Valentine\'s Day',
      'weihnachten': 'Christmas',
      'ostern': 'Easter',
      'abschluss': 'Graduation',
      'babyparty': 'Baby Shower',
      'einzug': 'Moving In',
      'junggesellenabschied': 'Bachelor/Bachelorette Party',
      'kommunion': 'Communion',
      'konfirmation': 'Confirmation',
      'ruhestand': 'Retirement',
      'scheidung': 'Divorce',
      'schulanfang': 'First Day of School',
      'taufe': 'Baptism',
      'trauerfall': 'Bereavement',
      'trennung': 'Separation',
      'umzug': 'Moving',
      'verlobung': 'Engagement',
      'andere': 'Other'
    };
    return translations[occasion] || getOccasionDisplay(occasion);
  };
  
  const getEnglishContentTypeDisplay = (contentType: string) => {
    const translations: { [key: string]: string } = {
      'liebe': 'Love',
      'freundschaft': 'Friendship',
      'natur': 'Nature',
      'leben': 'Life',
      'motivation': 'Motivation',
      'humor': 'Humor',
      'trauer': 'Grief'
    };
    return translations[contentType] || getContentTypeDisplay(contentType);
  };
  
  const getEnglishStyleDisplay = (style: string) => {
    const translations: { [key: string]: string } = {
      'klassisch': 'Classical',
      'modern': 'Modern',
      'romantisch': 'Romantic',
      'humorvoll': 'Humorous',
      'experimentell': 'Experimental'
    };
    return translations[style] || getStyleDisplay(style);
  };
  
  const getEnglishAudienceDisplay = (audience: string) => {
    const translations: { [key: string]: string } = {
      'eltern': 'Parents',
      'erwachsene': 'Adults',
      'familie': 'Family',
      'freunde': 'Friends',
      'kinder': 'Children',
      'kollegen': 'Colleagues',
      'partner': 'Partner'
    };
    return translations[audience] || getAudienceDisplay(audience);
  };

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
              getOccasionDisplay={getEnglishOccasionDisplay}
              getContentTypeDisplay={getEnglishContentTypeDisplay}
              getStyleDisplay={getEnglishStyleDisplay}
              getAudienceDisplay={getEnglishAudienceDisplay}
              page={page}
              totalCount={totalCount}
              hasMore={hasMore}
              nextPage={nextPage}
              prevPage={prevPage}
              poemsPerPage={poemsPerPage}
              customHeroSection={
                <HeroSection 
                  featuredPoem={filteredPoems.length > 0 ? filteredPoems[0] : null} 
                  onPoemClick={navigateToPoemDetail} 
                />
              }
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoemsLand;
