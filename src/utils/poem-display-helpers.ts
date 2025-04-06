
import { useLanguage } from '@/contexts/LanguageContext';

// Helper to get the current language
const getCurrentLanguage = (): 'en' | 'de' => {
  // Try to get from localStorage first
  const savedLanguage = localStorage.getItem('preferred_language');
  if (savedLanguage === 'en') return 'en';
  return 'de';
};

export const getOccasionDisplay = (occasion: string): string => {
  const language = getCurrentLanguage();
  
  const occasionMap: Record<string, Record<string, string>> = {
    en: {
      'geburtstag': 'Birthday',
      'hochzeit': 'Wedding',
      'jubilaeum': 'Anniversary',
      'valentinstag': 'Valentine\'s Day',
      'trauerfall': 'Bereavement',
      'weihnachten': 'Christmas',
      'ostern': 'Easter',
      'abschluss': 'Graduation',
      'babyparty': 'Baby Shower',
      'einzug': 'Moving In',
      'junggesellenabschied': 'Bachelor Party',
      'kommunion': 'Communion',
      'konfirmation': 'Confirmation',
      'ruhestand': 'Retirement',
      'scheidung': 'Divorce',
      'schulanfang': 'First Day of School',
      'taufe': 'Baptism',
      'trennung': 'Separation',
      'umzug': 'Moving',
      'verlobung': 'Engagement',
      'andere': 'Other'
    },
    de: {
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
      'andere': 'Andere'
    }
  };
  
  return occasionMap[language][occasion] || (occasion ? occasion.charAt(0).toUpperCase() + occasion.slice(1) : '');
};

export const getContentTypeDisplay = (contentType: string): string => {
  const language = getCurrentLanguage();
  
  const contentTypeMap: Record<string, Record<string, string>> = {
    en: {
      'liebe': 'Love',
      'freundschaft': 'Friendship',
      'natur': 'Nature',
      'leben': 'Life',
      'motivation': 'Motivation',
      'humor': 'Humor',
      'trauer': 'Grief'
    },
    de: {
      'liebe': 'Liebe',
      'freundschaft': 'Freundschaft',
      'natur': 'Natur',
      'leben': 'Leben',
      'motivation': 'Motivation',
      'humor': 'Humor',
      'trauer': 'Trauer'
    }
  };
  
  return contentTypeMap[language][contentType] || (contentType ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : '');
};

export const getAudienceDisplay = (audience: string): string => {
  const language = getCurrentLanguage();
  
  const audienceMap: Record<string, Record<string, string>> = {
    en: {
      'eltern': 'Parents',
      'erwachsene': 'Adults',
      'familie': 'Family',
      'freunde': 'Friends',
      'kinder': 'Children',
      'kollegen': 'Colleagues',
      'partner': 'Partner'
    },
    de: {
      'eltern': 'Eltern',
      'erwachsene': 'Erwachsene',
      'familie': 'Familie',
      'freunde': 'Freunde',
      'kinder': 'Kinder',
      'kollegen': 'Kollegen',
      'partner': 'Partner'
    }
  };
  
  return audienceMap[language][audience] || (audience ? audience.charAt(0).toUpperCase() + audience.slice(1) : '');
};

export const getStyleDisplay = (style: string): string => {
  const language = getCurrentLanguage();
  
  const styleMap: Record<string, Record<string, string>> = {
    en: {
      'klassisch': 'Classical',
      'modern': 'Modern',
      'romantisch': 'Romantic',
      'humorvoll': 'Humorous',
      'experimentell': 'Experimental'
    },
    de: {
      'klassisch': 'Klassisch',
      'modern': 'Modern',
      'romantisch': 'Romantisch',
      'humorvoll': 'Humorvoll',
      'experimentell': 'Experimentell'
    }
  };
  
  return styleMap[language][style] || style;
};
