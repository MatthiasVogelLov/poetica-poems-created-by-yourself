
import { useState, useEffect } from 'react';
import { Poem } from '@/types/poem-types';
import { generatePoemSlugs } from '@/utils/poem-slug-utils';

export const usePoemSlugs = (poems: Poem[]) => {
  const [poemSlugs, setPoemSlugs] = useState<{[key: string]: string}>({});
  const [slugToId, setSlugToId] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const { poemSlugs, slugToId } = generatePoemSlugs(poems);
    setPoemSlugs(poemSlugs);
    setSlugToId(slugToId);
  }, [poems]);
  
  return { poemSlugs, slugToId };
};
