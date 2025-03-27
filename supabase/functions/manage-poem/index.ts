
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

        console.log(`Updating poem with data:`, poemData);
        
        // For poems when setting status to 'deleted', we check if it's published first
        if (poemData.status === 'deleted') {
          // First check if the poem is published or not
          const { data: poemInfo, error: poemInfoError } = await supabase
            .from('user_poems')
            .select('status, batch_created')
            .eq('id', poemId)
            .single();
            
          if (poemInfoError) {
            console.error('Error getting poem info:', poemInfoError);
            return createResponse({ error: 'Failed to get poem info', details: poemInfoError }, 500);
          }
          
          // If the poem is published and we're trying to delete it, change the status to hidden instead
          if (poemInfo && poemInfo.status === 'published') {
            const { data: updateData, error: updateError } = await supabase
              .from('user_poems')
              .update({ status: 'hidden' })
              .eq('id', poemId)
              .select();

            if (updateError) {
              console.error('Error updating poem:', updateError);
              return createResponse({ error: 'Failed to update poem', details: updateError }, 500);
            }

            return createResponse({ success: true, data: updateData });
          }
        }
        
        // If the requested status is 'hidden_from_admin', change it to 'hidden'
        if (poemData.status === 'hidden_from_admin') {
          poemData.status = 'hidden';  // Use 'hidden' which is an allowed value
        }
        
        // For all other status changes
        const { data: updateData, error: updateError } = await supabase
          .from('user_poems')
          .update(poemData)
          .eq('id', poemId)
          .select();

        if (updateError) {
          console.error('Error updating poem:', updateError);
          return createResponse({ error: 'Failed to update poem', details: updateError }, 500);
        }

        return createResponse({ success: true, data: updateData });

      case 'delete':
        if (!poemId) {
          return createResponse({ error: 'Missing poem ID' }, 400);
        }

        // Check if the poem is published before actually deleting it
        const { data: poemToDelete, error: checkError } = await supabase
          .from('user_poems')
          .select('status')
          .eq('id', poemId)
          .single();
          
        if (checkError) {
          console.error('Error checking poem status:', checkError);
          return createResponse({ error: 'Failed to check poem status' }, 500);
        }
        
        // If published, just mark as hidden instead of removing
        if (poemToDelete && poemToDelete.status === 'published') {
          const { error: updateError } = await supabase
            .from('user_poems')
            .update({ status: 'hidden' })
            .eq('id', poemId);
            
          if (updateError) {
            console.error('Error updating poem status:', updateError);
            return createResponse({ error: 'Failed to update poem status' }, 500);
          }
        } else {
          // If not published, we can safely delete it
          const { error: deleteError } = await supabase
            .from('user_poems')
            .delete()
            .eq('id', poemId);

          if (deleteError) {
            console.error('Error deleting poem:', deleteError);
            return createResponse({ error: 'Failed to delete poem' }, 500);
          }
        }

        return createResponse({ success: true });

      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse({ error: 'Internal server error', details: error.message }, 500);
  }
});
