
import React from 'react';
import { Helmet } from 'react-helmet';
import { Poem } from '@/types/poem-types';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';

interface PoemSEOProps {
  poem: Poem | null;
  isPreview?: boolean;
}

const PoemSEO: React.FC<PoemSEOProps> = ({ poem, isPreview = false }) => {
  if (!poem) return null;

  // Extract first 160 characters of the poem content for the description
  const description = poem.content
    ? `${poem.content.substring(0, 157).trim()}...`
    : `Ein Gedicht zum Thema ${getOccasionDisplay(poem.occasion || '')} für PoemsLand.`;

  const keywords = [
    'Gedicht', 
    'Poem', 
    'Lyrik', 
    getOccasionDisplay(poem.occasion || ''),
    getContentTypeDisplay(poem.content_type || '')
  ].filter(Boolean).join(', ');

  const title = isPreview 
    ? `Vorschau: ${poem.title} | PoemsLand` 
    : `${poem.title} | PoemsLand`;

  const robots = isPreview ? 'noindex, nofollow' : 'index, follow';

  // Make poem content SEO-friendly by directly adding it to the HTML source
  // This ensures search engines can index the full content
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      
      {/* OpenGraph tags for social sharing */}
      <meta property="og:title" content={poem.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="PoemsLand" />
      
      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={poem.title} />
      <meta name="twitter:description" content={description} />

      {/* Pre-rendered poem content for SEO (hidden from view but visible to crawlers) */}
      {!isPreview && (
        <>
          {/* Add the poem content directly to the HTML for search engines */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": poem.title,
              "text": poem.content
            })}
          </script>
          
          {/* Add a hidden div with the poem content that will be rendered in the HTML source */}
          <style>
            {`.poem-seo-content { display: none; }`}
          </style>
        </>
      )}
    </Helmet>
  );
};

export default PoemSEO;
