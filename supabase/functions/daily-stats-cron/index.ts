
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./config.ts";
import { setupSupabase, enableExtensions } from "./setup-utils.ts";
import { setupCronJob } from "./cron-setup.ts";
import { testEmailFunction } from "./test-utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[daily-stats-cron] Starting setup at:", new Date().toISOString());
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = setupSupabase(supabaseUrl, supabaseKey);
    
    // Enable PostgreSQL extensions
    await enableExtensions(supabase);
    
    // Setup the cron job
    const data = await setupCronJob(supabase, supabaseUrl, supabaseKey);
    
    // Force execute the email function once to test
    await testEmailFunction(supabaseUrl, supabaseKey);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cron job for daily stats email set up successfully',
        data
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error setting up cron job:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
