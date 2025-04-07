
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
        
        // Use string literals to avoid type inference issues
        const allowedStatusValues = ['draft', 'published', null];
        
        // Get total count with language and status filters
        let countQuery = supabase
          .from('user_poems')
          .select('*', { count: 'exact', head: true })
          .eq('language', language);
        
        // Add the in condition with explicit type casting
        countQuery = countQuery.in('status', allowedStatusValues as any[]);
        
        const { count: totalCount, error: countError } = await countQuery;
        
        if (countError) throw countError;
        
        setTotalCount(totalCount || 0);
        console.log(`Total poems for language ${language}: ${totalCount}`);
        
        // Fetch the poems with pagination
        let poemsQuery = supabase
          .from('user_poems')
          .select('*')
          .eq('language', language);
          
        // Add the in condition with explicit type casting
        poemsQuery = poemsQuery.in('status', allowedStatusValues as any[])
          .order('created_at', { ascending: false })
          .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
        
        const { data, error } = await poemsQuery;
        
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
