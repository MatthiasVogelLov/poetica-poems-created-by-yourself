
import {
  Audience,
  Occasion,
  ContentType,
  Style,
  VerseType,
  Length
} from '@/types/poem';

// Define available options for each field
const poemOptions = {
  audience: ['eltern', 'erwachsene', 'familie', 'freunde', 'kinder', 'kollegen', 'partner'] as Audience[],
  occasion: [
    'geburtstag', 'hochzeit', 'jubilaeum', 'valentinstag', 'weihnachten', 
    'ostern', 'andere', 'abschluss', 'babyparty', 'einzug', 'junggesellenabschied', 
    'kommunion', 'konfirmation', 'ruhestand', 'scheidung', 'schulanfang', 
    'taufe', 'trauerfall', 'trennung', 'umzug', 'verlobung'
  ] as Occasion[],
  contentType: ['liebe', 'freundschaft', 'natur', 'leben', 'motivation', 'humor', 'trauer'] as ContentType[],
  style: ['klassisch', 'modern', 'romantisch', 'humorvoll', 'experimentell'] as Style[],
  verseType: ['frei', 'paarreim', 'kreuzreim', 'umarmenderreim'] as VerseType[],
  length: ['mittel', 'lang'] as Length[]
};

/**
 * Gets a random option from the specified category
 */
export const getRandomOption = (category: keyof typeof poemOptions) => {
  const options = poemOptions[category];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};
