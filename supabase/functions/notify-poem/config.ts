
// Configuration for notify-poem function
export const config = {
  resendApiKey: Deno.env.get('RESEND_API_KEY'),
  recipientEmail: "matthiasvogel1973@gmail.com",
};

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
