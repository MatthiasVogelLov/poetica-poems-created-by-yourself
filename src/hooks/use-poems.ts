
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
  status?: string;
  batch_created?: boolean;
}

export const usePoems = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');

  // Fetch the poems from Supabase
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        // Fetch both user-created poems and published batch poems
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .or('batch_created.is.null,and(batch_created.eq.true,status.eq.published)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPoems(data || []);
        setFilteredPoems(data || []);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error('Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let result = [...poems];
    
    if (occasionFilter && occasionFilter !== 'all') {
      result = result.filter(poem => poem.occasion === occasionFilter);
    }
    
    if (contentTypeFilter && contentTypeFilter !== 'all') {
      result = result.filter(poem => poem.content_type === contentTypeFilter);
    }
    
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter]);

  // Fetch a single poem when selected
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
          setSelectedPoem(data);
        } catch (error) {
          console.error('Error fetching poem:', error);
          toast.error('Fehler beim Laden des Gedichts');
          setSelectedPoem(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSinglePoem();
    } else {
      setSelectedPoem(null);
    }
  }, [selectedPoemId]);

  const handleDeletePoem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Möchten Sie dieses Gedicht wirklich löschen?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_poems')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPoems(poems.filter(poem => poem.id !== id));
      toast.success('Gedicht wurde gelöscht');
      
      if (selectedPoemId === id) {
        setSelectedPoemId(null);
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
      toast.error('Fehler beim Löschen des Gedichts');
    }
  };

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
  };

  const getUniqueOccasions = () => {
    const occasions = new Set(poems.map(poem => poem.occasion).filter(Boolean));
    return Array.from(occasions);
  };

  const getUniqueContentTypes = () => {
    const contentTypes = new Set(poems.map(poem => poem.content_type).filter(Boolean));
    return Array.from(contentTypes);
  };

  return {
    poems,
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes
  };
};
