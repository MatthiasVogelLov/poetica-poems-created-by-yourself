
interface PoemCacheItem {
  title: string;
  poem: string;
  timestamp: string;
  params: {
    audience: string;
    occasion: string;
    contentType: string;
    style: string;
    length: string;
    keywords?: string;
  };
}

// Get all cached poems - for admin purposes only
export const getCachedPoems = (): PoemCacheItem[] => {
  try {
    const cachedPoemsJson = localStorage.getItem('cachedPoems');
    if (cachedPoemsJson) {
      return JSON.parse(cachedPoemsJson);
    }
  } catch (error) {
    console.error('Error retrieving cached poems:', error);
  }
  return [];
};

// Add a poem to the cache - for admin/analytics purposes only
export const addPoemToCache = (
  title: string,
  poem: string,
  params: {
    audience: string;
    occasion: string;
    contentType: string;
    style: string;
    length: string;
    keywords?: string;
  }
): void => {
  try {
    const cachedPoems = getCachedPoems();
    
    // Create new cache item
    const newCacheItem: PoemCacheItem = {
      title,
      poem,
      timestamp: new Date().toISOString(),
      params
    };
    
    // Add to beginning of cache
    cachedPoems.unshift(newCacheItem);
    
    // Limit cache to 20 items
    const limitedCache = cachedPoems.slice(0, 20);
    
    // Save to localStorage
    localStorage.setItem('cachedPoems', JSON.stringify(limitedCache));
    console.log('Poem added to cache:', newCacheItem.title);
  } catch (error) {
    console.error('Error adding poem to cache:', error);
  }
};

// Find a poem in the cache based on parameters - NOT USED for displaying complete poems to users
export const findPoemInCache = (params: {
  audience: string;
  occasion: string;
  contentType: string;
  style: string;
  length: string;
  keywords?: string;
}): null => {
  // This function is intentionally disabled to prevent loading complete poems from cache
  console.log('Find poem in cache is disabled - always generating new poems');
  return null;
};

// Clear the poem cache
export const clearPoemCache = (): void => {
  localStorage.removeItem('cachedPoems');
  console.log('Poem cache cleared');
};
