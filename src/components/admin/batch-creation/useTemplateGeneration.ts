
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import { getRandomOption } from './poemUtils';

interface TemplateData {
  count: number;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords: string;
  useRandomOptions: boolean;
}

export const useTemplateGeneration = (onSuccess: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateData, setTemplateData] = useState<TemplateData>({
    count: 5,
    audience: 'erwachsene',
    occasion: 'geburtstag',
    contentType: 'liebe',
    style: 'klassisch',
    verseType: 'kreuzreim',
    length: 'mittel',
    keywords: '',
    useRandomOptions: false
  });

  const handleTemplateChange = (field: string, value: any) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const generateTemplatePoems = async () => {
    setIsGenerating(true);
    try {
      for (let i = 0; i < templateData.count; i++) {
        // Use either the selected values or random values based on useRandomOptions
        const audience = templateData.useRandomOptions ? 
          getRandomOption('audience') : templateData.audience;
        const occasion = templateData.useRandomOptions ? 
          getRandomOption('occasion') : templateData.occasion;
        const contentType = templateData.useRandomOptions ? 
          getRandomOption('contentType') : templateData.contentType;
        const style = templateData.useRandomOptions ? 
          getRandomOption('style') : templateData.style;
        const verseType = templateData.useRandomOptions ? 
          getRandomOption('verseType') : templateData.verseType;
        const length = templateData.useRandomOptions ? 
          getRandomOption('length') : templateData.length;

        // Call the generate-poem edge function to create a real poem
        const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
          body: {
            audience: audience,
            occasion: occasion,
            contentType: contentType,
            style: style,
            verseType: verseType,
            length: length,
            keywords: templateData.keywords
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
            title: generationResult.title || `Gedicht - ${occasion}`,
            content: generationResult.poem,
            occasion: occasion,
            content_type: contentType,
            style: style,
            verse_type: verseType,
            length: length,
            batch_created: true,
            status: 'draft'
          });
          
        if (error) throw error;
      }
      
      toast.success(`${templateData.count} Gedichte wurden erstellt`);
      onSuccess();
    } catch (error) {
      console.error('Error generating poems:', error);
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    templateData,
    isGenerating,
    handleTemplateChange,
    generateTemplatePoems
  };
};
