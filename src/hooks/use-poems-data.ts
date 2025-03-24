
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem, PoemHookState } from '@/types/poem-types';
import { generatePoemSlugs } from '@/utils/poem-slug-utils';

// Hook to fetch and manage poem data
export const usePoemsData = (): [
  PoemHookState,
  React.Dispatch<React.SetStateAction<Poem[]>>,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [poemSlugs, setPoemSlugs] = useState<{[key: string]: string}>({});
  const [slugToId, setSlugToId] = useState<{[key: string]: string}>({});

  // Fetch poems from Supabase
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
        
        // Generate slugs for all poems
        const { poemSlugs, slugToId } = generatePoemSlugs(data || []);
        setPoemSlugs(poemSlugs);
        setSlugToId(slugToId);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error('Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  // Fetch a single poem when selected by ID
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

  const state: PoemHookState = {
    poems,
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    poemSlugs,
    slugToId
  };

  return [state, setPoems, setSelectedPoemId];
};
