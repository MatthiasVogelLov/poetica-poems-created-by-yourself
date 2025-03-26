
/**
 * Sets up the cron job to run daily at 1am UTC
 */
export async function setupCronJob(supabase: any, supabaseUrl: string, anon_key: string) {
  const { data, error } = await supabase.rpc('create_daily_stats_cron', {
    supabase_url: supabaseUrl,
    anon_key: anon_key
  });
  
  if (error) {
    console.error("[daily-stats-cron] Error setting up cron job:", error);
    throw error;
  }
  
  console.log("[daily-stats-cron] Cron job set up successfully:", data);
  return data;
}
