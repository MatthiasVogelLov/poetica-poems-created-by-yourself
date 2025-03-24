
import React from 'react';
import { Helmet } from 'react-helmet';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { Poem } from '@/hooks/use-poems';

interface PoemSEOProps {
  selectedPoem: Poem | null;
  selectedPoemId: string | null;
  getSlugForPoemId: (id: string) => string | null;
  structuredDataString: string;
}

const PoemSEO: React.FC<PoemSEOProps> = ({
  selectedPoem,
  selectedPoemId,
  getSlugForPoemId,
  structuredDataString
}) => {
  const metaDescription = selectedPoem 
    ? `Lesen Sie das Gedicht "${selectedPoem.title}" zum Thema ${getContentTypeDisplay(selectedPoem.content_type || '')} für ${getOccasionDisplay(selectedPoem.occasion || '')}. Ein schönes Gedicht in PoemsLand.`
    : "Entdecken Sie eine vielfältige Sammlung personalisierter Gedichte für jeden Anlass in PoemsLand - von Geburtstagen und Hochzeiten bis hin zu besonderen Jubiläen und Feiertagen.";

  const keywords = selectedPoem
    ? `Gedicht, ${selectedPoem.title}, ${getOccasionDisplay(selectedPoem.occasion || '')}, ${getContentTypeDisplay(selectedPoem.content_type || '')}, personalisiert, Poesie`
    : "Gedichte, personalisierte Gedichte, Gedichtsammlung, PoemsLand, Hochzeit, Geburtstag, Jubiläum, Poesie, Reimgedichte, Liebesgedichte";

  const canonicalPath = selectedPoem && selectedPoemId
    ? `/poemsland/${getSlugForPoemId(selectedPoemId) || ''}` 
    : '/poemsland';

  return (
    <>
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
      </Helmet>
    </>
  );
};

export default PoemSEO;
