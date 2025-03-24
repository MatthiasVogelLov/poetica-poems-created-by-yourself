
import { Poem } from '../types/poem-types';

// Filter poems based on occasion and content type
export const filterPoems = (
  poems: Poem[],
  occasionFilter: string,
  contentTypeFilter: string
): Poem[] => {
  let result = [...poems];
  
  if (occasionFilter && occasionFilter !== 'all') {
    result = result.filter(poem => poem.occasion === occasionFilter);
  }
  
  if (contentTypeFilter && contentTypeFilter !== 'all') {
    result = result.filter(poem => poem.content_type === contentTypeFilter);
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
