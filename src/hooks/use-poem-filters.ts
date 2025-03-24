
import { useState, useEffect } from 'react';
import { Poem, PoemFilters } from '@/types/poem-types';
import { filterPoems, getUniqueValues } from '@/utils/poem-filter-utils';

export const usePoemFilters = (poems: Poem[]) => {
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);

  // Apply filters when they change
  useEffect(() => {
    const result = filterPoems(poems, occasionFilter, contentTypeFilter);
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter]);

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
  };

  const getUniqueOccasions = () => getUniqueValues(poems, 'occasion');
  const getUniqueContentTypes = () => getUniqueValues(poems, 'content_type');

  return {
    filteredPoems,
    filters: { occasionFilter, contentTypeFilter },
    actions: {
      setOccasionFilter,
      setContentTypeFilter,
      clearFilters,
      getUniqueOccasions,
      getUniqueContentTypes
    }
  };
};
