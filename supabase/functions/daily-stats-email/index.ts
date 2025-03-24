
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    console.log("[daily-stats-email] Function started at:", new Date().toISOString());
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    
    console.log("[daily-stats-email] Connected to Supabase, Resend API key found");
    const resend = new Resend(resendApiKey);
    
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
    
    // Query total poems created yesterday
    const { data: poemStats, error: poemError } = await supabase
      .from('poem_stats')
      .select('count')
      .gte('created_at', yesterday.toISOString())
      .lte('created_at', yesterdayEnd.toISOString());
      
    if (poemError) {
      throw new Error(`Error fetching poem stats: ${poemError.message}`);
    }
    
    console.log("[daily-stats-email] Poem stats fetched:", poemStats);
    
    // Query poems with keywords
    const { data: keywordStats, error: keywordError } = await supabase
      .from('poem_stats')
      .select('count')
      .eq('has_keywords', true)
      .gte('created_at', yesterday.toISOString())
      .lte('created_at', yesterdayEnd.toISOString());
      
    if (keywordError) {
      throw new Error(`Error fetching keyword stats: ${keywordError.message}`);
    }
    
    console.log("[daily-stats-email] Keyword stats fetched:", keywordStats);
    
    // Get audience breakdown
    const { data: audienceData, error: audienceError } = await supabase
      .from('audience_stats')
      .select('*');
      
    if (audienceError) {
      throw new Error(`Error fetching audience stats: ${audienceError.message}`);
    }
    
    console.log("[daily-stats-email] Audience data fetched, count:", audienceData?.length);
    
    // Get occasion breakdown
    const { data: occasionData, error: occasionError } = await supabase
      .from('occasion_stats')
      .select('*');
      
    if (occasionError) {
      throw new Error(`Error fetching occasion stats: ${occasionError.message}`);
    }
    
    console.log("[daily-stats-email] Occasion data fetched, count:", occasionData?.length);
    
    // Parse count results
    const totalPoems = Number(poemStats?.[0]?.count || 0);
    const keywordsUsed = Number(keywordStats?.[0]?.count || 0);
    
    // Format audience data for email
    const audienceRows = audienceData
      .map(item => `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.audience || 'Unbekannt'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.today || 0}</td>
      </tr>`)
      .join('');
      
    // Format occasion data for email
    const occasionRows = occasionData
      .map(item => `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.occasion || 'Unbekannt'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.today || 0}</td>
      </tr>`)
      .join('');
    
    // Build email HTML
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Poetica Tagesstatistik</h1>
          
          <p>Hier ist die Statistik für <strong>${yesterdayFormatted}</strong>:</p>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h2 style="color: #4a5568; margin-top: 0;">Übersicht</h2>
            <p><strong>Erstellte Gedichte:</strong> ${totalPoems}</p>
            <p><strong>Mit Schlüsselwörtern:</strong> ${keywordsUsed} (${totalPoems > 0 ? Math.round((keywordsUsed / totalPoems) * 100) : 0}%)</p>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h2 style="color: #4a5568;">Zielgruppen</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Zielgruppe</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Anzahl</th>
                </tr>
              </thead>
              <tbody>
                ${audienceRows}
              </tbody>
            </table>
          </div>
          
          <div>
            <h2 style="color: #4a5568;">Anlässe</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Anlass</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Anzahl</th>
                </tr>
              </thead>
              <tbody>
                ${occasionRows}
              </tbody>
            </table>
          </div>
          
          <p style="margin-top: 24px; font-size: 0.9em; color: #718096;">
            Dies ist eine automatisch generierte E-Mail von Poetica. Tagesstatistik für ${yesterdayFormatted}, generiert am ${new Date().toISOString()}.
          </p>
        </body>
      </html>
    `;
    
    // Update the recipient email
    const recipientEmail = "matthiasvogel1973@gmail.com"; // Admin email
    
    console.log(`[daily-stats-email] Sending email to ${recipientEmail}`);
    
    // Send email
    const emailData = await resend.emails.send({
      from: "Poetica <onboarding@resend.dev>",  // Change this to your verified domain when in production
      to: [recipientEmail],
      subject: `Poetica Tagesstatistik: ${yesterdayFormatted}`,
      html: emailHtml,
    });
    
    console.log('[daily-stats-email] Stats email sent:', emailData);

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending daily stats email:", error);
    
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
