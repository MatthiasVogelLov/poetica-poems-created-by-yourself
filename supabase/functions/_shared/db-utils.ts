
/**
 * Shared utilities for database operations
 */

/**
 * Creates or ensures required PostgreSQL extensions are enabled
 * This function is meant to be called from edge functions that need specific Postgres extensions
 */
export async function createPgExtensions(supabase: any) {
  try {
    // Enable the pg_cron extension
    const { data: cronData, error: cronError } = await supabase.rpc('create_pg_extensions');
    
    if (cronError) {
      console.error("Error enabling PostgreSQL extensions:", cronError);
      return { success: false, error: cronError };
    }
    
    return { success: true, data: cronData };
  } catch (error) {
    console.error("Exception enabling PostgreSQL extensions:", error);
    return { success: false, error };
  }
}
