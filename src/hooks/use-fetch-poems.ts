
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
        console.log(`Fetching poems for language: ${language}`);
        
        // Define allowed statuses for consistency
        const allowedStatuses = [null, 'draft', 'published'];
        
        // Get total count with language and status filters
        const countQuery = supabase
          .from('user_poems')
          .select('*', { count: 'exact', head: true })
          .eq('language', language)
          .in('status', allowedStatuses);
        
        const { count: totalCount, error: countError } = await countQuery;
        
        if (countError) throw countError;
        
        setTotalCount(totalCount || 0);
        console.log(`Total poems for language ${language}: ${totalCount}`);
        
        // Fetch the poems with pagination
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .eq('language', language)
          .in('status', allowedStatuses)
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        if (error) throw error;
        
        setPoems(data || []);
        setHasMore((page * poemsPerPage) < (totalCount || 0));
        console.log(`Fetched ${data?.length || 0} poems for display`);
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
