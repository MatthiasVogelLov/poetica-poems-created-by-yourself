
import { useState } from 'react';
import { usePoemFetching } from './use-poem-fetching';
import { usePoemSelection } from './use-poem-selection';
import { Poem, PoemHookState } from '@/types/poem-types';

// Define a simpler return type that doesn't cause infinite recursion
type UsePoemsDataReturn = [
  PoemHookState,
  React.Dispatch<React.SetStateAction<Poem[]>>,
  React.Dispatch<React.SetStateAction<string | null>>
];

// Hook to fetch and manage poem data
export const usePoemsData = (language: 'en' | 'de' = 'de'): UsePoemsDataReturn => {
  const {
    poems,
    isLoading: isFetchingLoading,
    poemSlugs,
    slugToId,
    page,
    hasMore,
    totalCount,
    poemsPerPage,
    nextPage,
    prevPage,
    getPoemSeoMetadata
  } = usePoemFetching(language);

  const [
    { selectedPoemId, selectedPoem, isLoading: isSelectionLoading },
    setSelectedPoemId
  ] = usePoemSelection(language);

  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Combined loading state
  const isLoading = isFetchingLoading || isSelectionLoading;

  // Create the state object
  const state: PoemHookState = {
    poems,
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    styleFilter,
    audienceFilter,
    searchQuery,
    poemSlugs,
    slugToId,
    page,
    hasMore,
    totalCount,
    poemsPerPage,
    nextPage,
    prevPage,
    getPoemSeoMetadata
  };

  // Empty setPoems function to match original API
  const setPoems = (newPoems: React.SetStateAction<Poem[]>) => {
    if (typeof newPoems === 'function') {
      const updater = newPoems as (prevState: Poem[]) => Poem[];
      setFilteredPoems(updater(poems));
    } else {
      setFilteredPoems(newPoems);
    }
  };

  return [state, setPoems, setSelectedPoemId];
};
