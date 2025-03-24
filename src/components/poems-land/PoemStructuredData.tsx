
import React from 'react';
import type { Poem } from '@/types/poem-types';

interface PoemStructuredDataProps {
  structuredDataString: string;
}

const PoemStructuredData: React.FC<PoemStructuredDataProps> = ({ structuredDataString }) => {
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: structuredDataString
      }}
    />
  );
};

export default PoemStructuredData;

export const getStructuredData = (selectedPoem: Poem | null) => {
  if (!selectedPoem) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "PoemsLand - Gedichtsammlung",
      "description": "Eine Sammlung personalisierter Gedichte für verschiedene Anlässe und Themen",
      "inLanguage": "de"
    };
  }
  
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
