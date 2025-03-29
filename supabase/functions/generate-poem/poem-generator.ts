
import { generateSystemPrompt, generateUserPrompt } from "./prompt-builder.ts";
import { generateTitleFromOccasion } from "./title-generator.ts";
import { validatePoemQuality } from "./poem-validator.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Main function to generate a poem based on form data
export async function generatePoem(formData: any) {
  const { audience, occasion, contentType, style, verseType, length, keywords } = formData;
  
  console.log("Sending to OpenAI with form data:", formData);

  // Generate prompts
  const systemPrompt = generateSystemPrompt();
  const userPrompt = generateUserPrompt({ audience, occasion, contentType, style, verseType, length, keywords });

  try {
    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the full gpt-4o model for better quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7, // Increased from 0.5 to allow for more creativity
        max_tokens: 1500, // Increased from 1000 to accommodate longer, more sophisticated poems
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    let poemContent = data.choices[0].message.content;
    
    // Remove rhyme scheme indicators like (A), (B) from the poem
    poemContent = poemContent.replace(/\s*\([A-Z]\)\s*(?=$|,|\.|;)/g, '');

    // Validate and improve poem quality
    const validationResult = validatePoemQuality(poemContent, verseType);
    if (!validationResult.valid) {
      console.log("Poem quality check failed:", validationResult.issues);
      // In a production system, we might regenerate the poem here
      // For now, we'll log the issues and continue
    }

    // Generate title
    const title = generateTitleFromOccasion(occasion, style);

    // Add a list of keywords at the end of the poem if keywords were provided
    if (keywords && keywords.trim()) {
      const keywordsList = keywords.split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0);
        
      if (keywordsList.length > 0) {
        // Make sure each keyword is properly capitalized according to German rules
        // In German, all nouns should be capitalized
        const formattedKeywords = keywordsList
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(', ');
        
        console.log("Used keywords in poem generation:", formattedKeywords);
      }
    }

    return { title, poem: poemContent };
  } catch (error) {
    console.error('Error in poem generation:', error);
    throw error;
  }
}
