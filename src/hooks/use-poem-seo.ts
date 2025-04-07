
import { useState, useEffect } from 'react';
import { Poem } from '@/types/poem-types';

export interface PoemSeoMetadata {
  description: string;
  keywords: string[];
}

export const usePoemSeo = (poems: Poem[]) => {
  const [seoMetadata, setSeoMetadata] = useState<{[key: string]: PoemSeoMetadata}>({});
  
  useEffect(() => {
    const metadata: {[key: string]: PoemSeoMetadata} = {};
    
    poems.forEach(poem => {
      // Generate SEO description from poem content (first 160 chars)
      const description = poem.content
        ? poem.content.substring(0, 160).trim() + (poem.content.length > 160 ? '...' : '')
        : '';
        
      // Extract keywords from poem keywords field
      let extractedKeywords: string[] = [];
      
      if (poem.keywords) {
        if (typeof poem.keywords === 'string') {
          extractedKeywords = poem.keywords.split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);
        } else if (Array.isArray(poem.keywords)) {
          extractedKeywords = poem.keywords.filter(k => k.length > 0);
        }
      }
        
      metadata[poem.id] = {
        description,
        keywords: extractedKeywords
      };
    });
    
    setSeoMetadata(metadata);
  }, [poems]);
  
  const getPoemSeoMetadata = (poemId: string): PoemSeoMetadata => {
    return seoMetadata[poemId] || { description: '', keywords: [] };
  };
  
  return { seoMetadata, getPoemSeoMetadata };
};
