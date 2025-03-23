
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { formatPoemForEmail } from "../_shared/email-utils.ts";
import { corsHeaders } from "./config.ts";
import { parseRequestBody } from "./request-parser.ts";
import { sendPoemNotification } from "./email-service.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[notify-poem] Starting execution with timestamp:', new Date().toISOString());
    
    // Parse request body
    const { poemTitle, formData, poemContent, editorPreferences } = await parseRequestBody(req);
    
    // Format poem content for email with enhanced styling
    const formattedPoemContent = formatPoemForEmail(poemContent);
    
    // Send email notification
    await sendPoemNotification(
      poemTitle,
      poemContent,
      formData,
      editorPreferences,
      formattedPoemContent
    );

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('[notify-poem] Error sending notification:', error.message, error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
