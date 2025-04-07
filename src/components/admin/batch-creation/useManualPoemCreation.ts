
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import { useLanguage } from '@/contexts/LanguageContext';

interface ManualPoemData {
  title: string;
  content: string;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords: string;
  generateContent: boolean;
  publishAfterCreation: boolean;
  language?: string;
}

export const useManualPoemCreation = (onSuccess: () => void) => {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualPoemData, setManualPoemData] = useState<ManualPoemData>({
    title: '',
    content: '',
    audience: 'erwachsene',
    occasion: 'geburtstag',
    contentType: 'liebe',
    style: 'klassisch',
    verseType: 'kreuzreim',
    length: 'mittel',
    keywords: '',
    generateContent: true,
    publishAfterCreation: false,
    language: language // Initialize with current language
  });

  const handleManualChange = (field: string, value: any) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const generatePoemContent = async (data: Partial<ManualPoemData> = {}) => {
    setIsGenerating(true);
    try {
      const currentData = { ...manualPoemData, ...data, language };

      // Generate poem content using the edge function
      const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
        body: {
          audience: currentData.audience,
          occasion: currentData.occasion,
          contentType: currentData.contentType,
          style: currentData.style,
          verseType: currentData.verseType,
          length: currentData.length,
          keywords: currentData.keywords,
          language: currentData.language
        }
      });
      
      if (generationError) {
        console.error('Error generating poem content:', generationError);
        throw generationError;
      }
      
      // Update manual poem data with the generated content
      handleManualChange('content', generationResult.poem);
      
      // If title is empty, use the generated title
      if (!currentData.title) {
        handleManualChange('title', generationResult.title);
      }
      
    } catch (error) {
      console.error('Error generating poem content:', error);
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setIsGenerating(false);
    }
  };

  const createManualPoem = async (data: Partial<ManualPoemData> = {}) => {
    setIsGenerating(true);
    try {
      const currentData = { ...manualPoemData, ...data, language };

      // If generateContent is true and content is empty, generate content first
      if (currentData.generateContent && !currentData.content) {
        await generatePoemContent(currentData);
      }
      
      // Create the poem in the database
      const { error } = await supabase
        .from('user_poems')
        .insert({
          title: currentData.title,
          content: currentData.content,
          occasion: currentData.occasion,
          content_type: currentData.contentType,
          style: currentData.style,
          verse_type: currentData.verseType,
          length: currentData.length,
          keywords: currentData.keywords,
          batch_created: true,
          status: currentData.publishAfterCreation ? 'published' : 'draft',
          language: currentData.language
        });
        
      if (error) throw error;
      
      // Reset the form
      setManualPoemData({
        ...manualPoemData,
        title: '',
        content: ''
      });
      
      toast.success(currentData.language === 'en' 
        ? 'Poem created successfully' 
        : 'Gedicht erfolgreich erstellt');
      onSuccess();
    } catch (error) {
      console.error('Error creating manual poem:', error);
      toast.error('Fehler beim Erstellen des Gedichts: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    manualPoemData,
    isGenerating,
    handleManualChange,
    createManualPoem,
    generatePoemContent
  };
};
