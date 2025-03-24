import { useState, useEffect } from 'react';
import { usePoemsData } from './use-poems-data';
import { usePoemFilters } from './use-poem-filters';
import { usePoemActions } from './use-poem-actions';
import { Poem } from '@/types/poem-types';

export { Poem } from '@/types/poem-types';
export { createSlug } from '@/utils/poem-slug-utils';

export const usePoems = () => {
  const [state, setPoems, setSelectedPoemId] = usePoemsData();
  
  const { 
    filteredPoems: filteredPoemsByFilters,
    filters,
    actions: filterActions
  } = usePoemFilters(state.poems);

  // Keep the filtered poems in sync with the filter results
  useEffect(() => {
    // This is necessary to prevent stale state when filters change
    state.filteredPoems = filteredPoemsByFilters;
  }, [filteredPoemsByFilters]);

  const poemActions = usePoemActions(
    state.poems, 
    setPoems, 
    setSelectedPoemId, 
    state.poemSlugs, 
    state.slugToId
  );

  return {
    ...state,
    filteredPoems: filteredPoemsByFilters,
    ...filters,
    setSelectedPoemId,
    ...filterActions,
    ...poemActions
  };
};
