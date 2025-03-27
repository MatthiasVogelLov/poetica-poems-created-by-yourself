
// Common German words that might be used in rhymes
const commonGermanWords = new Set([
  // Common nouns
  "Liebe", "Herz", "Zeit", "Leben", "Welt", "Hand", "Tag", "Nacht", "Weg", "Freude",
  "Glück", "Licht", "Traum", "Kraft", "Sonne", "Himmel", "Stern", "Mond", "Blume", "Baum",
  "Meer", "Berg", "Wind", "Regen", "Feuer", "Wasser", "Erde", "Luft", "Freund", "Kind",
  "Blick", "Wort", "Gedanke", "Gefühl", "Stimme", "Klang", "Bild", "Farbe", "Form", "Raum",
  
  // Common verbs
  "sein", "haben", "werden", "können", "müssen", "sollen", "wollen", "mögen", "dürfen", "tun",
  "machen", "gehen", "kommen", "stehen", "liegen", "sitzen", "finden", "sehen", "hören", "fühlen",
  "denken", "glauben", "wissen", "nehmen", "geben", "bringen", "bleiben", "lassen", "halten", "führen",
  
  // Common adjectives
  "schön", "gut", "groß", "klein", "alt", "neu", "jung", "hoch", "tief", "weit",
  "nah", "hell", "dunkel", "warm", "kalt", "stark", "schwach", "leicht", "schwer", "schnell",
  "langsam", "früh", "spät", "viel", "wenig", "ganz", "halb", "leer", "voll", "frei",
  
  // Common adverbs and prepositions
  "hier", "dort", "jetzt", "dann", "heute", "morgen", "gestern", "immer", "nie", "oft",
  "selten", "an", "in", "auf", "unter", "über", "vor", "nach", "mit", "ohne",
  "für", "gegen", "durch", "um", "bei", "aus", "zu", "von", "bis", "seit"
]);

// Simple rhyme check for German
function checkRhyme(line1: string, line2: string): boolean {
  // Extract last word from each line
  const lastWord1 = line1.trim().split(/\s+/).pop()?.toLowerCase().replace(/[.,!?;:]$/, "") || "";
  const lastWord2 = line2.trim().split(/\s+/).pop()?.toLowerCase().replace(/[.,!?;:]$/, "") || "";
  
  // If words are the same, it's not a good rhyme
  if (lastWord1 === lastWord2) return false;
  
  // For a simple check, we look at the last 2 or 3 characters
  if (lastWord1.length >= 3 && lastWord2.length >= 3) {
    return lastWord1.slice(-2) === lastWord2.slice(-2) || 
           lastWord1.slice(-3) === lastWord2.slice(-3);
  }
  
  return false;
}

// Check if a word exists in our German word list
function isRealGermanWord(word: string): boolean {
  // Remove punctuation
  const cleanWord = word.toLowerCase().replace(/[.,!?;:"]$/, "");
  return commonGermanWords.has(cleanWord);
}

export function validatePoemQuality(poem: string, verseType: string) {
  const lines = poem.split('\n').filter(line => line.trim() !== '');
  const issues: string[] = [];
  
  // Check for rhyme pattern based on verse type
  if (verseType !== 'frei' && lines.length >= 4) {
    if (verseType === 'paarreim') {
      // Check for AABB pattern
      for (let i = 0; i < lines.length - 1; i += 2) {
        if (i + 1 < lines.length && !checkRhyme(lines[i], lines[i + 1])) {
          issues.push(`Pair rhyme issue at lines ${i+1} and ${i+2}`);
        }
      }
    } else if (verseType === 'kreuzreim') {
      // Check for ABAB pattern
      for (let i = 0; i < lines.length - 2; i += 4) {
        if (i + 2 < lines.length && !checkRhyme(lines[i], lines[i + 2])) {
          issues.push(`Cross rhyme issue at lines ${i+1} and ${i+3}`);
        }
        if (i + 3 < lines.length && !checkRhyme(lines[i + 1], lines[i + 3])) {
          issues.push(`Cross rhyme issue at lines ${i+2} and ${i+4}`);
        }
      }
    } else if (verseType === 'umarmenderreim') {
      // Check for ABBA pattern
      for (let i = 0; i < lines.length - 3; i += 4) {
        if (i + 3 < lines.length && !checkRhyme(lines[i], lines[i + 3])) {
          issues.push(`Embracing rhyme issue at lines ${i+1} and ${i+4}`);
        }
        if (i + 2 < lines.length && !checkRhyme(lines[i + 1], lines[i + 2])) {
          issues.push(`Embracing rhyme issue at lines ${i+2} and ${i+3}`);
        }
      }
    }
  }
  
  // Check for word existence in German - this is simplistic and would need a real dictionary in production
  for (const line of lines) {
    const words = line.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[.,!?;:"]/, "");
      if (cleanWord.length > 3 && !/[A-Za-z]/.test(cleanWord)) {
        issues.push(`Possible non-German word: ${cleanWord}`);
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}
