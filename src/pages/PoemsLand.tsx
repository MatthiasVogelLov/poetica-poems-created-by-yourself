
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import PoemFilters from '@/components/poems-land/PoemFilters';
import PoemsList from '@/components/poems-land/PoemsList';
import SinglePoemView from '@/components/poems-land/SinglePoemView';
import { usePoems } from '@/hooks/use-poems';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';

const PoemsLand = () => {
  const { poemId } = useParams();
  const navigate = useNavigate();

  const {
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes
  } = usePoems();

  // Set the selectedPoemId from URL params when the component mounts
  useEffect(() => {
    if (poemId) {
      setSelectedPoemId(poemId);
    }
  }, [poemId, setSelectedPoemId]);

  useEffect(() => {
    if (selectedPoem) {
      document.title = `${selectedPoem.title} - PoemsLand`;
    } else {
      document.title = "PoemsLand - Sammlung personalisierter Gedichte";
    }
  }, [selectedPoem]);

  const metaDescription = selectedPoem 
    ? `Lesen Sie das Gedicht "${selectedPoem.title}" zum Thema ${getContentTypeDisplay(selectedPoem.content_type || '')} für ${getOccasionDisplay(selectedPoem.occasion || '')}. Ein schönes Gedicht in PoemsLand.`
    : "Entdecken Sie eine vielfältige Sammlung personalisierter Gedichte für jeden Anlass in PoemsLand - von Geburtstagen und Hochzeiten bis hin zu besonderen Jubiläen und Feiertagen.";

  const keywords = selectedPoem
    ? `Gedicht, ${selectedPoem.title}, ${getOccasionDisplay(selectedPoem.occasion || '')}, ${getContentTypeDisplay(selectedPoem.content_type || '')}, personalisiert, Poesie`
    : "Gedichte, personalisierte Gedichte, Gedichtsammlung, PoemsLand, Hochzeit, Geburtstag, Jubiläum, Poesie, Reimgedichte, Liebesgedichte";

  const canonicalPath = selectedPoemId 
    ? `/poemsland/${selectedPoemId}` 
    : '/poemsland';

  // Create structured data objects
  const createPoemStructuredData = () => {
    if (!selectedPoem) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Poem", 
      "name": selectedPoem.title || '',
      "author": {
        "@type": "Organization",
        "name": "PoemsLand"
      },
      "datePublished": selectedPoem.created_at || '',
      "keywords": [selectedPoem.occasion, selectedPoem.content_type].filter(Boolean).join(', '),
      "inLanguage": "de"
    };
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "PoemsLand - Gedichtsammlung",
    "description": "Eine Sammlung personalisierter Gedichte für verschiedene Anlässe und Themen",
    "inLanguage": "de"
  };

  // Choose the appropriate structured data and convert to safe JSON string
  const structuredData = createPoemStructuredData() || collectionStructuredData;
  const jsonLdString = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  // When going back from a single poem view, navigate to the poems list
  const handleGoBack = () => {
    setSelectedPoemId(null);
    navigate('/poemsland', { replace: true });
  };

  // Navigate to the poem generator
  const handleCreatePoem = () => {
    navigate('/generator');
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{selectedPoem ? `${selectedPoem.title} - PoemsLand` : "PoemsLand - Sammlung personalisierter Gedichte"}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={selectedPoem ? `${selectedPoem.title} - PoemsLand` : "PoemsLand"} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://poetica.apvora.com${canonicalPath}`} />
        <link rel="canonical" href={`https://poetica.apvora.com${canonicalPath}`} />
        {selectedPoem && (
          <>
            <meta property="article:published_time" content={selectedPoem.created_at || ''} />
            <meta property="article:section" content={getContentTypeDisplay(selectedPoem.content_type || '')} />
            <meta property="article:tag" content={getOccasionDisplay(selectedPoem.occasion || '')} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      </Helmet>
      
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow px-4">
          {selectedPoemId ? (
            <SinglePoemView 
              poem={selectedPoem}
              goBack={handleGoBack}
              getOccasionDisplay={getOccasionDisplay}
              getContentTypeDisplay={getContentTypeDisplay}
            />
          ) : (
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
                setSelectedPoemId={(id) => navigate(`/poemsland/${id}`)}
                getOccasionDisplay={getOccasionDisplay}
                getContentTypeDisplay={getContentTypeDisplay}
              />
            </>
          )}
          
          {/* Create Your Own Poem Button */}
          <div className="mt-12 text-center">
            <Button 
              onClick={handleCreatePoem}
              className="px-6 py-6 text-base flex items-center gap-2"
              size="lg"
            >
              <PenLine className="w-5 h-5" />
              <span>Erstellen Sie Ihr eigenes Gedicht</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PoemsLand;
