
import { useState } from 'react';
import { usePoemFetching, PoemSeoMetadata } from './use-poem-fetching';
import { usePoemSelection } from './use-poem-selection';
import { Poem } from '@/types/poem-types';

// Define a completely flat interface to avoid recursion
export interface PoemsDataResult {
  poems: Poem[];
  filteredPoems: Poem[];
  isLoading: boolean;
  selectedPoemId: string | null;
  selectedPoem: Poem | null;
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  poemSlugs: {[key: string]: string};
  slugToId: {[key: string]: string};
  page: number;
  hasMore: boolean;
  totalCount: number;
  poemsPerPage: number;
  nextPage: () => void;
  prevPage: () => void;
  getPoemSeoMetadata: (poemId: string) => PoemSeoMetadata;
}

// Hook to fetch and manage poem data
export const usePoemsData = (language: 'en' | 'de' = 'de'): [
  PoemsDataResult,
  React.Dispatch<React.SetStateAction<Poem[]>>,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
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
  const state: PoemsDataResult = {
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
