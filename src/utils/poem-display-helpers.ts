
export const getOccasionDisplay = (occasion: string): string => {
  const occasionMap: Record<string, string> = {
    'geburtstag': 'Geburtstag',
    'hochzeit': 'Hochzeit',
    'jubilaeum': 'Jubiläum',
    'valentinstag': 'Valentinstag',
    'trauerfall': 'Trauerfall',
    'weihnachten': 'Weihnachten',
    'ostern': 'Ostern',
    // Add more mappings as needed
  };
  
  return occasionMap[occasion] || occasion;
};

export const getContentTypeDisplay = (contentType: string): string => {
  const contentTypeMap: Record<string, string> = {
    'liebe': 'Liebe',
    'freundschaft': 'Freundschaft',
    'natur': 'Natur',
    'leben': 'Leben',
    'motivation': 'Motivation',
    'humor': 'Humor',
    'trauer': 'Trauer',
    // Add more mappings as needed
  };
  
  return contentTypeMap[contentType] || contentType;
};
