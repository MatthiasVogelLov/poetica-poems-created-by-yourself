
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

  // Include the full poem content in a pre-rendered div for SEO
  const poemContentHtml = poem.content.replace(/\n/g, '<br />');
  const seoContentString = `<div class="hidden-seo-content"><h1>${poem.title}</h1><div>${poemContentHtml}</div></div>`;

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
        <noscript>
          {seoContentString}
        </noscript>
      )}
    </Helmet>
  );
};

export default PoemSEO;
