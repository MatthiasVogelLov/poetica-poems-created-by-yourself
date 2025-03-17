
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data } = await req.json();
    console.log(`[track-stats] Received tracking request: ${action}`, data);

    let result;

    switch (action) {
      case 'poem_generated':
        // Track a poem generation
        result = await supabase
          .from('poem_stats')
          .insert({
            audience: data.audience || null,
            occasion: data.occasion || null,
            content_type: data.contentType || null,
            style: data.style || null,
            length: data.length || null,
            has_keywords: data.keywords ? true : false
          });
        break;

      case 'payment_completed':
        // Update payment status for a poem
        result = await supabase
          .from('poem_stats')
          .update({ payment_status: 'paid' })
          .eq('id', data.poemId);
        break;

      case 'feature_used':
        // Track feature usage
        result = await supabase
          .from('feature_usage')
          .insert({
            feature_name: data.featureName
          });
        break;

      case 'keyword_used':
        // Track keywords used
        if (data.keywords && data.poemId) {
          const keywords = data.keywords.split(',').map(k => k.trim());
          
          for (const keyword of keywords) {
            if (keyword) {
              await supabase
                .from('keyword_usage')
                .insert({
                  keyword,
                  poem_id: data.poemId
                });
            }
          }
        }
        result = { success: true };
        break;

      default:
        throw new Error(`Unrecognized action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('[track-stats] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
