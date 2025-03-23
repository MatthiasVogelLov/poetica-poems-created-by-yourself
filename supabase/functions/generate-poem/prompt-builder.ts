
interface PromptParams {
  audience: string;
  occasion: string;
  contentType: string;
  style: string;
  verseType: string;
  length: string;
  keywords?: string;
}

// Generate the system prompt
export function generateSystemPrompt() {
  let systemPrompt = "Du bist ein erfahrener Dichter, der personalisierte Gedichte auf Deutsch erstellt. ";
  systemPrompt += "Deine Gedichte sind kreativ, einfühlsam und entsprechen genau den Anforderungen des Nutzers. ";
  systemPrompt += "Du beherrschst verschiedene deutsche Gedichtformen wie Sonett, Ballade, Ode, Hymne, Epigramm, Haiku, Tanka, Freie Verse und Elfchen.";
  
  return systemPrompt;
}

// Generate the user prompt based on form data
export function generateUserPrompt({ audience, occasion, contentType, style, verseType, length, keywords }: PromptParams) {
  let userPrompt = `Erstelle ein Gedicht mit folgenden Eigenschaften:\n`;
  userPrompt += `- Zielgruppe: ${audience}\n`;
  userPrompt += `- Anlass: ${occasion}\n`;
  userPrompt += `- Thema: ${contentType}\n`;
  userPrompt += `- Stil: ${style}\n`;
  
  // Add verse type specification
  if (verseType === 'frei') {
    userPrompt += `- Versart: Freie Verse (kein festes Reimschema)\n`;
  } else if (verseType === 'paarreim') {
    userPrompt += `- Versart: Paarreim (AABB Reimschema, aufeinanderfolgende Verse reimen sich)\n`;
  } else if (verseType === 'kreuzreim') {
    userPrompt += `- Versart: Kreuzreim (ABAB Reimschema, abwechselnde Verse reimen sich)\n`;
  } else if (verseType === 'umarmenderreim') {
    userPrompt += `- Versart: Umarmender Reim (ABBA Reimschema, die äußeren und inneren Verse reimen sich)\n`;
  }
  
  // Add length specification
  if (length === 'kurz') {
    userPrompt += `- Länge: Kurz (4-8 Zeilen)\n`;
  } else if (length === 'mittel') {
    userPrompt += `- Länge: Mittel (8-16 Zeilen)\n`;
  } else if (length === 'lang') {
    userPrompt += `- Länge: Lang (16-24 Zeilen)\n`;
  }
  
  // Add keywords if provided
  if (keywords && keywords.trim()) {
    userPrompt += `- Verwende folgende Schlüsselwörter: ${keywords}\n`;
  }
  
  userPrompt += `\nDas Gedicht sollte emotionale Tiefe haben und die Schlüsselwörter, falls angegeben, natürlich einbinden. Halte dich streng an die gewählte Gedichtform, den Stil und das Reimschema.`;

  return userPrompt;
}
