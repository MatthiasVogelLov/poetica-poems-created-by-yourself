
import React from 'react';
import { Helmet } from 'react-helmet';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay } from '@/utils/poem-display-helpers';

interface PoemSEOProps {
  poem: any;
  isPreview?: boolean;
}

const PoemSEO: React.FC<PoemSEOProps> = ({ poem, isPreview = false }) => {
  // Don't add SEO for preview pages
  if (isPreview) {
    return null;
  }

  const host = window.location.origin;
  const poemUrl = `${host}/poemsland/${poem.id}`;
  
  // Generate meta description
  const occasion = getOccasionDisplay(poem.occasion);
  const contentType = getContentTypeDisplay(poem.content_type);
  const audience = poem.audience ? getAudienceDisplay(poem.audience) : '';
  
  const metaDescription = `${poem.title} - Ein Gedicht zum Thema ${contentType}${occasion ? `, passend für ${occasion}` : ''}${audience ? `, für ${audience}` : ''}.`;
  
  // Get the first few lines for description if meta description is too short
  const firstFewLines = poem.content
    .split('\n')
    .slice(0, 2)
    .join(' ')
    .substring(0, 120) + '...';
  
  const finalDescription = metaDescription.length > 80 ? metaDescription : `${metaDescription} ${firstFewLines}`;
  
  // Format poem content for noscript tag with proper HTML formatting
  const formattedPoemContent = poem.content.split('\n').map(line => 
    `<p>${line}</p>`
  ).join('');
  
  // Get content for the noscript tag - improved for better indexing
  const noscriptContent = `
    <div class="poem-container">
      <article itemscope itemtype="https://schema.org/Poem">
        <h1 itemprop="name">${poem.title}</h1>
        <div itemprop="text" class="poem-text">
          ${formattedPoemContent}
        </div>
        <div class="poem-metadata">
          <p><strong>Thema:</strong> <span itemprop="genre">${contentType}</span></p>
          <p><strong>Anlass:</strong> <span itemprop="keywords">${occasion}</span></p>
          ${audience ? `<p><strong>Zielgruppe:</strong> <span itemprop="audience">${audience}</span></p>` : ''}
          <p><strong>Veröffentlicht:</strong> <time itemprop="datePublished" datetime="${poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString()}">${poem.created_at ? new Date(poem.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</time></p>
        </div>
        <meta itemprop="keywords" content="${occasion}, ${contentType}, ${audience}, Gedicht, Poem">
      </article>
    </div>
  `;

  return (
    <Helmet>
      <title>{poem.title} - PoemsLand</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${poem.title} - PoemsLand`} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={poemUrl} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${poem.title} - PoemsLand`} />
      <meta name="twitter:description" content={finalDescription} />
      
      {/* Include the entire poem text to ensure search engines can index it */}
      <meta name="poem-full-text" content={poem.content} />
      <meta name="poem-occasion" content={occasion} />
      <meta name="poem-content-type" content={contentType} />
      <meta name="poem-audience" content={audience} />
      
      {/* Add the full HTML poem content in a json-ld script for search engines */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Poem",
          "headline": poem.title,
          "name": poem.title,
          "description": metaDescription,
          "text": poem.content,
          "articleBody": poem.content,
          "keywords": [occasion, contentType, audience, "Gedicht", "Poem", "PoemsLand"].filter(Boolean).join(', '),
          "datePublished": poem.created_at,
          "dateModified": poem.updated_at || poem.created_at,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": poemUrl
          }
        })}
      </script>
      
      {/* Provide actual content for search engines and noscript scenarios */}
      <noscript dangerouslySetInnerHTML={{ __html: noscriptContent }} />
      
      {/* Additional meta tags for search engines */}
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content={[occasion, contentType, audience, 'gedicht', 'poem', 'poemsland'].filter(Boolean).join(', ')} />
      <link rel="canonical" href={poemUrl} />
      
      {/* Directly add poem HTML content to the page */}
      <style type="text/css">
        {`
          .seo-poem-content { 
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}
      </style>
    </Helmet>
  );
};

export default PoemSEO;
