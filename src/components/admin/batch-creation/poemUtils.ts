import { Style, VerseType, Length } from '@/types/poem';

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
