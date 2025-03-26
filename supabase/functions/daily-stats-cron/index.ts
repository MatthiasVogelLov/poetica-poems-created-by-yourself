
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration (URL or service role key)");
    }
    
    console.log("[daily-stats-cron] Supabase URL and key are configured");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, ensure the necessary extensions are enabled
    const { error: extError } = await supabase.rpc('create_pg_extensions');
    
    if (extError) {
      console.error("[daily-stats-cron] Error enabling extensions:", extError);
      // Continue anyway, as they might already be enabled
    } else {
      console.log("[daily-stats-cron] PostgreSQL extensions enabled or already active");
    }
    
    // Setup the cron job to run daily at 1am UTC
    const { data, error } = await supabase.rpc('create_daily_stats_cron', {
      supabase_url: supabaseUrl,
      anon_key: supabaseKey
    });
    
    if (error) {
      console.error("[daily-stats-cron] Error setting up cron job:", error);
      throw error;
    }
    
    console.log("[daily-stats-cron] Cron job set up successfully:", data);
    
    // Force execute the email function once to test
    try {
      console.log("[daily-stats-cron] Testing email function execution...");
      const testResult = await fetch(`${supabaseUrl}/functions/v1/daily-stats-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ test: true })
      });
      
      const testStatus = testResult.status;
      console.log("[daily-stats-cron] Test API call status:", testStatus);
      
      let testResponse;
      try {
        testResponse = await testResult.json();
        console.log("[daily-stats-cron] Test email execution result:", testResponse);
      } catch (parseError) {
        const textResponse = await testResult.text();
        console.error("[daily-stats-cron] Failed to parse JSON response:", textResponse);
      }
    } catch (testError) {
      console.error("[daily-stats-cron] Error testing email function:", testError);
    }
    
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
