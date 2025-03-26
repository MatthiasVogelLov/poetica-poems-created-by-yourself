
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

/**
 * Sets up the Supabase client
 */
export function setupSupabase(supabaseUrl: string, supabaseKey: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration (URL or service role key)");
  }
  
  console.log("[daily-stats-cron] Supabase URL and key are configured");
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Enables necessary PostgreSQL extensions
 */
export async function enableExtensions(supabase: any) {
  const { error: extError } = await supabase.rpc('create_pg_extensions');
  
  if (extError) {
    console.error("[daily-stats-cron] Error enabling extensions:", extError);
    // Continue anyway, as they might already be enabled
  } else {
    console.log("[daily-stats-cron] PostgreSQL extensions enabled or already active");
  }
}
