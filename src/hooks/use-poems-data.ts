
import { useState } from 'react';
import { Poem, PoemHookState } from '@/types/poem-types';
import { useFetchPoems } from './use-fetch-poems';
import { useFetchSinglePoem } from './use-fetch-single-poem';
import { usePoemSeo } from './use-poem-seo';
import { usePoemSlugs } from './use-poem-slugs';
import { usePoemPagination } from './use-poem-pagination';

// Hook to fetch and manage poem data
export const usePoemsData = (): [
  PoemHookState,
  React.Dispatch<React.SetStateAction<Poem[]>>,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  // Manage state for poem filters
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Use pagination hook
  const { page, poemsPerPage, nextPage, prevPage } = usePoemPagination();
  
  // Use poem fetching hook
  const { poems, isLoading, totalCount, hasMore } = useFetchPoems(page, poemsPerPage);
  
  // Use filtered poems state
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  
  // Use single poem fetching hook
  const { poem: selectedPoem, isLoading: isSinglePoemLoading } = useFetchSinglePoem(selectedPoemId);
  
  // Use SEO metadata hook
  const { getPoemSeoMetadata } = usePoemSeo(poems);
  
  // Use slugs hook
  const { poemSlugs, slugToId } = usePoemSlugs(poems);
  
  // Update filtered poems when poems change
  if (filteredPoems.length === 0 && poems.length > 0) {
    setFilteredPoems(poems);
  }
  
  // Combine loading states
  const combinedIsLoading = isLoading || isSinglePoemLoading;

  // Build the state object
  const state: PoemHookState = {
    poems,
    filteredPoems,
    isLoading: combinedIsLoading,
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

  // Return state and setters
  return [state, setFilteredPoems, setSelectedPoemId];
};
