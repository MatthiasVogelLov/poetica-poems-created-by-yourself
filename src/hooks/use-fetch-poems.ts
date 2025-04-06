
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';
import { useLanguage } from '@/contexts/LanguageContext';

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
        // Get total count with a completely separate query
        const countQuery = await supabase
          .from('user_poems')
          .select('id', { count: 'exact', head: true });
        
        if (countQuery.error) throw countQuery.error;
        
        // Set the total count
        const count = countQuery.count || 0;
        setTotalCount(count);
        
        // Fetch the actual data with a separate, simple query
        const dataQuery = await supabase
          .from('user_poems')
          .select();
        
        if (dataQuery.error) throw dataQuery.error;
        
        // Apply filtering and pagination in memory to avoid complex query chains
        let filteredData = dataQuery.data || [];
        
        // Sort by date (descending)
        filteredData.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        
        // Filter by status
        filteredData = filteredData.filter(poem =>
          poem.batch_created === null ||
          poem.batch_created === true ||
          poem.status === 'published' ||
          poem.status === 'hidden'
        );
        
        // Apply pagination
        const startIdx = (page - 1) * poemsPerPage;
        const endIdx = page * poemsPerPage;
        const paginatedData = filteredData.slice(startIdx, endIdx);
        
        setPoems(paginatedData);
        setHasMore((page * poemsPerPage) < count);
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
