export interface StatItem {
  name: string;
  value: number;
  todayValue: number;
}

// Dummy statistics data - in a real app, this would come from a database
export const generateDummyStats = () => {
  // Poem count for each audience type
  const audienceData: StatItem[] = [
    { name: 'Erwachsene', value: Math.floor(Math.random() * 1000) + 500, todayValue: Math.floor(Math.random() * 20) + 5 },
    { name: 'Kinder', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 15) + 2 },
    { name: 'Partner', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Familie', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 10) + 1 },
    { name: 'Freunde', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 8) + 1 },
    { name: 'Kollegen', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
  ];

  // Poem count for each occasion
  const occasionData: StatItem[] = [
    { name: 'Ostern', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Abschluss', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 7) + 1 },
    { name: 'Geburt/Babyparty', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Einzug', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Geburtstag', value: Math.floor(Math.random() * 1200) + 600, todayValue: Math.floor(Math.random() * 25) + 8 },
    { name: 'Hochzeit', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 5 },
    { name: 'Junggesellenabschied', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 6) + 1 },
    { name: 'Jubiläum', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Kommunion', value: Math.floor(Math.random() * 350) + 175, todayValue: Math.floor(Math.random() * 7) + 1 },
    { name: 'Konfirmation', value: Math.floor(Math.random() * 350) + 175, todayValue: Math.floor(Math.random() * 7) + 1 },
    { name: 'Ruhestand', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 8) + 2 },
    { name: 'Scheidung', value: Math.floor(Math.random() * 200) + 100, todayValue: Math.floor(Math.random() * 4) + 1 },
    { name: 'Schulanfang', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 6) + 1 },
    { name: 'Taufe', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 8) + 2 },
    { name: 'Trauerfall', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Trennung', value: Math.floor(Math.random() * 200) + 100, todayValue: Math.floor(Math.random() * 4) + 1 },
    { name: 'Umzug', value: Math.floor(Math.random() * 250) + 125, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Valentinstag', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 8) + 2 },
    { name: 'Verlobung', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 7) + 2 },
    { name: 'Weihnachten', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Andere', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 6) + 1 },
  ];

  // Poem count for each style
  const styleData: StatItem[] = [
    { name: 'Sonett', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Ballade', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 8) + 1 },
    { name: 'Ode', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Hymne', value: Math.floor(Math.random() * 250) + 125, todayValue: Math.floor(Math.random() * 4) + 1 },
    { name: 'Elfchen', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Klassisch', value: Math.floor(Math.random() * 1000) + 500, todayValue: Math.floor(Math.random() * 20) + 5 },
    { name: 'Modern', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 4 },
    { name: 'Romantisch', value: Math.floor(Math.random() * 900) + 450, todayValue: Math.floor(Math.random() * 18) + 5 },
  ];

  // Poem count for each length
  const lengthData: StatItem[] = [
    { name: 'Kurz', value: Math.floor(Math.random() * 1200) + 600, todayValue: Math.floor(Math.random() * 25) + 8 },
    { name: 'Mittel', value: Math.floor(Math.random() * 900) + 450, todayValue: Math.floor(Math.random() * 18) + 6 },
    { name: 'Lang', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 12) + 4 },
  ];
  
  // Feature usage statistics
  const featureData: StatItem[] = [
    { name: 'Empfehlungen gesendet', value: Math.floor(Math.random() * 300) + 100, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Gedichte gedruckt', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 5 },
    { name: 'Gedichte per E-Mail', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Mit individuellen Wörtern', value: Math.floor(Math.random() * 1500) + 750, todayValue: Math.floor(Math.random() * 30) + 10 },
    { name: 'Tell-a-Friend', value: Math.floor(Math.random() * 200) + 50, todayValue: Math.floor(Math.random() * 8) + 1 },
  ];

  // Poem count with custom keywords
  const keywordsUsed = Math.floor(Math.random() * 2500) + 1200;
  const keywordsTodayUsed = Math.floor(Math.random() * 40) + 15;

  const totalPoems = audienceData.reduce((sum, item) => sum + item.value, 0);
  const todayPoems = audienceData.reduce((sum, item) => sum + item.todayValue, 0);

  return {
    totalPoems,
    todayPoems,
    audienceData,
    occasionData,
    styleData,
    lengthData,
    featureData,
    keywordsUsed,
    keywordsTodayUsed
  };
};
