
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';
import { useLanguage } from '@/contexts/LanguageContext';

export const useFetchSinglePoem = (poemId: string | null) => {
  const { language } = useLanguage();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!poemId) {
      setPoem(null);
      return;
    }
    
    const fetchSinglePoem = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching single poem with ID:', poemId);
        
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .eq('id', poemId)
          .single();
        
        if (error) {
          console.error('Error fetching single poem:', error);
          throw error;
        }
        
        console.log('Poem data received:', data);
        setPoem(data);
      } catch (error) {
        console.error('Error fetching poem:', error);
        toast.error(language === 'en' ? 'Error loading poem' : 'Fehler beim Laden des Gedichts');
        setPoem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSinglePoem();
  }, [poemId, language]);
  
  return { poem, isLoading };
};
