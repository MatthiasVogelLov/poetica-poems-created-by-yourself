import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem, PoemHookState } from '@/types/poem-types';
import { generatePoemSlugs } from '@/utils/poem-slug-utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Hook to fetch and manage poem data
export const usePoemsData = (): [
  PoemHookState,
  React.Dispatch<React.SetStateAction<Poem[]>>,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const { language } = useLanguage();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [poemSlugs, setPoemSlugs] = useState<{[key: string]: string}>({});
  const [slugToId, setSlugToId] = useState<{[key: string]: string}>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const poemsPerPage = 12;
  const [seoMetadata, setSeoMetadata] = useState<{[key: string]: {description: string, keywords: string[]}}>({});

  // Fetch poems from Supabase
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        // Use a simple query to get the count without any complex filtering
        const countResponse = await supabase
          .from('user_poems')
          .select('id', { count: 'exact', head: true });
        
        if (countResponse.error) throw countResponse.error;
        const totalCount = countResponse.count || 0;
        
        // Separate query for data retrieval with minimal chaining
        const dataResponse = await supabase
          .from('user_poems')
          .select()
          .eq('language', language)
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        if (dataResponse.error) throw dataResponse.error;
        
        // Filter in memory to avoid complex query chains
        const filteredData = (dataResponse.data || []).filter(poem => 
          poem.batch_created === null || 
          poem.batch_created === true || 
          poem.status === 'published' || 
          poem.status === 'hidden'
        );
        
        // Process poem data for SEO
        const metadata: {[key: string]: {description: string, keywords: string[]}} = {};
        filteredData.forEach(poem => {
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
        setPoems(filteredData);
        setFilteredPoems(filteredData);
        setHasMore((page * poemsPerPage) < totalCount);
        
        // Generate slugs for all poems
        const { poemSlugs, slugToId } = generatePoemSlugs(filteredData);
        setPoemSlugs(poemSlugs);
        setSlugToId(slugToId);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error(language === 'en' ? 'Error loading poems' : 'Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, [page, language]);

  // Fetch a single poem when selected by ID
  useEffect(() => {
    if (selectedPoemId) {
      console.log('Fetching single poem with ID:', selectedPoemId);
      
      const fetchSinglePoem = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('user_poems')
            .select('*')
            .eq('id', selectedPoemId)
            .single();
          
          if (error) {
            console.error('Error fetching single poem:', error);
            throw error;
          }
          
          console.log('Poem data received:', data);
          
          // Generate SEO metadata for this specific poem
          if (data) {
            const description = data.content
              ? data.content.substring(0, 160).trim() + (data.content.length > 160 ? '...' : '')
              : '';
              
            const keywordsString = data.keywords || '';
            const extractedKeywords = keywordsString.split(',')
              .map(k => k.trim())
              .filter(k => k.length > 0);
              
            setSeoMetadata(prev => ({
              ...prev,
              [data.id]: {
                description,
                keywords: extractedKeywords
              }
            }));
          }
          
          setSelectedPoem(data);
        } catch (error) {
          console.error('Error fetching poem:', error);
          toast.error(language === 'en' ? 'Error loading poem' : 'Fehler beim Laden des Gedichts');
          setSelectedPoem(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSinglePoem();
    } else {
      setSelectedPoem(null);
    }
  }, [selectedPoemId, language]);

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

  const state: PoemHookState = {
    poems,
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    styleFilter,
    audienceFilter,
    searchQuery,
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

  return [state, setPoems, setSelectedPoemId];
};
