
export const usePoemNavigation = (
  poemSlugs: {[key: string]: string},
  slugToId: {[key: string]: string}
) => {
  // Helper methods for slug-based navigation
  const findPoemBySlug = (slug: string): string | null => {
    return slugToId[slug] || null;
  };
  
  const getSlugForPoemId = (id: string): string | null => {
    return poemSlugs[id] || null;
  };

  return {
    findPoemBySlug,
    getSlugForPoemId
  };
};
