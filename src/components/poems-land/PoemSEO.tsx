
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
  
  // Format poem content for structured data and noscript tag
  const formattedPoemContent = poem.content.replace(/\n/g, '<br>');
  
  // Get content for the noscript tag
  const noscriptContent = `
    <h1>${poem.title}</h1>
    <p>${formattedPoemContent}</p>
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
      
      {/* Schema.org markup for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": poem.title,
          "description": metaDescription,
          "articleBody": poem.content,
          "keywords": [occasion, contentType, audience].filter(Boolean).join(', '),
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
    </Helmet>
  );
};

export default PoemSEO;
