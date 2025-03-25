
import React from 'react';
import { Helmet } from 'react-helmet';
import { Poem } from '@/types/poem-types';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay } from '@/utils/poem-display-helpers';

interface PoemStructuredDataProps {
  poem: Poem;
  host: string;
  poemUrl: string;
}

const PoemStructuredData: React.FC<PoemStructuredDataProps> = ({ poem, host, poemUrl }) => {
  if (!poem) return null;

  const formattedDate = poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString();
  const audience = poem.audience ? getAudienceDisplay(poem.audience) : '';
  
  // Structured data for the poem (Schema.org CreativeWork with Poem extension)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Poem",
    "headline": poem.title,
    "name": poem.title,
    "text": poem.content,
    "datePublished": formattedDate,
    "genre": getOccasionDisplay(poem.occasion || ''),
    "keywords": [
      getOccasionDisplay(poem.occasion || ''),
      getContentTypeDisplay(poem.content_type || ''),
      audience,
      "Gedicht", "Poem", "PoemsLand"
    ].filter(Boolean),
    "url": poemUrl,
    "isAccessibleForFree": true,
    "audience": audience ? {
      "@type": "Audience",
      "audienceType": audience
    } : undefined,
    "publisher": {
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
