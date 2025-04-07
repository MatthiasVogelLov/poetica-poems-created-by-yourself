import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useBatchPoems = () => {
  const { language } = useLanguage();
  const [batchPoems, setBatchPoems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishing, setPublishing] = useState<Record<string, boolean>>({});
  const [hiding, setHiding] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const poemsPerPage = 10;

  useEffect(() => {
    fetchBatchPoems();
  }, [page, language]);

  const fetchBatchPoems = async () => {
    setIsLoading(true);
    try {
      const allowedStatuses: (string | null)[] = ['draft', 'published', null];
      const { count: totalCountResult, error: countError } = await supabase
        .from('user_poems')
        .select('*', { count: 'exact', head: true })
        .eq('batch_created', true)
        .eq('language', language);
      
      if (countError) throw countError;
      
      setTotalCount(totalCountResult || 0);
      
      const { count: visibleCountResult, error: visibleCountError } = await supabase
        .from('user_poems')
        .select('*', { count: 'exact', head: true })
        .eq('batch_created', true)
        .eq('language', language)
        .in('status', allowedStatuses);
      
      if (visibleCountError) throw visibleCountError;
      
      setVisibleCount(visibleCountResult || 0);
      
      const totalPages = Math.ceil((visibleCountResult || 0) / poemsPerPage);
      if (page > totalPages && totalPages > 0 && page !== 1) {
        setPage(totalPages);
        setIsLoading(false);
        return;
      }
      
      if (visibleCountResult === 0) {
        setBatchPoems([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_poems')
        .select('*')
        .eq('batch_created', true)
        .eq('language', language)
        .in('status', allowedStatuses)
        .order('created_at', { ascending: false })
        .range((page - 1) * poemsPerPage, page * poemsPerPage - 1);
      
      if (error) throw error;
      
      setBatchPoems(data || []);
      setHasMore((page * poemsPerPage) < (visibleCountResult || 0));
    } catch (error) {
      console.error('Error fetching batch poems:', error);
      toast.error('Fehler beim Laden der Batch-Gedichte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (poemId: string, newStatus: 'published' | 'hidden' | 'deleted') => {
    if (publishing[poemId] || hiding[poemId]) {
      return;
    }
    
    try {
      if (newStatus === 'hidden') {
        setHiding(prev => ({ ...prev, [poemId]: true }));
      } else {
        setPublishing(prev => ({ ...prev, [poemId]: true }));
      }
      
      const { error } = await supabase.functions.invoke('manage-poem', {
        body: {
          action: 'update',
          poemId: poemId,
          poemData: { status: newStatus }
        }
      });
      
      if (error) throw error;
      
      if (newStatus === 'hidden' || newStatus === 'deleted') {
        setBatchPoems(prev => prev.filter(poem => poem.id !== poemId));
        setVisibleCount(prev => prev - 1);
        
        const actionText = newStatus === 'hidden' ? 'ausgeblendet' : 'gelöscht';
        toast.success(`Gedicht ${actionText}`);
      } else {
        setBatchPoems(prev => 
          prev.map(poem => 
            poem.id === poemId ? { ...poem, status: newStatus } : poem
          )
        );
        toast.success(`Gedicht veröffentlicht`);
      }
    } catch (error) {
      console.error('Error updating poem status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    } finally {
      if (newStatus === 'hidden') {
        setHiding(prev => ({ ...prev, [poemId]: false }));
      } else {
        setPublishing(prev => ({ ...prev, [poemId]: false }));
      }
    }
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
    batchPoems,
    isLoading,
    fetchBatchPoems,
    handleStatusChange,
    publishing,
    hiding,
    page,
    totalCount,
    visibleCount,
    hasMore,
    nextPage,
    prevPage,
    poemsPerPage
  };
};
