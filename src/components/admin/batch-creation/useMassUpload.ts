
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Style, VerseType, Length } from '@/types/poem';
import { getRandomOption } from './poemUtils';

interface TitleKeywordPair {
  id: string;
  title: string;
  keywords: string;
}

export const useMassUpload = (onSuccess: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMassUpload = async (
    pairs: TitleKeywordPair[],
    style: Style,
    verseType: VerseType,
    length: Length,
    useRandomOptions: boolean
  ) => {
    setIsGenerating(true);

    try {
      // Filter pairs to only include those with titles
      const validPairs = pairs.filter(pair => pair.title.trim() !== '');
      
      if (validPairs.length === 0) {
        toast.error('Bitte geben Sie mindestens einen Titel ein');
        return;
      }

      for (const pair of validPairs) {
        // Use either the selected values or random values based on useRandomOptions
        const poemStyle = useRandomOptions ? getRandomOption('style') : style;
        const poemVerseType = useRandomOptions ? getRandomOption('verseType') : verseType;
        const poemLength = useRandomOptions ? getRandomOption('length') : length;

        // Call the generate-poem edge function to create a real poem
        const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
          body: {
            style: poemStyle,
            verseType: poemVerseType,
            length: poemLength,
            title: pair.title,
            keywords: pair.keywords
          }
        });
        
        if (generationError) {
          console.error('Error generating poem:', generationError);
          throw generationError;
        }
        
        // Save the generated poem to the database
        const { error } = await supabase
          .from('user_poems')
          .insert({
            title: pair.title || (generationResult.title || `Gedicht`),
            content: generationResult.poem,
            style: poemStyle,
            verse_type: poemVerseType,
            length: poemLength,
            keywords: pair.keywords,
            batch_created: true,
            status: 'draft'
          });
          
        if (error) throw error;
      }
      
      toast.success(`${validPairs.length} Gedichte wurden erstellt`);
      onSuccess();
    } catch (error) {
      console.error('Error generating poems:', error);
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleMassUpload
  };
};
