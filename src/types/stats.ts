
export interface StatItem {
  name: string;
  value: number;
  todayValue: number;
  category?: string;
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
  subscribersCount?: number;
  subscribersTodayCount?: number;
}

export interface UseStatsDataProps {
  startDate?: Date;
  endDate?: Date;
}
