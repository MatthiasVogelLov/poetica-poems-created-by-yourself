
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { fetchPoemStats, fetchKeywordStats, fetchAudienceData, fetchOccasionData } from './data-utils.ts';
import { generateEmailHtml, formatAudienceRows, formatOccasionRows } from './email-template.ts';
import { sendDailyStatsEmail } from './email-service.ts';
import { createPgExtensions } from '../_shared/db-utils.ts';

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
    const startTime = new Date();
    console.log("[daily-stats-email] Function started at:", startTime.toISOString());
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('[daily-stats-email] RESEND_API_KEY is not set');
      throw new Error('RESEND_API_KEY is not set');
    }
    
    console.log("[daily-stats-email] Connected to Supabase, Resend API key found, length:", resendApiKey.length);
    
    // Ensure PostgreSQL extensions are enabled
    await createPgExtensions(supabase);
    
    // Get yesterday's date (UTC)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);
    
    // Format as YYYY-MM-DD for display
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    console.log(`[daily-stats-email] Generating stats email for ${yesterdayFormatted}`);
    console.log(`[daily-stats-email] Date range: ${yesterday.toISOString()} to ${yesterdayEnd.toISOString()}`);
    
    // Fetch all required data
    const { data: poemStats } = await fetchPoemStats(supabase, yesterday.toISOString(), yesterdayEnd.toISOString());
    const { data: keywordStats } = await fetchKeywordStats(supabase, yesterday.toISOString(), yesterdayEnd.toISOString());
    const { data: audienceData } = await fetchAudienceData(supabase);
    const { data: occasionData } = await fetchOccasionData(supabase);
    
    console.log("[daily-stats-email] All data fetched successfully");
    
    // Parse count results
    const totalPoems = Number(poemStats?.[0]?.count || 0);
    const keywordsUsed = Number(keywordStats?.[0]?.count || 0);
    
    // Format data for email
    const audienceRows = formatAudienceRows(audienceData || []);
    const occasionRows = formatOccasionRows(occasionData || []);
    
    // Generate email HTML
    const emailHtml = generateEmailHtml(
      yesterdayFormatted,
      totalPoems,
      keywordsUsed,
      audienceRows,
      occasionRows
    );
    
    // Update the email details with more reliable configuration
    const recipientEmail = "matthiasvogel1973@gmail.com"; // Admin email
    
    console.log(`[daily-stats-email] About to send email to ${recipientEmail}`);
    
    // Send the email
    const emailResult = await sendDailyStatsEmail(
      resendApiKey,
      recipientEmail,
      `Poetica Tagesstatistik: ${yesterdayFormatted}`,
      emailHtml
    );

    const endTime = new Date();
    const executionTime = endTime.getTime() - startTime.getTime();
    console.log(`[daily-stats-email] Function completed in ${executionTime}ms`);

    return new Response(
      JSON.stringify({ success: true, data: emailResult.data }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending daily stats email:", error.message, error.stack);
    
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
