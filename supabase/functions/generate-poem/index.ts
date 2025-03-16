
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
    systemPrompt += "Deine Gedichte sind kreativ, einfühlsam und entsprechen genau den Anforderungen des Nutzers. ";
    systemPrompt += "Du beherrschst verschiedene deutsche Gedichtformen wie Sonett, Ballade, Ode, Hymne, Epigramm, Haiku, Tanka, Freie Verse und Elfchen.";
    
    // Create a tailored user prompt based on the form data
    let userPrompt = `Erstelle ein Gedicht mit folgenden Eigenschaften:\n`;
    userPrompt += `- Zielgruppe: ${audience}\n`;
    userPrompt += `- Anlass: ${occasion}\n`;
    userPrompt += `- Thema: ${contentType}\n`;
    
    // Add style specification with detailed instructions for German poem forms
    if (style === 'sonett') {
      userPrompt += `- Stil: Sonett (14 Zeilen, meistens in 4 Strophen: 2 Quartette und 2 Terzette, mit festem Reimschema)\n`;
    } else if (style === 'ballade') {
      userPrompt += `- Stil: Ballade (erzählerisch, meist mit wiederkehrendem Refrain)\n`;
    } else if (style === 'ode') {
      userPrompt += `- Stil: Ode (feierlich, erhaben und an eine Person oder Sache gerichtet)\n`;
    } else if (style === 'hymne') {
      userPrompt += `- Stil: Hymne (feierliches Loblied, erhaben und preisend)\n`;
    } else if (style === 'epigramm') {
      userPrompt += `- Stil: Epigramm (kurz, prägnant, mit einer pointierten Wendung am Ende)\n`;
    } else if (style === 'haiku') {
      userPrompt += `- Stil: Haiku (drei Zeilen mit 5-7-5 Silben, Naturbetrachtung)\n`;
    } else if (style === 'tanka') {
      userPrompt += `- Stil: Tanka (fünf Zeilen mit 5-7-5-7-7 Silben)\n`;
    } else if (style === 'freieverse') {
      userPrompt += `- Stil: Freie Verse (ohne festes Metrum und Reimschema)\n`;
    } else if (style === 'elfchen') {
      userPrompt += `- Stil: Elfchen (genau 11 Wörter in 5 Zeilen mit 1-2-3-4-1 Wörtern)\n`;
    } else {
      userPrompt += `- Stil: ${style}\n`;
    }
    
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
    
    userPrompt += `\nDas Gedicht sollte emotionale Tiefe haben und die Schlüsselwörter, falls angegeben, natürlich einbinden. Halte dich streng an die gewählte Gedichtform und deren Merkmale.`;

    console.log("Sending to OpenAI with prompt:", userPrompt);

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

    // Generate an appropriate title based on style and occasion
    let title;
    
    // Title based on poetic form
    if (style === 'sonett') {
      title = 'Sonett: ';
    } else if (style === 'ballade') {
      title = 'Ballade: ';
    } else if (style === 'ode') {
      title = 'Ode: ';
    } else if (style === 'hymne') {
      title = 'Hymne: ';
    } else if (style === 'epigramm') {
      title = 'Epigramm: ';
    } else if (style === 'haiku') {
      title = 'Haiku: ';
    } else if (style === 'tanka') {
      title = 'Tanka: ';
    } else if (style === 'freieverse') {
      title = 'Freie Verse: ';
    } else if (style === 'elfchen') {
      title = 'Elfchen: ';
    }
    
    // Append occasion to title
    switch (occasion) {
      case 'geburtstag':
        title = (title || '') + 'Geburtstagsgedicht';
        break;
      case 'hochzeit':
        title = (title || '') + 'Hochzeitsgedicht';
        break;
      case 'jubilaeum':
        title = (title || '') + 'Jubiläumsgedicht';
        break;
      case 'trauerfall':
        title = (title || '') + 'Gedicht zum Gedenken';
        break;
      case 'weihnachten':
        title = (title || '') + 'Weihnachtsgedicht';
        break;
      case 'valentinstag':
        title = (title || '') + 'Liebesgedicht zum Valentinstag';
        break;
      default:
        title = (title || '') + 'Personalisiertes Gedicht';
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
