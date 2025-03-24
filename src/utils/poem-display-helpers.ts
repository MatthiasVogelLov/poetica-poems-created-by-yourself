
export const getOccasionDisplay = (occasion: string): string => {
  const occasionMap: Record<string, string> = {
    'geburtstag': 'Geburtstag',
    'hochzeit': 'Hochzeit',
    'jubilaeum': 'Jubiläum',
    'valentinstag': 'Valentinstag',
    'trauerfall': 'Trauerfall',
    'weihnachten': 'Weihnachten',
    'ostern': 'Ostern',
    'abschluss': 'Abschluss',
    'babyparty': 'Babyparty',
    'einzug': 'Einzug',
    'junggesellenabschied': 'Junggesellenabschied',
    'kommunion': 'Kommunion',
    'konfirmation': 'Konfirmation',
    'ruhestand': 'Ruhestand',
    'scheidung': 'Scheidung',
    'schulanfang': 'Schulanfang',
    'taufe': 'Taufe',
    'trennung': 'Trennung',
    'umzug': 'Umzug',
    'verlobung': 'Verlobung',
    'andere': 'Andere',
    // Add more mappings as needed
  };
  
  return occasionMap[occasion] || (occasion ? occasion.charAt(0).toUpperCase() + occasion.slice(1) : '');
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
  
  return contentTypeMap[contentType] || (contentType ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : '');
};

export const getAudienceDisplay = (audience: string): string => {
  const audienceMap: Record<string, string> = {
    'eltern': 'Eltern',
    'erwachsene': 'Erwachsene',
    'familie': 'Familie',
    'freunde': 'Freunde',
    'kinder': 'Kinder',
    'kollegen': 'Kollegen',
    'partner': 'Partner',
    // Add more mappings as needed
  };
  
  return audienceMap[audience] || (audience ? audience.charAt(0).toUpperCase() + audience.slice(1) : '');
};
