
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';

interface ManualPoemData {
  title: string;
  content: string;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords?: string;
  generateContent?: boolean;
}

export const useManualPoemCreation = (onSuccess: () => void) => {
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
    generateContent: false
  });

  const handleManualChange = (field: string, value: any) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const generatePoemContent = async () => {
    setIsGenerating(true);
    try {
      // Format keywords - retain original input for database storage
      const keywords = manualPoemData.keywords?.trim() || '';
      
      // Call the generate-poem edge function to create content
      const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
        body: {
          audience: manualPoemData.audience,
          occasion: manualPoemData.occasion,
          contentType: manualPoemData.contentType,
          style: manualPoemData.style,
          verseType: manualPoemData.verseType,
          length: manualPoemData.length,
          keywords: keywords // Pass the keywords to the generator
        }
      });
      
      if (generationError) {
        console.error('Error generating poem:', generationError);
        throw generationError;
      }
      
      // Use the provided title if available, otherwise use the generated title
      const title = manualPoemData.title.trim() || generationResult.title;
      
      // Update the poem data with the generated content
      setManualPoemData(prev => ({
        ...prev,
        title: title,
        content: generationResult.poem
      }));
      
      return { title, content: generationResult.poem };
    } catch (error) {
      console.error('Error generating poem content:', error);
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const createManualPoem = async () => {
    try {
      let title = manualPoemData.title.trim();
      let content = manualPoemData.content;
      
      // If generateContent is true and content is empty, generate content
      if (manualPoemData.generateContent && !content) {
        setIsGenerating(true);
        try {
          const result = await generatePoemContent();
          title = title || result.title;
          content = result.content;
        } catch (error) {
          setIsGenerating(false);
          return; // Error already handled in generatePoemContent
        }
        setIsGenerating(false);
      }
      
      if (!title) {
        toast.error('Bitte einen Titel eingeben');
        return;
      }
      
      if (!content) {
        toast.error('Kein Gedichtinhalt vorhanden. Bitte generieren Sie Inhalt oder geben Sie ihn manuell ein.');
        return;
      }

      // Format keywords before storage
      const keywords = manualPoemData.keywords?.trim() || null;
      
      const { error } = await supabase
        .from('user_poems')
        .insert({
          title: title,
          content: content, // Store content without adding title
          audience: manualPoemData.audience,
          occasion: manualPoemData.occasion,
          content_type: manualPoemData.contentType,
          style: manualPoemData.style,
          verse_type: manualPoemData.verseType,
          length: manualPoemData.length,
          batch_created: true,
          status: 'draft',
          keywords: keywords
        });
        
      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }
      
      toast.success('Gedicht wurde erstellt');
      setManualPoemData({
        title: '',
        content: '',
        audience: 'erwachsene',
        occasion: 'geburtstag',
        contentType: 'liebe',
        style: 'klassisch',
        verseType: 'kreuzreim',
        length: 'mittel',
        keywords: '',
        generateContent: manualPoemData.generateContent
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating poem:', error);
      toast.error('Fehler bei der Gedichterstellung: ' + (error.message || 'Unbekannter Fehler'));
    }
  };

  return {
    manualPoemData,
    handleManualChange,
    createManualPoem,
    generatePoemContent,
    isGenerating
  };
};
