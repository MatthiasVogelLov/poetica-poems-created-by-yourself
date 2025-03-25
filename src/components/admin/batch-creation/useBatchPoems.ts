
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBatchPoems = () => {
  const [batchPoems, setBatchPoems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishing, setPublishing] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const poemsPerPage = 10;

  // Fetch batch poems on component mount
  useEffect(() => {
    fetchBatchPoems();
  }, [page]);

  const fetchBatchPoems = async () => {
    setIsLoading(true);
    try {
      // First get the total count for pagination info
      const { count: totalCountResult, error: countError } = await supabase
        .from('user_poems')
        .select('*', { count: 'exact', head: true })
        .eq('batch_created', true);
      
      if (countError) throw countError;
      
      setTotalCount(totalCountResult || 0);
      
      // Get count of visible poems (not deleted)
      const { count: visibleCountResult, error: visibleCountError } = await supabase
        .from('user_poems')
        .select('*', { count: 'exact', head: true })
        .eq('batch_created', true)
        .neq('status', 'deleted');
      
      if (visibleCountError) throw visibleCountError;
      
      setVisibleCount(visibleCountResult || 0);
      
      // Check if we need to adjust the page (if we're on a page that no longer exists)
      const totalPages = Math.ceil((visibleCountResult || 0) / poemsPerPage);
      if (page > totalPages && totalPages > 0 && page !== 1) {
        setPage(totalPages);
        // The useEffect will trigger fetchBatchPoems again with the correct page
        setIsLoading(false);
        return;
      }
      
      // Handle case when count is 0
      if (visibleCountResult === 0) {
        setBatchPoems([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      // Then fetch the actual page of data, excluding deleted poems
      const { data, error } = await supabase
        .from('user_poems')
        .select('*')
        .eq('batch_created', true)
        .neq('status', 'deleted')
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

  const handleStatusChange = async (poemId: string, newStatus: 'published' | 'deleted') => {
    // Prevent multiple clicks by checking if we're already publishing this poem
    if (publishing[poemId]) {
      return;
    }
    
    try {
      // Mark this poem as being published/deleted
      setPublishing(prev => ({ ...prev, [poemId]: true }));
      
      // Use the manage-poem edge function to update the poem status
      const { error } = await supabase.functions.invoke('manage-poem', {
        body: {
          action: 'update',
          poemId: poemId,
          poemData: { status: newStatus }
        }
      });
      
      if (error) throw error;
      
      // For deleted status, remove the poem from local state
      if (newStatus === 'deleted') {
        setBatchPoems(prev => prev.filter(poem => poem.id !== poemId));
        // Update visible count
        setVisibleCount(prev => prev - 1);
      } else {
        // For published status, update the poem in local state
        setBatchPoems(prev => 
          prev.map(poem => 
            poem.id === poemId ? { ...poem, status: newStatus } : poem
          )
        );
      }
      
      toast.success(`Gedicht ${newStatus === 'published' ? 'veröffentlicht' : 'versteckt'}`);
    } catch (error) {
      console.error('Error updating poem status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    } finally {
      // Reset publishing state
      setPublishing(prev => ({ ...prev, [poemId]: false }));
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
    page,
    totalCount,
    visibleCount,
    hasMore,
    nextPage,
    prevPage,
    poemsPerPage
  };
};
