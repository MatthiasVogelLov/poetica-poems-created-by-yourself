
// Utility functions for email-related edge functions

/**
 * Standard CORS headers for Edge Functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

/**
 * Parse and validate request body
 */
export async function parseRequestBody<T>(req: Request): Promise<{ data: T | null; error: string | null }> {
  try {
    const body = await req.json();
    return { data: body as T, error: null };
  } catch (error) {
    console.error('Error parsing request body:', error);
    return { 
      data: null, 
      error: 'Failed to parse request body. Make sure it is valid JSON.' 
    };
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(message: string, status: number = 400, details: any = null): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message,
      details: details
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify({ 
      success: true, 
      data 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );
}

/**
 * Format text content to preserve line breaks in HTML
 */
export function formatTextWithLineBreaks(text: string): string {
  return text.replace(/\n/g, '<br />');
}

/**
 * Format poem content to preserve stanzas and line breaks in HTML
 * with enhanced styling
 */
export function formatPoemForEmail(poemContent: string): string {
  if (!poemContent) return '<p class="poem-line">Kein Gedichttext verfügbar</p>';
  
  // First split by double line breaks (stanzas)
  const stanzas = poemContent.split(/\n\s*\n/);
  
  // Clean up stanzas and process them
  return stanzas
    .map(stanza => {
      if (!stanza.trim()) return ''; // Skip empty stanzas
      
      // For each stanza, wrap each line in a paragraph tag with improved styling
      return stanza
        .split('\n')
        .map(line => {
          // Convert ** emphasis ** to <em> tags for italics
          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<em>$1</em>');
          return `<p style="margin: 0; line-height: 1.8; font-size: 15px; text-align: center;">${formattedLine || '&nbsp;'}</p>`;
        })
        .join('');
    })
    .filter(Boolean) // Remove empty stanzas
    .map(stanza => `<div style="margin-bottom: 2em; padding: 0;">${stanza}</div>`) // Wrap each stanza in a div with bottom margin
    .join('');
}

/**
 * Format poem content for WhatsApp sharing
 * Preserves line breaks and stanza structure
 */
export function formatPoemForWhatsApp(title: string, poem: string): string {
  // Add title first
  let formattedText = `*${title}*\n\n`;
  
  // Process the poem text
  formattedText += poem
    // Make sure stanzas have consistent spacing
    .replace(/\n{3,}/g, '\n\n')
    // Add a small decoration at the end
    + '\n\n~ Gedicht erstellt mit Poetica ~';
  
  return formattedText;
}
