
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';
import { generatePoemSlugs } from '@/utils/poem-slug-utils';

// Define a simpler interface for the return value to avoid infinite recursion
export interface PoemFetchingResult {
  poems: Poem[];
  isLoading: boolean;
  poemSlugs: {[key: string]: string};
  slugToId: {[key: string]: string};
  page: number;
  hasMore: boolean;
  totalCount: number;
  poemsPerPage: number;
  nextPage: () => void;
  prevPage: () => void;
  getPoemSeoMetadata: (poemId: string) => {description: string, keywords: string[]};
}

export const usePoemFetching = (language: 'en' | 'de' = 'de'): PoemFetchingResult => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [poemSlugs, setPoemSlugs] = useState<{[key: string]: string}>({});
  const [slugToId, setSlugToId] = useState<{[key: string]: string}>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [seoMetadata, setSeoMetadata] = useState<{[key: string]: {description: string, keywords: string[]}}>({});
  const poemsPerPage = 12;

  // Fetch poems from Supabase
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        // First get the total count for pagination
        const query = supabase
          .from('user_poems')
          .select('*', { count: 'exact', head: true })
          .or('batch_created.is.null,and(batch_created.eq.true,status.in.("published","hidden"))');
        
        // Add language filter
        if (language === 'en') {
          query.eq('language', 'en');
        } else {
          // For German, either get poems with language=de or ones without language field (legacy data)
          query.or('language.eq.de,language.is.null');
        }
        
        const { count, error: countError } = await query;
        
        if (countError) throw countError;
        
        setTotalCount(count || 0);
        
        // Then fetch the actual page of data
        const dataQuery = supabase
          .from('user_poems')
          .select('*')
          .or('batch_created.is.null,and(batch_created.eq.true,status.in.("published","hidden"))')
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        // Add the same language filter
        if (language === 'en') {
          dataQuery.eq('language', 'en');
        } else {
          dataQuery.or('language.eq.de,language.is.null');
        }
        
        const { data, error } = await dataQuery;
        
        if (error) throw error;
        
        // Pre-process poems for SEO metadata
        const processedPoems = data || [];
        const metadata: {[key: string]: {description: string, keywords: string[]}} = {};
        
        processedPoems.forEach(poem => {
          // Generate SEO description from poem content (first 160 chars)
          const description = poem.content
            ? poem.content.substring(0, 160).trim() + (poem.content.length > 160 ? '...' : '')
            : '';
            
          // Extract keywords from poem keywords field or content
          const keywordsString = poem.keywords || '';
          const extractedKeywords = keywordsString.split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);
            
          metadata[poem.id] = {
            description,
            keywords: extractedKeywords
          };
        });
        
        setSeoMetadata(metadata);
        setPoems(processedPoems);
        setHasMore((page * poemsPerPage) < (count || 0));
        
        // Generate slugs for all poems
        const slugsResult = generatePoemSlugs(processedPoems);
        setPoemSlugs(slugsResult.poemSlugs);
        setSlugToId(slugsResult.slugToId);
      } catch (error) {
        console.error('Error fetching poems:', error);
        const errorMsg = language === 'en' ? 'Error loading poems' : 'Fehler beim Laden der Gedichte';
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, [page, language]);

  // Method to get SEO metadata for a specific poem
  const getPoemSeoMetadata = (poemId: string) => {
    return seoMetadata[poemId] || { description: '', keywords: [] };
  };

  const nextPage = () => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };

  return {
    poems,
    isLoading,
    poemSlugs,
    slugToId,
    page,
    hasMore,
    totalCount,
    poemsPerPage,
    nextPage,
    prevPage,
    getPoemSeoMetadata
  };
};
