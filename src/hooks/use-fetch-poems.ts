
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
        // First, get the total count
        const { count, error: countError } = await supabase
          .from('user_poems')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Set the total count from the count query
        setTotalCount(count || 0);
        
        // Then fetch the actual data in a separate query
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .eq('language', language)
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        if (error) throw error;
        
        // Filter the data in memory to avoid complex query chains
        const filteredData = data ? data.filter(poem => 
          poem.batch_created === null || 
          poem.batch_created === true || 
          poem.status === 'published' || 
          poem.status === 'hidden'
        ) : [];
        
        setPoems(filteredData);
        setHasMore((page * poemsPerPage) < (count || 0));
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
