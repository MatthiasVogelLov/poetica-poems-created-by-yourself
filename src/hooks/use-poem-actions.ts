
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';

export const usePoemActions = (
  poems: Poem[],
  setPoems: React.Dispatch<React.SetStateAction<Poem[]>>,
  setSelectedPoemId: React.Dispatch<React.SetStateAction<string | null>>,
  poemSlugs: {[key: string]: string},
  slugToId: {[key: string]: string}
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

  // Delete a poem from the database
  const handleDeletePoem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this poem?')) {
      try {
        await supabase.functions.invoke('manage-poem', {
          body: { action: 'delete', poemId: id }
        });
        
        setPoems(prevPoems => prevPoems.filter(poem => poem.id !== id));
        toast.success('Poem deleted successfully');
      } catch (error) {
        console.error('Error deleting poem:', error);
        toast.error('Error deleting the poem');
      }
    }
  };
  
  // Helper methods for slug-based navigation
  const findPoemBySlug = (slug: string): string | null => {
    return slugToId[slug] || null;
  };
  
  const getSlugForPoemId = (id: string): string | null => {
    return poemSlugs[id] || null;
  };

  return {
    savePoem,
    handleDeletePoem,
    isSaving,
    findPoemBySlug,
    getSlugForPoemId
  };
};
