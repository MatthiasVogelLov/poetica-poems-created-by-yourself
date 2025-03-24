
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay } from '@/utils/poem-display-helpers';
import PoemSEO from '@/components/poems-land/PoemSEO';
import PoemStructuredData from '@/components/poems-land/PoemStructuredData';
import PoemsListView from '@/components/poems-land/PoemsListView';

const PoemsLand = () => {
  const { poemSlug } = useParams();
  const navigate = useNavigate();

  const {
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    audienceFilter,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    setAudienceFilter,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes,
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

  useEffect(() => {
    if (poemSlug) {
      console.log('Finding poem ID for slug:', poemSlug);
      const poemId = findPoemBySlug(poemSlug);
      
      if (poemId) {
        console.log('Setting selected poem ID from slug:', poemId);
        setSelectedPoemId(poemId);
      } else {
        console.log('Poem not found for slug:', poemSlug);
        navigate('/poemsland', { replace: true });
      }
    } else {
      setSelectedPoemId(null);
    }
  }, [poemSlug, findPoemBySlug, setSelectedPoemId, navigate]);

  useEffect(() => {
    if (selectedPoem) {
      document.title = `${selectedPoem.title} - PoemsLand`;
    } else {
      document.title = "PoemsLand - Sammlung personalisierter Gedichte";
    }
  }, [selectedPoem]);

  const handleGoBack = () => {
    setSelectedPoemId(null);
    navigate('/poemsland', { replace: true });
  };

  const handleCreatePoem = () => {
    navigate('/generator');
  };

  const navigateToPoemDetail = (poemId: string) => {
    const slug = getSlugForPoemId(poemId);
    if (slug) {
      navigate(`/poemsland/${slug}`);
    }
  };

  // Host and URL for SEO
  const host = window.location.origin;
  const poemUrl = selectedPoem ? `${host}/poemsland/${getSlugForPoemId(selectedPoem.id) || selectedPoem.id}` : '';

  return (
    <div className="min-h-screen bg-white">
      {selectedPoem && (
        <>
          <PoemSEO poem={selectedPoem} isPreview={false} />
          <PoemStructuredData poem={selectedPoem} host={host} poemUrl={poemUrl} />
        </>
      )}
      
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow px-4">
          {selectedPoemId ? (
            <SinglePoemView 
              poem={selectedPoem}
              isLoading={isLoading}
              navigateBack={handleGoBack}
              isPreview={false}
            />
          ) : (
            <PoemsListView 
              filteredPoems={filteredPoems}
              isLoading={isLoading}
              occasionFilter={occasionFilter}
              contentTypeFilter={contentTypeFilter}
              audienceFilter={audienceFilter}
              setOccasionFilter={setOccasionFilter}
              setContentTypeFilter={setContentTypeFilter}
              setAudienceFilter={setAudienceFilter}
              clearFilters={clearFilters}
              getUniqueOccasions={getUniqueOccasions}
              getUniqueContentTypes={getUniqueContentTypes}
              getUniqueAudiences={getUniqueAudiences}
              handleDeletePoem={handleDeletePoem}
              navigateToPoemDetail={navigateToPoemDetail}
              handleCreatePoem={handleCreatePoem}
              getOccasionDisplay={getOccasionDisplay}
              getContentTypeDisplay={getContentTypeDisplay}
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
