
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
    { name: 'Geburtstag', value: Math.floor(Math.random() * 1200) + 600, todayValue: Math.floor(Math.random() * 25) + 8 },
    { name: 'Hochzeit', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 5 },
    { name: 'Jubiläum', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Trauerfall', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Weihnachten', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Valentinstag', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 8) + 2 },
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
    keywordsUsed,
    keywordsTodayUsed
  };
};
