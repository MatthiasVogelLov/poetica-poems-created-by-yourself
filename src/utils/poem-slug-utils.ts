
// Helper function to create a URL-friendly slug from a title
export const createSlug = (title: string): string => {
  // Convert to lowercase, replace spaces with dashes, remove special chars
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Get a unique slug, adding numbers if needed to avoid duplicates
export const getUniqueSlug = (title: string, existingSlugs: string[]): string => {
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists, if so add an incrementing number
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}_${counter}`;
    counter++;
  }
  
  return slug;
};

// Generate slugs for a collection of poems
export const generatePoemSlugs = (poems: Array<{id: string; title: string}>) => {
  const existingSlugs: string[] = [];
  const poemSlugsMap: {[key: string]: string} = {};
  const slugToIdMap: {[key: string]: string} = {};
  
  poems.forEach(poem => {
    const uniqueSlug = getUniqueSlug(poem.title, existingSlugs);
    existingSlugs.push(uniqueSlug);
    poemSlugsMap[poem.id] = uniqueSlug;
    slugToIdMap[uniqueSlug] = poem.id;
  });
  
  return {
    poemSlugs: poemSlugsMap,
    slugToId: slugToIdMap
  };
};
