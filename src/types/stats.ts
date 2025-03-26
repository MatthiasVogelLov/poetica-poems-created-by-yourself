
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
  subscribersCount: number;
  subscribersTodayCount: number;
  unpaidPoems?: number; // Added unpaid poems count
}

export interface UseStatsDataProps {
  startDate?: Date;
  endDate?: Date;
}
