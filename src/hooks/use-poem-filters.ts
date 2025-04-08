
import { useState, useEffect } from 'react';
import { Poem, PoemFilters } from '@/types/poem-types';
import { filterPoems, getUniqueValues } from '@/utils/poem-filter-utils';
import { extractPopularKeywords, filterPoemsByKeywords } from '@/utils/keyword-utils';

export interface FiltersState {
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  keywordFilters: string[];
}

export interface FilterActions {
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  setStyleFilter: (filter: string) => void;
  setAudienceFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  toggleKeywordFilter: (keyword: string) => void;
  clearKeywordFilters: () => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  getUniqueStyles: () => string[];
  getUniqueAudiences: () => string[];
}

export interface UseFiltersResult {
  filteredPoems: Poem[];
  filters: FiltersState;
  popularKeywords: string[];
  actions: FilterActions;
}

export const usePoemFilters = (poems: Poem[]): UseFiltersResult => {
  // Filter state
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keywordFilters, setKeywordFilters] = useState<string[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  // Extract popular keywords when poems change
  useEffect(() => {
    const extractedKeywords = extractPopularKeywords(poems, 15);
    setPopularKeywords(extractedKeywords);
  }, [poems]);

  // Apply all filters when any filter changes
  useEffect(() => {
    // First apply basic filters
    let result = filterPoems(
      poems, 
      occasionFilter, 
      contentTypeFilter, 
      styleFilter,
      audienceFilter,
      searchQuery
    );
    
    // Then apply keyword filters
    result = filterPoemsByKeywords(result, keywordFilters);
    
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter, styleFilter, audienceFilter, searchQuery, keywordFilters]);

  // Keyword filter actions
  const toggleKeywordFilter = (keyword: string) => {
    setKeywordFilters(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };
  
  const clearKeywordFilters = () => {
    setKeywordFilters([]);
  };

  // Reset all filters
  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
    setStyleFilter('all');
    setAudienceFilter('all');
    setSearchQuery('');
    setKeywordFilters([]);
  };

  // Helper methods to get unique values for dropdowns
  const getUniqueOccasions = () => getUniqueValues(poems, 'occasion');
  const getUniqueContentTypes = () => getUniqueValues(poems, 'content_type');
  const getUniqueStyles = () => getUniqueValues(poems, 'style');
  const getUniqueAudiences = () => getUniqueValues(poems, 'audience');

  return {
    filteredPoems,
    filters: { 
      occasionFilter, 
      contentTypeFilter, 
      styleFilter,
      audienceFilter,
      searchQuery,
      keywordFilters
    },
    popularKeywords,
    actions: {
      setOccasionFilter,
      setContentTypeFilter,
      setStyleFilter,
      setAudienceFilter,
      setSearchQuery,
      toggleKeywordFilter,
      clearKeywordFilters,
      clearFilters,
      getUniqueOccasions,
      getUniqueContentTypes,
      getUniqueStyles,
      getUniqueAudiences
    }
  };
};
