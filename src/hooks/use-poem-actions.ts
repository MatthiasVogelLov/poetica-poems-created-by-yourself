
import { useState } from 'react';
import { Poem } from '@/types/poem-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePoemActions = (
  poems: Poem[],
  setPoems: React.Dispatch<React.SetStateAction<Poem[]>>,
  setSelectedPoemId: React.Dispatch<React.SetStateAction<string | null>>,
  poemSlugs: {[key: string]: string},
  slugToId: {[key: string]: string}
) => {
  // Handle deleting a poem
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
      
      if (setSelectedPoemId) {
        setSelectedPoemId(null);
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
      toast.error('Fehler beim Löschen des Gedichts');
    }
  };

  // Find poem by slug
  const findPoemBySlug = (slug: string): string | null => {
    return slugToId[slug] || null;
  };

  // Get slug for a poem ID
  const getSlugForPoemId = (id: string): string | null => {
    return poemSlugs[id] || null;
  };

  return {
    handleDeletePoem,
    findPoemBySlug,
    getSlugForPoemId
  };
};
