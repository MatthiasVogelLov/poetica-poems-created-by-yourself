
import { useState, useEffect } from 'react';
import { Poem, PoemFilters } from '@/types/poem-types';
import { filterPoems, getUniqueValues } from '@/utils/poem-filter-utils';

export const usePoemFilters = (poems: Poem[]) => {
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);

  // Apply filters when they change
  useEffect(() => {
    const result = filterPoems(
      poems, 
      occasionFilter, 
      contentTypeFilter, 
      styleFilter,
      audienceFilter,
      searchQuery
    );
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter, styleFilter, audienceFilter, searchQuery]);

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
    setStyleFilter('all');
    setAudienceFilter('all');
    setSearchQuery('');
  };

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
      searchQuery 
    },
    actions: {
      setOccasionFilter,
      setContentTypeFilter,
      setStyleFilter,
      setAudienceFilter,
      setSearchQuery,
      clearFilters,
      getUniqueOccasions,
      getUniqueContentTypes,
      getUniqueStyles,
      getUniqueAudiences
    }
  };
};
