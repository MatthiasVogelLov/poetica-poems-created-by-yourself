
// Function to generate a title based on occasion
export const generateTitleFromOccasion = (occasion: string): string => {
  switch (occasion) {
    case 'geburtstag':
      return 'Birthday Poem';
    case 'hochzeit':
      return 'Wedding Poem';
    case 'jubilaeum':
      return 'Anniversary Poem';
    case 'trauerfall':
      return 'Memorial Poem';
    case 'weihnachten':
      return 'Christmas Poem';
    case 'valentinstag':
      return 'Valentine\'s Day Love Poem';
    default:
      return 'Personalized Poem';
  }
};

// Function to get a sample poem based on content type
export const getSamplePoem = (contentType: string): string => {
  const samplePoems = {
    liebe: `Like sunlight on gentle waves,
Your smile shines upon me.
A heartbeat reaching for the sky,
In your eyes, I see our future.

Through time and space, through night and day,
Your heartbeat accompanies me.
Whatever happens, whatever may come,
With you, each day is brand new.

The words I find for you
Are just the beginning of a journey.
Connected in every breath,
Love gives us the most beautiful moments.

No path too far, no mountain too steep,
With you by my side, piece by piece,
We create a wonderful bond
That carries us through all times - hand in hand.`,
    freundschaft: `A soul's echo through time,
Two paths that gently touch.
Trust, carrying like bridges,
When storms cross our paths.

You hear the words I don't speak,
Understand the look, the subtle gesture.
In joy as in difficult hours,
You remain the anchor, solid and clear.

A laugh that takes away worries,
A comfort that needs no words.
So we walk on the same paths,
Two souls deeply understanding each other.

What connects us needs no light,
Grows silently in shadow and in brilliance.
Friendship, precious gift,
In you lies home and trust.`,
    natur: `In the rustling of old oak crowns,
In the tender green of early year,
Lies wisdom that gently touches us,
A whisper from times past.

The morning dew glistens on grasses,
As if stars had returned home.
The stream sings its own melody,
Ancient songs, always new.

In the changing of seasons,
Our own being is reflected.
We bloom, ripen, rest, grow,
In the eternal cycle of nature.

The mountains stand still and strong,
Like guardians over our time.
In their tranquility lies the strength,
That leads our souls homeward.`,
    leben: `The path of life, winding and wide,
Leads over peaks and through deep valleys.
Each step a breath of time,
Each choice a new chapter.

In the stillness of twilight,
Between yesterday and tomorrow,
Lies the power of renewal,
Old worries fade.

What we are and what we become,
Lies in our hands alone.
The traces we leave on earth,
Will be testimony to our being.

So let us live with open hearts,
Use the days given to us.
For in light as well as in pain,
Lies the true beauty of life.`,
    motivation: `Stand up when you have fallen,
Keep going when the path winds.
The greatest strength within you,
Awakens when darkness binds you.

Every morning, a new page,
Every hour, a chance to grow.
Even when fate laughs at you,
Your will can move mountains.

What seems impossible today,
Will tomorrow be the first step.
The faith united within you,
Takes all your doubts away.

So follow your inner star,
Even when it seems weak at times.
The goal may seem distant today,
Your courage has unified all fear.`,
    humor: `In everyday life, where worries dwell,
And seriousness rules with stern gaze,
There humor dances on quiet soles,
And gently brings us back to happiness.

A smile here, a laugh there,
A joke told at the right time,
Already it carries all heaviness away,
What just plagued the heart.

The art of not taking oneself too seriously,
Is wisdom not everyone knows.
But who can freely embrace laughter,
Has a treasure that burns forever.

So let humor be your companion,
Through all heights, all depths.
It makes the heart and life fine,
Lets joy drip into the soul.`,
    trauer: `In the quiet garden of memories,
Where shadows weave soft stories,
Lies hidden a deep connection,
Stronger than death and life.

The tears we weep for you,
Are pearls of love that remains.
They become light and unite,
What time cannot separate.

In every breeze that touches us,
In every star that awakens at night,
Is your soul, reaching for us,
And softly whispers: "I've been watching over you."

So we carry your memory,
As a precious gift in our hearts.
Love will never sink,
It shines forth through all pain.`
  };

  return samplePoems[contentType] || samplePoems.liebe;
};

// Function to adjust poem length
export const adjustPoemLength = (poem: string, length: string): string => {
  let adjustedPoem = poem;
  
  if (length === 'kurz') {
    const lines = poem.split('\n');
    adjustedPoem = lines.slice(0, 8).join('\n');
  } else if (length === 'lang') {
    const stanzas = poem.split('\n\n');
    if (stanzas.length > 2) {
      adjustedPoem = [...stanzas, stanzas[1], stanzas[0]].join('\n\n');
    }
  }
  
  return adjustedPoem;
};

// Function to personalize poem with keywords
export const personalizeWithKeywords = (poem: string, keywords: string): string => {
  if (!keywords || !keywords.trim()) {
    return poem;
  }
  
  const keywordsList = keywords.split(',').map(k => k.trim());
  if (keywordsList.length > 0) {
    const personalizedStanza = `\n\nThe words "${keywordsList.join('" and "')}" united,
Conceived in this poem for you.
A personal greeting that appears,
Created with love and care.`;
    return poem + personalizedStanza;
  }
  
  return poem;
};
