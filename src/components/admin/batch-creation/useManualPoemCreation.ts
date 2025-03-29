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
  publishAfterCreation?: boolean;
}

export const useManualPoemCreation = (onSuccess: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
    generateContent: false,
    publishAfterCreation: false
  });

  const handleManualChange = (field: string, value: any) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const generatePoemContent = async () => {
    setIsGenerating(true);
    try {
      const keywords = manualPoemData.keywords?.trim() || '';
      
      const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
        body: {
          audience: manualPoemData.audience,
          occasion: manualPoemData.occasion,
          contentType: manualPoemData.contentType,
          style: manualPoemData.style,
          verseType: manualPoemData.verseType,
          length: manualPoemData.length,
          keywords: keywords
        }
      });
      
      if (generationError) {
        console.error('Error generating poem:', generationError);
        throw generationError;
      }
      
      const title = manualPoemData.title.trim() || generationResult.title;
      
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

  const publishPoem = async (poemId: string) => {
    setIsPublishing(true);
    try {
      const { error } = await supabase.functions.invoke('manage-poem', {
        body: {
          action: 'update',
          poemId: poemId,
          poemData: { status: 'published' }
        }
      });
      
      if (error) throw error;
      toast.success('Gedicht wurde veröffentlicht');
      return true;
    } catch (error) {
      console.error('Error publishing poem:', error);
      toast.error('Fehler bei der Veröffentlichung: ' + (error.message || 'Unbekannter Fehler'));
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  const createManualPoem = async () => {
    try {
      let title = manualPoemData.title.trim();
      let content = manualPoemData.content;
      
      if (manualPoemData.generateContent && !content) {
        setIsGenerating(true);
        try {
          const result = await generatePoemContent();
          title = title || result.title;
          content = result.content;
        } catch (error) {
          setIsGenerating(false);
          return;
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

      const keywords = manualPoemData.keywords?.trim() || null;
      
      const initialStatus = manualPoemData.publishAfterCreation ? 'published' : 'draft';
      
      const { data, error } = await supabase
        .from('user_poems')
        .insert({
          title: title,
          content: content,
          audience: manualPoemData.audience,
          occasion: manualPoemData.occasion,
          content_type: manualPoemData.contentType,
          style: manualPoemData.style,
          verse_type: manualPoemData.verseType,
          length: manualPoemData.length,
          batch_created: true,
          status: initialStatus,
          keywords: keywords
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }
      
      if (manualPoemData.publishAfterCreation) {
        toast.success('Gedicht wurde erstellt und veröffentlicht');
      } else {
        toast.success('Gedicht wurde als Entwurf erstellt');
      }
      
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
        generateContent: manualPoemData.generateContent,
        publishAfterCreation: manualPoemData.publishAfterCreation
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
    publishPoem,
    isGenerating,
    isPublishing
  };
};
