
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay, getStyleDisplay } from '@/utils/poem-display-helpers';
import PoemSEO from '@/components/poems-land/PoemSEO';
import PoemsListView from '@/components/poems-land/PoemsListView';
import { Helmet } from 'react-helmet';

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
    styleFilter,
    audienceFilter,
    searchQuery,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    setStyleFilter,
    setAudienceFilter,
    setSearchQuery,
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
      
      // Inject CSS for better SEO markup in print and reader modes
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          .poem-content { font-size: 14pt; line-height: 1.5; }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
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

  return (
    <div className="min-h-screen bg-white">
      {/* Global SEO for PoemsLand page */}
      {!selectedPoem && (
        <Helmet>
          <title>PoemsLand - Sammlung personalisierter Gedichte</title>
          <meta name="description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen. Finde inspirierende Gedichte oder erstelle dein eigenes personalisiertes Gedicht." />
          <meta name="keywords" content="Gedichte, Poesie, personalisierte Gedichte, Geburtstag, Liebe, Hochzeit, PoemsLand" />
          <link rel="canonical" href={`${host}/poemsland`} />
          <meta property="og:title" content="PoemsLand - Sammlung personalisierter Gedichte" />
          <meta property="og:description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen." />
          <meta property="og:url" content={`${host}/poemsland`} />
          <meta property="og:type" content="website" />
          <meta name="twitter:title" content="PoemsLand - Sammlung personalisierter Gedichte" />
          <meta name="twitter:description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen." />
          
          {/* Structured data for collection page */}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "PoemsLand - Sammlung personalisierter Gedichte",
            "description": "Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen.",
            "url": `${host}/poemsland`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "PoemsLand",
              "url": host
            }
          })}</script>
        </Helmet>
      )}
      
      {/* Add SEO component for the selected poem */}
      {selectedPoem && <PoemSEO poem={selectedPoem} isPreview={false} host={host} />}
      
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow px-4">
          {selectedPoemId ? (
            <SinglePoemView 
              poem={selectedPoem}
              isLoading={isLoading}
              navigateBack={handleGoBack}
              isPreview={false}
              handleCreatePoem={handleCreatePoem}
            />
          ) : (
            <PoemsListView 
              filteredPoems={filteredPoems}
              isLoading={isLoading}
              occasionFilter={occasionFilter}
              contentTypeFilter={contentTypeFilter}
              styleFilter={styleFilter}
              audienceFilter={audienceFilter}
              searchQuery={searchQuery}
              setOccasionFilter={setOccasionFilter}
              setContentTypeFilter={setContentTypeFilter}
              setStyleFilter={setStyleFilter}
              setAudienceFilter={setAudienceFilter}
              setSearchQuery={setSearchQuery}
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
