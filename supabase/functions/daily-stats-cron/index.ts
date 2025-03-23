
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// This function is used to set up the cron job in Supabase
serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[daily-stats-cron] Setting up cron job at:", new Date().toISOString());
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Setup the cron job - make sure it runs daily at 6am (5am UTC assuming CET/CEST)
    const { data, error } = await supabase.rpc('create_daily_stats_cron');
    
    if (error) {
      console.error("[daily-stats-cron] Error setting up cron job:", error);
      throw error;
    }
    
    console.log("[daily-stats-cron] Cron job set up successfully:", data);
    
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
    console.error("Error setting up cron job:", error);
    
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
