
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';
import { useLanguage } from '@/contexts/LanguageContext';

// Define a custom type for simplified response handling
type SimplePoemResponse = {
  data: Poem[] | null;
  error: Error | null;
};

export const useFetchPoems = (page: number, poemsPerPage: number) => {
  const { language } = useLanguage();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching poems for interface language: ${language}`);
        
        // Fetch all poems without language filtering (since the column doesn't exist)
        const result: SimplePoemResponse = await supabase
          .from('user_poems')
          .select('*') as SimplePoemResponse;
        
        if (result.error) throw result.error;
        
        const allData = result.data || [];
        console.log(`Retrieved ${allData.length} total poems`);
        
        // Filter by status
        const filteredByStatus = allData.filter(poem =>
          poem.batch_created === null ||
          poem.batch_created === true ||
          poem.status === 'published' ||
          poem.status === 'hidden'
        );
        
        // Set total count for pagination
        setTotalCount(filteredByStatus.length);
        
        // Sort by date (descending)
        filteredByStatus.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        
        // Apply pagination
        const startIdx = (page - 1) * poemsPerPage;
        const endIdx = page * poemsPerPage;
        const paginatedData = filteredByStatus.slice(startIdx, endIdx);
        
        setPoems(paginatedData);
        setHasMore(endIdx < filteredByStatus.length);
        console.log(`Filtered to ${paginatedData.length} poems for display`);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error(language === 'en' ? 'Error loading poems' : 'Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, [page, poemsPerPage, language]);

  return { poems, isLoading, totalCount, hasMore };
};
