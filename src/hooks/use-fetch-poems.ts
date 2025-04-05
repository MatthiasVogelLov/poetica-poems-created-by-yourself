
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
        // Get count with a simple query to avoid TypeScript recursion
        const countResponse = await supabase
          .from('user_poems')
          .select('id', { count: 'exact', head: true });
        
        if (countResponse.error) throw countResponse.error;
        const count = countResponse.count || 0;
        setTotalCount(count);
        
        // Fetch data with minimal chaining
        const response = await supabase
          .from('user_poems')
          .select()
          .eq('language', language)
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        if (response.error) throw response.error;
        
        // Filter in memory to avoid complex query chains
        const filteredData = (response.data || []).filter(poem => 
          poem.batch_created === null || 
          poem.batch_created === true || 
          poem.status === 'published' || 
          poem.status === 'hidden'
        );
        
        setPoems(filteredData);
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
