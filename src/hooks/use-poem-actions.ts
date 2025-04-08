
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Poem } from '@/types/poem-types';
import { usePoemSaving } from './poem-actions/use-poem-saving';
import { usePoemDeletion } from './poem-actions/use-poem-deletion';
import { usePoemNavigation } from './poem-actions/use-poem-navigation';

export const usePoemActions = (
  poems: Poem[],
  setPoems: React.Dispatch<React.SetStateAction<Poem[]>>,
  setSelectedPoemId: React.Dispatch<React.SetStateAction<string | null>>,
  poemSlugs: {[key: string]: string},
  slugToId: {[key: string]: string}
) => {
  // Use specialized hooks for different poem actions
  const { savePoem, isSaving } = usePoemSaving(setPoems);
  const { handleDeletePoem } = usePoemDeletion(setPoems);
  const { findPoemBySlug, getSlugForPoemId } = usePoemNavigation(poemSlugs, slugToId);

  return {
    savePoem,
    handleDeletePoem,
    isSaving,
    findPoemBySlug,
    getSlugForPoemId
  };
};
