
import { StatItem } from '@/types/stats';

/**
 * Parses a count value that could be a string or number
 */
export const parseCount = (count: string | number | null | undefined): number => {
  if (count === null || count === undefined) {
    return 0;
  }
  
  return typeof count === 'string' ? parseInt(count) || 0 : count || 0;
};

/**
 * Formats data for audience statistics
 */
export const formatAudienceData = (data: any[] | null): StatItem[] => {
  return (data || []).map(item => ({
    name: item.audience || 'Unspecified',
    value: parseCount(item.total),
    todayValue: parseCount(item.today)
  }));
};

/**
 * Formats data for occasion statistics
 */
export const formatOccasionData = (data: any[] | null): StatItem[] => {
  return (data || []).map(item => ({
    name: item.occasion || 'Unspecified',
    value: parseCount(item.total),
    todayValue: parseCount(item.today)
  }));
};

/**
 * Formats data for style statistics
 */
export const formatStyleData = (data: any[] | null): StatItem[] => {
  return (data || []).map(item => ({
    name: item.style || 'Unspecified',
    value: parseCount(item.total),
    todayValue: parseCount(item.today)
  }));
};

/**
 * Formats data for length statistics
 */
export const formatLengthData = (data: any[] | null): StatItem[] => {
  return (data || []).map(item => ({
    name: item.length || 'Unspecified',
    value: parseCount(item.total),
    todayValue: parseCount(item.today)
  }));
};

/**
 * Formats data for feature usage statistics
 */
export const formatFeatureData = (data: any[] | null): StatItem[] => {
  return (data || []).map(item => ({
    name: item.feature_name || 'Unspecified',
    value: parseCount(item.total),
    todayValue: parseCount(item.today)
  }));
};
