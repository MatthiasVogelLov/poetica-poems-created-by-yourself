
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

// Get all cached poems
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

// Add a poem to the cache
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

// Find a poem in the cache based on parameters
export const findPoemInCache = (params: {
  audience: string;
  occasion: string;
  contentType: string;
  style: string;
  length: string;
  keywords?: string;
}): PoemCacheItem | null => {
  try {
    const cachedPoems = getCachedPoems();
    
    // For exact match without keywords, or with exact same keywords
    const exactMatch = cachedPoems.find(item => 
      item.params.audience === params.audience &&
      item.params.occasion === params.occasion &&
      item.params.contentType === params.contentType &&
      item.params.style === params.style &&
      item.params.length === params.length &&
      item.params.keywords === params.keywords
    );
    
    if (exactMatch) {
      console.log('Exact poem match found in cache:', exactMatch.title);
      return exactMatch;
    }
    
    // If no exact match and no keywords were specified, find a match without keywords
    if (!params.keywords || params.keywords.trim() === '') {
      const similarMatch = cachedPoems.find(item => 
        item.params.audience === params.audience &&
        item.params.occasion === params.occasion &&
        item.params.contentType === params.contentType &&
        item.params.style === params.style &&
        item.params.length === params.length &&
        (!item.params.keywords || item.params.keywords.trim() === '')
      );
      
      if (similarMatch) {
        console.log('Similar poem match found in cache:', similarMatch.title);
        return similarMatch;
      }
    }
    
    console.log('No matching poem found in cache');
    return null;
  } catch (error) {
    console.error('Error searching poem cache:', error);
    return null;
  }
};

// Clear the poem cache
export const clearPoemCache = (): void => {
  localStorage.removeItem('cachedPoems');
  console.log('Poem cache cleared');
};
