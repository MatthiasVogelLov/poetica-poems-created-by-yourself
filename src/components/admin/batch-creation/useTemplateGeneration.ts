
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import { getRandomOption } from './poemUtils';
import { useLanguage } from '@/contexts/LanguageContext';

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
  language?: string;
}

export const useTemplateGeneration = (onSuccess: () => void) => {
  const { language } = useLanguage();
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
    useRandomOptions: false,
    language: language // Initialize with current language
  });

  const handleTemplateChange = (field: string, value: any) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const generateTemplatePoems = async (data: TemplateData = templateData) => {
    setIsGenerating(true);
    try {
      const currentData = { ...templateData, ...data, language };
      
      for (let i = 0; i < currentData.count; i++) {
        // Use either the selected values or random values based on useRandomOptions
        const audience = currentData.useRandomOptions ? 
          getRandomOption('audience') : currentData.audience;
        const occasion = currentData.useRandomOptions ? 
          getRandomOption('occasion') : currentData.occasion;
        const contentType = currentData.useRandomOptions ? 
          getRandomOption('contentType') : currentData.contentType;
        const style = currentData.useRandomOptions ? 
          getRandomOption('style') : currentData.style;
        const verseType = currentData.useRandomOptions ? 
          getRandomOption('verseType') : currentData.verseType;
        const length = currentData.useRandomOptions ? 
          getRandomOption('length') : currentData.length;

        // Call the generate-poem edge function to create a real poem
        const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
          body: {
            audience: audience,
            occasion: occasion,
            contentType: contentType,
            style: style,
            verseType: verseType,
            length: length,
            keywords: currentData.keywords,
            language: currentData.language
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
            status: 'draft',
            language: currentData.language
          });
          
        if (error) throw error;
      }
      
      toast.success(currentData.language === 'en' 
        ? `${currentData.count} poems have been created` 
        : `${currentData.count} Gedichte wurden erstellt`);
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
