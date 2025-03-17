
export interface StatItem {
  name: string;
  value: number;
  todayValue: number;
}

export interface StatsData {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
  keywordsTodayUsed: number;
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
  featureData: StatItem[];
}

export interface UseStatsDataProps {
  startDate?: Date;
  endDate?: Date;
}
