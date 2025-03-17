
import { useCombinedStats } from './stats';

export { type StatItem } from '@/types/stats';
export { type StatsData } from '@/types/stats';

// Re-export the combined stats hook as useStatsData for backward compatibility
export const useStatsData = useCombinedStats;
