
import { useState, useEffect } from 'react';
import { Poem, PoemFilters } from '@/types/poem-types';
import { filterPoems, getUniqueValues } from '@/utils/poem-filter-utils';

export const usePoemFilters = (poems: Poem[]) => {
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);

  // Apply filters when they change
  useEffect(() => {
    const result = filterPoems(poems, occasionFilter, contentTypeFilter, audienceFilter);
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter, audienceFilter]);

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
    setAudienceFilter('all');
  };

  const getUniqueOccasions = () => getUniqueValues(poems, 'occasion');
  const getUniqueContentTypes = () => getUniqueValues(poems, 'content_type');
  const getUniqueAudiences = () => getUniqueValues(poems, 'audience');

  return {
    filteredPoems,
    filters: { occasionFilter, contentTypeFilter, audienceFilter },
    actions: {
      setOccasionFilter,
      setContentTypeFilter,
      setAudienceFilter,
      clearFilters,
      getUniqueOccasions,
      getUniqueContentTypes,
      getUniqueAudiences
    }
  };
};
