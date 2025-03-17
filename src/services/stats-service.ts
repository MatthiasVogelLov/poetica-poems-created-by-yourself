
import { supabase } from '@/integrations/supabase/client';
import { StatItem } from '@/types/stats';
import {
  formatAudienceData,
  formatOccasionData,
  formatStyleData,
  formatLengthData,
  formatFeatureData,
  parseCount
} from '@/utils/stats-formatter';

/**
 * Fetch total poems with optional date range filtering
 */
export const fetchTotalPoems = async (startDate: string | null, endDate: string | null) => {
  let query = supabase.from('poem_stats').select('count');
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);
  
  const { data, error } = await query;
  
  if (error) throw new Error(error.message);
  return parseCount(data?.[0]?.count);
};

/**
 * Fetch poems created today
 */
export const fetchTodayPoems = async (todayISOString: string) => {
  const { data, error } = await supabase
    .from('poem_stats')
    .select('count')
    .gte('created_at', todayISOString);
  
  if (error) throw new Error(error.message);
  return parseCount(data?.[0]?.count);
};

/**
 * Fetch keywords statistics with optional date range filtering
 */
export const fetchKeywordsStats = async (startDate: string | null, endDate: string | null) => {
  let query = supabase.from('poem_stats').select('count').eq('has_keywords', true);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);
  
  const { data, error } = await query;
  
  if (error) throw new Error(error.message);
  return parseCount(data?.[0]?.count);
};

/**
 * Fetch keywords statistics for today
 */
export const fetchKeywordsTodayStats = async (todayISOString: string) => {
  const { data, error } = await supabase
    .from('poem_stats')
    .select('count')
    .eq('has_keywords', true)
    .gte('created_at', todayISOString);
  
  if (error) throw new Error(error.message);
  return parseCount(data?.[0]?.count);
};

/**
 * Fetch audience statistics
 */
export const fetchAudienceStats = async () => {
  const { data, error } = await supabase.from('audience_stats').select('*');
  
  if (error) throw new Error(error.message);
  return formatAudienceData(data);
};

/**
 * Fetch occasion statistics
 */
export const fetchOccasionStats = async () => {
  const { data, error } = await supabase.from('occasion_stats').select('*');
  
  if (error) throw new Error(error.message);
  return formatOccasionData(data);
};

/**
 * Fetch style statistics
 */
export const fetchStyleStats = async () => {
  const { data, error } = await supabase.from('style_stats').select('*');
  
  if (error) throw new Error(error.message);
  return formatStyleData(data);
};

/**
 * Fetch length statistics
 */
export const fetchLengthStats = async () => {
  const { data, error } = await supabase.from('length_stats').select('*');
  
  if (error) throw new Error(error.message);
  return formatLengthData(data);
};

/**
 * Fetch feature usage statistics
 */
export const fetchFeatureStats = async () => {
  const { data, error } = await supabase.from('feature_usage_stats').select('*');
  
  if (error) throw new Error(error.message);
  return formatFeatureData(data);
};
