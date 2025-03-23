
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { generatePoem } from "./poem-generator.ts";
import { createResponse, handleCorsRequest } from "./response-handler.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    const formData = await req.json();
    const responseData = await generatePoem(formData);
    return createResponse(responseData);
  } catch (error) {
    console.error('Error generating poem:', error);
    return createResponse({ 
      error: 'Beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.' 
    }, 500);
  }
});
