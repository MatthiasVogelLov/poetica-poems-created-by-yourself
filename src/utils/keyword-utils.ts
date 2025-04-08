
import { Poem } from '@/types/poem-types';

// Extract and organize keywords from poems
export const extractPopularKeywords = (poems: Poem[], limit: number = 15): string[] => {
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
  
  // Sort keywords by frequency and take top N
  return Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
};

// Filter poems by selected keywords
export const filterPoemsByKeywords = (poems: Poem[], keywordFilters: string[]): Poem[] => {
  if (keywordFilters.length === 0) return poems;
  
  return poems.filter(poem => {
    if (!poem.keywords) return false;
    
    const poemKeywords = poem.keywords.toLowerCase().split(',').map(k => k.trim());
    return keywordFilters.some(filter => 
      poemKeywords.includes(filter.toLowerCase())
    );
  });
};
