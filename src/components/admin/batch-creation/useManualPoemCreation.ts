
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
}

export const useManualPoemCreation = (onSuccess: () => void) => {
  const [manualPoemData, setManualPoemData] = useState<ManualPoemData>({
    title: '',
    content: '',
    audience: 'erwachsene',
    occasion: 'geburtstag',
    contentType: 'liebe',
    style: 'klassisch',
    verseType: 'kreuzreim',
    length: 'mittel',
  });

  const handleManualChange = (field: string, value: any) => {
    setManualPoemData(prev => ({ ...prev, [field]: value }));
  };

  const createManualPoem = async () => {
    if (!manualPoemData.title || !manualPoemData.content) {
      toast.error('Bitte Titel und Inhalt eingeben');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_poems')
        .insert({
          title: manualPoemData.title,
          content: manualPoemData.content,
          occasion: manualPoemData.occasion,
          content_type: manualPoemData.contentType,
          style: manualPoemData.style,
          verse_type: manualPoemData.verseType,
          length: manualPoemData.length,
          batch_created: true,
          status: 'draft'
        });
        
      if (error) throw error;
      
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
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating poem:', error);
      toast.error('Fehler bei der Gedichterstellung');
    }
  };

  return {
    manualPoemData,
    handleManualChange,
    createManualPoem
  };
};
