
import { Style, VerseType, Length, Audience, Occasion, ContentType } from '@/types/poem';

// Function to generate random poem options
export const generateRandomOptions = () => {
  const styles: Style[] = ['klassisch', 'modern', 'romantisch', 'humorvoll', 'experimentell'];
  const verseTypes: VerseType[] = ['frei', 'paarreim', 'kreuzreim', 'umarmenderreim'];
  const lengths: Length[] = ['mittel', 'lang'];

  return {
    style: styles[Math.floor(Math.random() * styles.length)],
    verseType: verseTypes[Math.floor(Math.random() * verseTypes.length)],
    length: lengths[Math.floor(Math.random() * lengths.length)]
  };
};

// Function to get a random option for a specific field
export const getRandomOption = (field: string): any => {
  const audiences: Audience[] = ['eltern', 'erwachsene', 'familie', 'freunde', 'kinder', 'kollegen', 'partner'];
  const occasions: Occasion[] = [
    'ostern', 'abschluss', 'babyparty', 'einzug', 'geburtstag', 'hochzeit',
    'junggesellenabschied', 'jubilaeum', 'kommunion', 'konfirmation',
    'ruhestand', 'scheidung', 'schulanfang', 'taufe', 'trauerfall',
    'trennung', 'umzug', 'valentinstag', 'verlobung', 'weihnachten', 'andere'
  ];
  const contentTypes: ContentType[] = ['liebe', 'freundschaft', 'natur', 'leben', 'motivation', 'humor', 'trauer'];
  const styles: Style[] = ['klassisch', 'modern', 'romantisch', 'humorvoll', 'experimentell'];
  const verseTypes: VerseType[] = ['frei', 'paarreim', 'kreuzreim', 'umarmenderreim'];
  const lengths: Length[] = ['kurz', 'mittel', 'lang'];

  switch (field) {
    case 'audience':
      return audiences[Math.floor(Math.random() * audiences.length)];
    case 'occasion':
      return occasions[Math.floor(Math.random() * occasions.length)];
    case 'contentType':
      return contentTypes[Math.floor(Math.random() * contentTypes.length)];
    case 'style':
      return styles[Math.floor(Math.random() * styles.length)];
    case 'verseType':
      return verseTypes[Math.floor(Math.random() * verseTypes.length)];
    case 'length':
      return lengths[Math.floor(Math.random() * lengths.length)];
    default:
      return null;
  }
};
