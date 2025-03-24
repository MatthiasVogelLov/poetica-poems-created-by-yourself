
import React from 'react';
import { Helmet } from 'react-helmet';
import { Poem } from '@/types/poem-types';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';

interface PoemStructuredDataProps {
  poem: Poem;
  host: string;
  poemUrl: string;
}

const PoemStructuredData: React.FC<PoemStructuredDataProps> = ({ poem, host, poemUrl }) => {
  if (!poem) return null;

  const formattedDate = poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString();
  
  // Structured data for the poem (Schema.org CreativeWork)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "headline": poem.title,
    "name": poem.title,
    "text": poem.content,
    "datePublished": formattedDate,
    "genre": getOccasionDisplay(poem.occasion || ''),
    "keywords": [
      getOccasionDisplay(poem.occasion || ''),
      getContentTypeDisplay(poem.content_type || ''),
      "Gedicht", "Poem", "PoemsLand"
    ],
    "url": poemUrl,
    "isAccessibleForFree": true,
    "provider": {
      "@type": "Organization",
      "name": "PoemsLand",
      "url": host
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default PoemStructuredData;
