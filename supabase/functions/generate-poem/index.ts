
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { audience, occasion, contentType, style, length, keywords } = await req.json();
    
    // Generate a system prompt based on the form data
    let systemPrompt = "Du bist ein erfahrener Dichter, der personalisierte Gedichte auf Deutsch erstellt. ";
    systemPrompt += "Deine Gedichte sind kreativ, einfühlsam und entsprechen genau den Anforderungen des Nutzers.";
    
    // Create a tailored user prompt based on the form data
    let userPrompt = `Erstelle ein Gedicht mit folgenden Eigenschaften:\n`;
    userPrompt += `- Zielgruppe: ${audience}\n`;
    userPrompt += `- Anlass: ${occasion}\n`;
    userPrompt += `- Thema: ${contentType}\n`;
    userPrompt += `- Stil: ${style}\n`;
    
    // Add length specification
    if (length === 'kurz') {
      userPrompt += `- Länge: Kurz (4-8 Zeilen)\n`;
    } else if (length === 'mittel') {
      userPrompt += `- Länge: Mittel (8-16 Zeilen)\n`;
    } else if (length === 'lang') {
      userPrompt += `- Länge: Lang (16-24 Zeilen)\n`;
    }
    
    // Add keywords if provided
    if (keywords && keywords.trim()) {
      userPrompt += `- Verwende folgende Schlüsselwörter: ${keywords}\n`;
    }
    
    userPrompt += `\nDas Gedicht sollte emotionaler Tiefe haben und die Schlüsselwörter, falls angegeben, natürlich einbinden.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    const poemContent = data.choices[0].message.content;

    // Generate an appropriate title based on the occasion
    let title;
    switch (occasion) {
      case 'geburtstag':
        title = 'Geburtstagsgedicht';
        break;
      case 'hochzeit':
        title = 'Hochzeitsgedicht';
        break;
      case 'jubilaeum':
        title = 'Jubiläumsgedicht';
        break;
      case 'trauerfall':
        title = 'Gedicht zum Gedenken';
        break;
      case 'weihnachten':
        title = 'Weihnachtsgedicht';
        break;
      case 'valentinstag':
        title = 'Liebesgedicht zum Valentinstag';
        break;
      default:
        title = 'Personalisiertes Gedicht';
    }

    return new Response(
      JSON.stringify({
        title,
        poem: poemContent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating poem:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
