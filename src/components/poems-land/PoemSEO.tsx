
import React from 'react';
import { Helmet } from 'react-helmet';
import { Poem } from '@/types/poem-types';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay } from '@/utils/poem-display-helpers';

interface PoemSEOProps {
  poem: Poem;
  isPreview?: boolean;
  host?: string;
}

const PoemSEO: React.FC<PoemSEOProps> = ({ poem, isPreview = false, host }) => {
  // Don't add SEO for preview pages
  if (isPreview || !poem) {
    return null;
  }

  const siteHost = host || window.location.origin;
  const poemUrl = `${siteHost}/poemsland/${poem.id}`;
  
  // Generate meta description
  const occasion = getOccasionDisplay(poem.occasion || '');
  const contentType = getContentTypeDisplay(poem.content_type || '');
  const audience = poem.audience ? getAudienceDisplay(poem.audience) : '';
  
  const metaDescription = `${poem.title} - Ein Gedicht zum Thema ${contentType}${occasion ? `, passend für ${occasion}` : ''}${audience ? `, für ${audience}` : ''}.`;
  
  // Get the first few lines for description if meta description is too short
  const firstFewLines = poem.content
    .split('\n')
    .slice(0, 2)
    .join(' ')
    .substring(0, 120) + '...';
  
  const finalDescription = metaDescription.length > 80 ? metaDescription : `${metaDescription} ${firstFewLines}`;
  
  // Format poem content for HTML output
  const formattedPoemContent = poem.content
    .split('\n')
    .map(line => `<p>${line}</p>`)
    .join('');

  const formattedDate = poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString();
  
  // Main structured data for the poem using Schema.org
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Poem",
    "headline": poem.title,
    "name": poem.title,
    "text": poem.content,
    "articleBody": poem.content,
    "datePublished": formattedDate,
    "genre": occasion,
    "description": finalDescription,
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
      "url": siteHost
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": poemUrl
    },
    "inLanguage": "de"
  };

  return (
    <Helmet>
      <title>{poem.title} - PoemsLand</title>
      <meta name="description" content={finalDescription} />
      
      {/* Static HTML version of the poem - This is crucial for SEO */}
      <noscript>
        {`
          <div itemscope itemtype="https://schema.org/Poem">
            <h1 itemprop="name">${poem.title}</h1>
            <div itemprop="text">
              ${formattedPoemContent}
            </div>
            <p>Anlass: <span itemprop="keywords">${occasion}</span></p>
            <p>Thema: <span itemprop="genre">${contentType}</span></p>
            ${audience ? `<p>Zielgruppe: <span itemprop="audience">${audience}</span></p>` : ''}
            <meta itemprop="datePublished" content="${formattedDate}">
          </div>
        `}
      </noscript>

      {/* Open Graph */}
      <meta property="og:title" content={`${poem.title} - PoemsLand`} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={poemUrl} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${poem.title} - PoemsLand`} />
      <meta name="twitter:description" content={finalDescription} />
      
      {/* JSON-LD Structured Data - Most important for search engines */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional SEO metadata */}
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content={[occasion, contentType, audience, 'gedicht', 'poem', 'poemsland'].filter(Boolean).join(', ')} />
      <link rel="canonical" href={poemUrl} />
      
      {/* Direct embedding of poem content in meta tags for search engines */}
      <meta property="poem:content" content={poem.content} />
      <meta property="poem:title" content={poem.title} />
      <meta property="poem:occasion" content={occasion} />
      <meta property="poem:content-type" content={contentType} />
      <meta property="poem:audience" content={audience} />
      
      {/* Hidden poem content for search engines */}
      <script data-poem-content type="text/plain">
        {poem.content}
      </script>
    </Helmet>
  );
};

export default PoemSEO;
