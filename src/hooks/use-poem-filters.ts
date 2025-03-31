
import { useState, useEffect } from 'react';
import { Poem, PoemFilters } from '@/types/poem-types';
import { filterPoems, getUniqueValues } from '@/utils/poem-filter-utils';

export const usePoemFilters = (poems: Poem[]) => {
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keywordFilter, setKeywordFilter] = useState<string | null>(null);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  // Extract and count keywords from all poems
  useEffect(() => {
    const keywordMap: Record<string, number> = {};
    
    poems.forEach(poem => {
      if (poem.keywords) {
        const keywordList = poem.keywords.split(',').map(k => k.trim());
        keywordList.forEach(keyword => {
          if (keyword) {
            // Capitalize first letter for consistent display
            const formattedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            keywordMap[formattedKeyword] = (keywordMap[formattedKeyword] || 0) + 1;
          }
        });
      }
    });
    
    // Sort keywords by frequency and take top 15
    const sortedKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);
      
    setPopularKeywords(sortedKeywords);
  }, [poems]);

  // Apply filters when they change
  useEffect(() => {
    let result = filterPoems(
      poems, 
      occasionFilter, 
      contentTypeFilter, 
      styleFilter,
      audienceFilter,
      searchQuery
    );
    
    // Apply keyword filter if selected
    if (keywordFilter) {
      result = result.filter(poem => {
        if (!poem.keywords) return false;
        
        const poemKeywords = poem.keywords.toLowerCase().split(',').map(k => k.trim());
        return poemKeywords.includes(keywordFilter.toLowerCase());
      });
    }
    
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter, styleFilter, audienceFilter, searchQuery, keywordFilter]);

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
    setStyleFilter('all');
    setAudienceFilter('all');
    setSearchQuery('');
    setKeywordFilter(null);
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
      searchQuery,
      keywordFilter
    },
    popularKeywords,
    actions: {
      setOccasionFilter,
      setContentTypeFilter,
      setStyleFilter,
      setAudienceFilter,
      setSearchQuery,
      setKeywordFilter,
      clearFilters,
      getUniqueOccasions,
      getUniqueContentTypes,
      getUniqueStyles,
      getUniqueAudiences
    }
  };
};
