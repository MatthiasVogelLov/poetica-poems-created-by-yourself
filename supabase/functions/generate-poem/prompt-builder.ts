
export interface PoemOptions {
  audience: string;
  occasion: string;
  contentType: string;
  style: string;
  verseType: string;
  length: string;
  keywords?: string;
  language?: string; // Added language option
}

export const buildPrompt = (options: PoemOptions): string => {
  const {
    audience,
    occasion,
    contentType,
    style,
    verseType,
    length,
    keywords,
    language = 'german' // Default to German
  } = options;

  // Base prompt instruction based on language
  const baseInstruction = language === 'english'
    ? `Write a beautiful original poem in English for a ${audience} about ${contentType}`
    : `Schreibe ein schönes originelles Gedicht auf Deutsch für einen ${audience} über ${contentType}`;
  
  // Length instruction
  const lengthInstruction = language === 'english'
    ? (length === 'kurz' ? 'Keep it short with about 8-12 lines.' : 
       length === 'mittel' ? 'Make it medium length with about 12-20 lines.' : 
       'Make it longer with about 20-30 lines.')
    : (length === 'kurz' ? 'Halte es kurz mit etwa 8-12 Zeilen.' : 
       length === 'mittel' ? 'Mache es mittellang mit etwa 12-20 Zeilen.' : 
       'Mache es länger mit etwa 20-30 Zeilen.');
  
  // Style instruction
  const styleInstruction = language === 'english'
    ? `The style should be ${style}.`
    : `Der Stil sollte ${style} sein.`;
  
  // Verse type instruction
  const verseInstruction = language === 'english'
    ? (verseType === 'frei' ? 'Use free verse.' : 
       verseType === 'paarreim' ? 'Use couplets (AABB rhyme scheme).' : 
       verseType === 'kreuzreim' ? 'Use alternating rhyme (ABAB rhyme scheme).' : 
       'Use enclosed rhyme (ABBA rhyme scheme).')
    : (verseType === 'frei' ? 'Verwende freie Verse.' : 
       verseType === 'paarreim' ? 'Verwende Paarreime (AABB Reimschema).' : 
       verseType === 'kreuzreim' ? 'Verwende Kreuzreime (ABAB Reimschema).' : 
       'Verwende umarmende Reime (ABBA Reimschema).');
  
  // Occasion instruction
  const occasionInstruction = language === 'english'
    ? `It's for a/an ${occasion} occasion.`
    : `Es ist für einen ${occasion} Anlass.`;
  
  // Keywords instruction
  const keywordsInstruction = keywords && keywords.trim() !== ''
    ? (language === 'english'
       ? `Try to incorporate the following keywords naturally: ${keywords}.`
       : `Versuche, die folgenden Schlüsselwörter natürlich einzubauen: ${keywords}.`)
    : '';
  
  // Final instruction
  const finalInstruction = language === 'english'
    ? 'Make it emotionally resonant, meaningful, and original. The poem should be high quality and something someone would be happy to pay for.'
    : 'Mache es emotional ansprechend, bedeutungsvoll und originell. Das Gedicht sollte von hoher Qualität sein und etwas, wofür jemand gerne bezahlen würde.';

  // Combine all instructions
  const fullPrompt = [
    baseInstruction,
    occasionInstruction,
    styleInstruction,
    verseInstruction,
    lengthInstruction,
    keywordsInstruction,
    finalInstruction
  ].filter(Boolean).join(' ');

  return fullPrompt;
};

export const buildTitlePrompt = (options: PoemOptions): string => {
  const { audience, occasion, contentType, language = 'german' } = options;
  
  return language === 'english'
    ? `Create a short, elegant title for a poem about ${contentType} for a ${audience} for a ${occasion} occasion. Return only the title, no quotes or explanations.`
    : `Erstelle einen kurzen, eleganten Titel für ein Gedicht über ${contentType} für einen ${audience} für einen ${occasion} Anlass. Gib nur den Titel zurück, keine Anführungszeichen oder Erklärungen.`;
};
