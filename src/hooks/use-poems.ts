
import { useState, useEffect } from 'react';
import { usePoemsData } from './use-poems-data';
import { usePoemFilters } from './use-poem-filters';
import { usePoemActions } from './use-poem-actions';
import type { Poem, PoemHookState } from '@/types/poem-types';

// Re-export the Poem type to maintain backward compatibility
export type { Poem } from '@/types/poem-types';
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

  // Method to get SEO metadata for a specific poem
  const getPoemSeoMetadata = (poemId: string) => {
    if (state.getPoemSeoMetadata) {
      return state.getPoemSeoMetadata(poemId);
    }
    return { description: '', keywords: [] };
  };

  return {
    ...state,
    filteredPoems: filteredPoemsByFilters,
    ...filters,
    setSelectedPoemId,
    ...filterActions,
    ...poemActions,
    page: state.page,
    totalCount: state.totalCount,
    hasMore: state.hasMore,
    nextPage: state.nextPage,
    prevPage: state.prevPage,
    poemsPerPage: state.poemsPerPage,
    getPoemSeoMetadata
  };
};
