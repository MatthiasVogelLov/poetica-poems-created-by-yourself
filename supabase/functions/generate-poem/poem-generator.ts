
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
      temperature: 0.5, // Reduced from 0.7 to improve coherence and reduce randomness
      max_tokens: 1000,
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

  return { title, poem: poemContent };
}
