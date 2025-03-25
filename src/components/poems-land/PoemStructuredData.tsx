
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
  const occasion = getOccasionDisplay(poem.occasion || '');
  const contentType = getContentTypeDisplay(poem.content_type || '');
  
  // Structured data for the poem (Schema.org CreativeWork with Poem extension)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Poem",
    "headline": poem.title,
    "name": poem.title,
    "text": poem.content,
    "articleBody": poem.content,
    "datePublished": formattedDate,
    "genre": occasion,
    "keywords": [
      occasion,
      contentType,
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
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": poemUrl
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
