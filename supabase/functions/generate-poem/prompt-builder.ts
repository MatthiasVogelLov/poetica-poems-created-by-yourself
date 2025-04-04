
// Generate the system prompt for the AI
export function generateSystemPrompt(language = 'de') {
  if (language === 'en') {
    return `You are an expert poet who specializes in creating beautiful, emotive, and personalized poems. 
    Your task is to create a poem that matches the user's requirements for audience, occasion, content type, style, verse type, and length.
    Please generate a poem in English that feels authentic, meaningful, and tailored to the provided specifications.
    The poem should be well-structured with appropriate line breaks and stanzas.
    Make sure the poem has emotional depth and avoids clichés or overly simplistic language.
    Do not include a title - I will add that separately.
    Structure the poem with clear stanzas and appropriate line breaks.`;
  }
  
  return `You are an expert poet who specializes in creating beautiful, emotive, and personalized poems in German. 
  Your task is to create a poem that matches the user's requirements for audience, occasion, content type, style, verse type, and length.
  Please generate a poem in German that feels authentic, meaningful, and tailored to the provided specifications.
  The poem should be well-structured with appropriate line breaks and stanzas.
  Make sure the poem has emotional depth and avoids clichés or overly simplistic language.
  Do not include a title - I will add that separately.
  Structure the poem with clear stanzas and appropriate line breaks.`;
}

// Interface for user prompt parameters
interface UserPromptParams {
  audience: string;
  occasion: string;
  contentType: string;
  style: string;
  verseType: string;
  length: string;
  keywords?: string;
  language?: string;
}

// Generate the user prompt for the AI
export function generateUserPrompt(params: UserPromptParams) {
  const { audience, occasion, contentType, style, verseType, length, keywords, language = 'de' } = params;
  
  if (language === 'en') {
    return `Please create a poem with the following specifications:
    - Audience: ${audience}
    - Occasion: ${occasion}
    - Content Type: ${contentType}
    - Style: ${style}
    - Verse Type: ${verseType}
    - Length: ${length} lines
    ${keywords ? `- Keywords to incorporate: ${keywords}` : ''}
    
    The poem should be in English.
    Make sure to use natural line breaks and stanza structures that enhance the flow and rhythm of the poem.
    The content should be appropriate for the audience and occasion.
    Don't include a title.`;
  }
  
  return `Please create a poem with the following specifications:
  - Audience: ${audience}
  - Occasion: ${occasion}
  - Content Type: ${contentType}
  - Style: ${style}
  - Verse Type: ${verseType}
  - Length: ${length} lines
  ${keywords ? `- Keywords to incorporate: ${keywords}` : ''}
  
  The poem should be in German.
  Make sure to use natural line breaks and stanza structures that enhance the flow and rhythm of the poem.
  The content should be appropriate for the audience and occasion.
  Don't include a title.`;
}
