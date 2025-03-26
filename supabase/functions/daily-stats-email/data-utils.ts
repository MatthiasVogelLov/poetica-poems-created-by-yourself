
/**
 * Utilities for fetching and processing data for the daily statistics email
 */

/**
 * Fetches poem statistics for a specific date range
 */
export async function fetchPoemStats(supabase: any, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('poem_stats')
    .select('count')
    .gte('created_at', startDate)
    .lte('created_at', endDate);
    
  if (error) {
    console.error('[daily-stats-email] Error fetching poem stats:', error.message);
    throw new Error(`Error fetching poem stats: ${error.message}`);
  }
  
  return { data, error };
}

/**
 * Fetches poems with keywords for a specific date range
 */
export async function fetchKeywordStats(supabase: any, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('poem_stats')
    .select('count')
    .eq('has_keywords', true)
    .gte('created_at', startDate)
    .lte('created_at', endDate);
    
  if (error) {
    console.error('[daily-stats-email] Error fetching keyword stats:', error.message);
    throw new Error(`Error fetching keyword stats: ${error.message}`);
  }
  
  return { data, error };
}

/**
 * Fetches audience breakdown statistics
 */
export async function fetchAudienceData(supabase: any) {
  const { data, error } = await supabase
    .from('audience_stats')
    .select('*');
    
  if (error) {
    console.error('[daily-stats-email] Error fetching audience stats:', error.message);
    throw new Error(`Error fetching audience stats: ${error.message}`);
  }
  
  return { data, error };
}

/**
 * Fetches occasion breakdown statistics
 */
export async function fetchOccasionData(supabase: any) {
  const { data, error } = await supabase
    .from('occasion_stats')
    .select('*');
    
  if (error) {
    console.error('[daily-stats-email] Error fetching occasion stats:', error.message);
    throw new Error(`Error fetching occasion stats: ${error.message}`);
  }
  
  return { data, error };
}
