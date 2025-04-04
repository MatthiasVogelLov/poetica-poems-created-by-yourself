
// This function generates a title for the poem based on the occasion and style
export function generateTitleFromOccasion(occasion: string, style: string, language = 'de') {
  if (language === 'en') {
    // English titles
    const generalTitles = [
      "A Poetic Journey",
      "Words from the Heart",
      "Whispers of Emotion",
      "Heartfelt Verses",
      "Rhythmic Expressions",
      "Soulful Words",
      "The Poet's Voice",
      "Verses of Feeling",
      "Poetic Reflections",
      "Echoes of Thought"
    ];
  
    // Map of occasion-specific titles in English
    const occasionTitles: Record<string, string[]> = {
      birthday: ["Birthday Wishes", "Another Year of Joy", "Celebrating You", "The Gift of Life"],
      wedding: ["Union of Hearts", "Two Souls Joined", "Eternal Vows", "Love's Promise"],
      anniversary: ["Years of Love", "Milestone of Hearts", "Time Together", "Lasting Bond"],
      newborn: ["Welcome to Life", "A New Beginning", "First Breath", "Tiny Miracle"],
      graduation: ["Academic Achievement", "New Horizons", "The Path Forward", "Knowledge Journey"],
      farewell: ["Until We Meet Again", "New Beginnings", "Parting Ways", "Fond Farewell"],
      sympathy: ["In Loving Memory", "Eternal Rest", "Peaceful Journey", "Remembrance"],
      recovery: ["Healing Wishes", "Return to Health", "Strength in Recovery", "Wellness Journey"],
      christmas: ["Christmas Spirit", "Holiday Joy", "Yuletide Blessings", "Season of Light"],
      thanksgiving: ["Harvest of Gratitude", "Giving Thanks", "Bountiful Blessings", "Season of Appreciation"],
      easter: ["Renewal and Hope", "Spring Celebration", "Easter Joy", "Rebirth"],
      mother_day: ["Mother's Love", "Maternal Bonds", "For a Special Mother", "Motherly Devotion"],
      father_day: ["Father's Strength", "Paternal Wisdom", "For a Special Father", "Fatherly Guidance"],
      friendship: ["Bonds of Friendship", "True Companionship", "Friends Forever", "Kindred Spirits"],
      love: ["Heart's Desire", "Passionate Love", "Romance in Bloom", "Affection's Embrace"],
      encouragement: ["Courage Within", "Strength to Continue", "Perseverance", "Forward Journey"],
      thanks: ["Gratitude Expressed", "Thankful Heart", "Appreciation", "Grateful Words"],
      apology: ["Heartfelt Apology", "Making Amends", "Path to Forgiveness", "Reconciliation"],
      other: generalTitles,
    };
  
    // Get title options based on occasion or use general titles
    const titleOptions = occasionTitles[occasion] || generalTitles;
  
    // Select a random title from the options
    return titleOptions[Math.floor(Math.random() * titleOptions.length)];
  } else {
    // German titles - original implementation
    const generalTitles = [
      "Poetische Reise",
      "Worte aus dem Herzen",
      "Flüstern der Gefühle",
      "Herzliche Verse",
      "Rhythmische Ausdrücke",
      "Seelenvolle Worte",
      "Die Stimme des Dichters",
      "Verse des Gefühls",
      "Poetische Reflexionen",
      "Echos der Gedanken"
    ];
  
    // Map of occasion-specific titles in German
    const occasionTitles: Record<string, string[]> = {
      birthday: ["Geburtstagsgrüße", "Ein weiteres Jahr der Freude", "Feier des Lebens", "Das Geschenk des Lebens"],
      wedding: ["Vereinigung der Herzen", "Zwei verbundene Seelen", "Ewige Gelübde", "Versprechen der Liebe"],
      anniversary: ["Jahre der Liebe", "Meilenstein der Herzen", "Zeit zusammen", "Beständige Verbindung"],
      newborn: ["Willkommen im Leben", "Ein neuer Anfang", "Erster Atemzug", "Kleines Wunder"],
      graduation: ["Akademische Leistung", "Neue Horizonte", "Der Weg nach vorne", "Reise des Wissens"],
      farewell: ["Bis wir uns wiedersehen", "Neue Anfänge", "Abschied nehmen", "Herzlicher Abschied"],
      sympathy: ["In liebevoller Erinnerung", "Ewige Ruhe", "Friedvolle Reise", "Gedenken"],
      recovery: ["Heilungswünsche", "Rückkehr zur Gesundheit", "Kraft in der Genesung", "Weg zur Besserung"],
      christmas: ["Weihnachtsgeist", "Festliche Freude", "Weihnachtssegen", "Zeit des Lichts"],
      thanksgiving: ["Ernte der Dankbarkeit", "Dank sagen", "Reichlicher Segen", "Zeit der Wertschätzung"],
      easter: ["Erneuerung und Hoffnung", "Frühlingsfest", "Osterfreude", "Wiedergeburt"],
      mother_day: ["Mutterliebe", "Mütterliche Bande", "Für eine besondere Mutter", "Mütterliche Hingabe"],
      father_day: ["Vaterliche Stärke", "Väterliche Weisheit", "Für einen besonderen Vater", "Väterliche Führung"],
      friendship: ["Bande der Freundschaft", "Wahre Gefährten", "Freunde für immer", "Seelenverwandte"],
      love: ["Herzenswunsch", "Leidenschaftliche Liebe", "Aufblühende Romanze", "Umarmung der Zuneigung"],
      encouragement: ["Mut von innen", "Kraft zum Weitermachen", "Ausdauer", "Weg nach vorn"],
      thanks: ["Ausgedrückte Dankbarkeit", "Dankbares Herz", "Wertschätzung", "Worte des Dankes"],
      apology: ["Aufrichtige Entschuldigung", "Wiedergutmachung", "Weg zur Vergebung", "Versöhnung"],
      other: generalTitles,
    };
  
    // Get title options based on occasion or use general titles
    const titleOptions = occasionTitles[occasion] || generalTitles;
  
    // Select a random title from the options
    return titleOptions[Math.floor(Math.random() * titleOptions.length)];
  }
}
