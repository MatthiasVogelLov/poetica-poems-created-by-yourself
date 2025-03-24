
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBatchPoems = () => {
  const [batchPoems, setBatchPoems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishing, setPublishing] = useState<Record<string, boolean>>({});

  // Fetch batch poems on component mount
  useEffect(() => {
    fetchBatchPoems();
  }, []);

  const fetchBatchPoems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_poems')
        .select('*')
        .eq('batch_created', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBatchPoems(data || []);
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
      
      const { error } = await supabase
        .from('user_poems')
        .update({ status: newStatus })
        .eq('id', poemId);
        
      if (error) throw error;
      
      // Update local state to reflect the change
      setBatchPoems(prev => 
        prev.map(poem => 
          poem.id === poemId ? { ...poem, status: newStatus } : poem
        )
      );
      
      toast.success(`Gedicht ${newStatus === 'published' ? 'veröffentlicht' : 'gelöscht'}`);
    } catch (error) {
      console.error('Error updating poem status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    } finally {
      // Reset publishing state
      setPublishing(prev => ({ ...prev, [poemId]: false }));
    }
  };

  return {
    batchPoems,
    isLoading,
    fetchBatchPoems,
    handleStatusChange
  };
};
