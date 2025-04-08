
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';

export const usePoemSaving = (
  setPoems: React.Dispatch<React.SetStateAction<Poem[]>>
) => {
  const [isSaving, setIsSaving] = useState(false);

  // Save a poem to the database
  const savePoem = async (poemData: Omit<Poem, 'id' | 'created_at'>, language: 'en' | 'de' = 'de') => {
    setIsSaving(true);
    try {
      // Add language field to the poem data
      const poemWithLanguage = { ...poemData, language };
      
      const { data, error } = await supabase
        .from('user_poems')
        .insert([poemWithLanguage])
        .select()
        .single();
      
      if (error) throw error;
      
      const newPoem = data as Poem;
      setPoems(prevPoems => [newPoem, ...prevPoems]);
      
      const successMsg = language === 'en' ? 'Poem saved successfully' : 'Gedicht erfolgreich gespeichert';
      toast.success(successMsg);
      return newPoem;
    } catch (error) {
      console.error('Error saving poem:', error);
      const errorMsg = language === 'en' ? 'Error saving poem' : 'Fehler beim Speichern des Gedichts';
      toast.error(errorMsg);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { savePoem, isSaving };
};
