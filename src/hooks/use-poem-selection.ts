
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';

export interface PoemSelectionState {
  selectedPoemId: string | null;
  selectedPoem: Poem | null;
  isLoading: boolean;
}

export const usePoemSelection = (language: 'en' | 'de' = 'de'): [
  PoemSelectionState, 
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          const errorMsg = language === 'en' ? 'Error loading poem' : 'Fehler beim Laden des Gedichts';
          toast.error(errorMsg);
          setSelectedPoem(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSinglePoem();
    } else {
      setSelectedPoem(null);
    }
  }, [selectedPoemId, language]);

  return [
    { selectedPoemId, selectedPoem, isLoading },
    setSelectedPoemId
  ];
};
