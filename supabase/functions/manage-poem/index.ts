
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Define CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCorsRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Create a standardized response with proper headers
function createResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, poemId, poemData } = await req.json();

    console.log(`Processing ${action} request for poem ID: ${poemId}`);

    switch (action) {
      case 'update':
        if (!poemId || !poemData) {
          return createResponse({ error: 'Missing poem ID or data' }, 400);
        }

        const { data: updateData, error: updateError } = await supabase
          .from('user_poems')
          .update(poemData)
          .eq('id', poemId);

        if (updateError) {
          console.error('Error updating poem:', updateError);
          return createResponse({ error: 'Failed to update poem' }, 500);
        }

        return createResponse({ success: true, data: updateData });

      case 'delete':
        if (!poemId) {
          return createResponse({ error: 'Missing poem ID' }, 400);
        }

        const { error: deleteError } = await supabase
          .from('user_poems')
          .delete()
          .eq('id', poemId);

        if (deleteError) {
          console.error('Error deleting poem:', deleteError);
          return createResponse({ error: 'Failed to delete poem' }, 500);
        }

        return createResponse({ success: true });

      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse({ error: 'Internal server error' }, 500);
  }
});
