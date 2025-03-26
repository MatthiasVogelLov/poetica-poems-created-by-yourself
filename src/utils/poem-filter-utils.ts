
import { Poem } from '../types/poem-types';

// Filter poems based on occasion, content type, style, audience, and search text
export const filterPoems = (
  poems: Poem[],
  occasionFilter: string,
  contentTypeFilter: string,
  styleFilter: string = 'all',
  audienceFilter?: string,
  searchQuery: string = ''
): Poem[] => {
  let result = [...poems];
  
  if (occasionFilter && occasionFilter !== 'all') {
    result = result.filter(poem => poem.occasion === occasionFilter);
  }
  
  if (contentTypeFilter && contentTypeFilter !== 'all') {
    result = result.filter(poem => poem.content_type === contentTypeFilter);
  }
  
  if (styleFilter && styleFilter !== 'all') {
    result = result.filter(poem => poem.style === styleFilter);
  }
  
  if (audienceFilter && audienceFilter !== 'all') {
    result = result.filter(poem => poem.audience === audienceFilter);
  }
  
  if (searchQuery && searchQuery.trim() !== '') {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    result = result.filter(poem => 
      poem.title.toLowerCase().includes(normalizedQuery) || 
      poem.content.toLowerCase().includes(normalizedQuery)
    );
  }
  
  return result;
};

// Get unique values for a specific field from poems array
export const getUniqueValues = <T>(poems: T[], field: keyof T): string[] => {
  const values = new Set(
    poems
      .map(poem => poem[field])
      .filter(Boolean) as string[]
  );
  return Array.from(values);
};

// Extract first 3 lines of poem content
export const getFirstThreeLines = (content: string): string => {
  if (!content) return '';
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  return lines.slice(0, 3).join('\n');
};
