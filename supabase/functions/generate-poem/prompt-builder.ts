
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
  let systemPrompt = "Du bist ein erfahrener Dichter, der hochwertige, personalisierte Gedichte auf Deutsch erstellt. ";
  systemPrompt += "Deine Gedichte zeichnen sich durch folgende Qualitätsmerkmale aus:\n";
  systemPrompt += "- Nutze ausschließlich korrekte deutsche Wörter und Grammatik\n";
  systemPrompt += "- Verwende natürliche, sinnvolle Reime (keine erzwungenen oder konstruierten Reime)\n";
  systemPrompt += "- Achte auf ein konsistentes Metrum und Rhythmus\n";
  systemPrompt += "- Kreiere inhaltlich kohärente Strophen mit logischem Gedankenfluss\n";
  systemPrompt += "- Wähle präzise, ausdrucksstarke und zum Thema passende Vokabeln\n\n";
  
  systemPrompt += "Du beherrschst verschiedene deutsche Gedichtformen wie Sonett, Ballade, Ode, Hymne, Epigramm, Haiku, Tanka, Freie Verse und Elfchen. ";
  systemPrompt += "Wichtig: Markiere keine Reimschema-Indikatoren wie (A), (B) usw. am Ende der Zeilen. ";
  systemPrompt += "Überprüfe dein Gedicht sorgfältig auf korrekten Sprachgebrauch und passende Reime, bevor du es abschließt.";
  
  return systemPrompt;
}

// Generate the user prompt based on form data
export function generateUserPrompt({ audience, occasion, contentType, style, verseType, length, keywords }: PromptParams) {
  let userPrompt = `Erstelle ein Gedicht mit folgenden Eigenschaften:\n`;
  userPrompt += `- Zielgruppe: ${audience}\n`;
  userPrompt += `- Anlass: ${occasion}\n`;
  userPrompt += `- Thema: ${contentType}\n`;
  userPrompt += `- Stil: ${style}\n`;
  
  // Add verse type specification with clearer guidance
  if (verseType === 'frei') {
    userPrompt += `- Versart: Freie Verse (kein festes Reimschema, aber achte auf Rhythmus und Klang)\n`;
  } else if (verseType === 'paarreim') {
    userPrompt += `- Versart: Paarreim (AABB Reimschema, aufeinanderfolgende Verse reimen sich, z.B. "Haus/Maus" und dann "Wein/fein")\n`;
  } else if (verseType === 'kreuzreim') {
    userPrompt += `- Versart: Kreuzreim (ABAB Reimschema, abwechselnde Verse reimen sich, z.B. "Nacht/Licht" und "erwacht/Gesicht")\n`;
  } else if (verseType === 'umarmenderreim') {
    userPrompt += `- Versart: Umarmender Reim (ABBA Reimschema, die äußeren und inneren Verse reimen sich, z.B. "Traum/Raum" und "Leben/geben")\n`;
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
    userPrompt += `  Integriere diese Wörter natürlich und sinnvoll in den Text, ohne den Fluss zu stören.\n`;
  }
  
  userPrompt += `\nBeispielreime für Inspiration:\n`;
  userPrompt += `- Liebe/bliebe, Herz/Schmerz, Glück/zurück, Leben/geben, Zeit/weit\n`;
  userPrompt += `- Träume/Räume, Nacht/Macht, Licht/Gesicht, Freude/Weite, Hand/Band\n`;
  userPrompt += `- Sterne/Ferne, Welt/fällt, groß/los, klein/sein, Tag/mag\n`;
  
  userPrompt += `\nDas Gedicht sollte emotionale Tiefe haben und die Schlüsselwörter, falls angegeben, natürlich einbinden. Halte dich streng an die gewählte Gedichtform, den Stil und das Reimschema.`;
  userPrompt += `\nWichtig: Füge KEINE Reimschema-Indikatoren wie (A), (B) usw. am Ende der Zeilen hinzu.`;
  userPrompt += `\nÜberprüfe jeden Vers auf korrekte Grammatik, Rechtschreibung und sinnvolle Reime bevor du das Gedicht abschließt.`;

  return userPrompt;
}
