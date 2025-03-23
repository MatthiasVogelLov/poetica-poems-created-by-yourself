
/**
 * Parse and validate the request body
 */
export async function parseRequestBody(req: Request): Promise<{
  poemTitle: string;
  formData: any;
  poemContent: string;
  editorPreferences: any;
}> {
  const body = await req.text();
  console.log('[notify-poem] Request body received, length:', body.length);
  console.log('[notify-poem] Request body:', body.substring(0, 200) + '...'); // Log part of the body for debugging
  
  try {
    const parsedBody = JSON.parse(body);
    const poemTitle = parsedBody.poemTitle;
    const formData = parsedBody.formData;
    const poemContent = parsedBody.poemContent;
    const editorPreferences = parsedBody.editorPreferences || null;
    
    console.log('[notify-poem] Successfully parsed request body. poemTitle:', poemTitle);
    console.log('[notify-poem] Editor preferences:', editorPreferences);
    
    if (!poemTitle) {
      console.error('[notify-poem] Missing poem title');
      throw new Error('Missing poem title');
    }
    
    console.log('[notify-poem] Preparing to send poem notification:', { 
      poemTitle, 
      hasContent: !!poemContent, 
      contentLength: poemContent?.length,
      hasFormData: !!formData,
      formDataKeys: formData ? Object.keys(formData) : []
    });
    
    return {
      poemTitle,
      formData,
      poemContent,
      editorPreferences
    };
  } catch (parseError) {
    console.error('[notify-poem] Error parsing request body:', parseError);
    throw new Error(`Failed to parse request body: ${parseError.message}`);
  }
}
