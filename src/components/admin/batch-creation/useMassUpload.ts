
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Style, VerseType, Length } from '@/types/poem';
import { useLanguage } from '@/contexts/LanguageContext';

interface PoemEntry {
  title: string;
  content: string;
  occasion: string;
  contentType: string;
  keywords: string;
}

interface MassUploadData {
  style: Style;
  verseType: VerseType;
  length: Length;
  useRandomOptions: boolean;
  publishToPoemsLand: boolean;
  poemEntries: PoemEntry[];
  language?: string;
}

export const useMassUpload = (onSuccess: () => void) => {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [massUploadData, setMassUploadData] = useState<MassUploadData>({
    style: 'klassisch',
    verseType: 'kreuzreim',
    length: 'mittel',
    useRandomOptions: false,
    publishToPoemsLand: false,
    poemEntries: [{ title: '', content: '', occasion: 'geburtstag', contentType: 'liebe', keywords: '' }],
    language: language // Initialize with current language
  });

  const handleStyleChange = (value: Style) => {
    setMassUploadData(prev => ({ ...prev, style: value }));
  };

  const handleVerseTypeChange = (value: VerseType) => {
    setMassUploadData(prev => ({ ...prev, verseType: value }));
  };

  const handleLengthChange = (value: Length) => {
    setMassUploadData(prev => ({ ...prev, length: value }));
  };

  const handleRandomOptionsChange = (value: boolean) => {
    setMassUploadData(prev => ({ ...prev, useRandomOptions: value }));
  };

  const handlePublishToPoemsLandChange = (value: boolean) => {
    setMassUploadData(prev => ({ ...prev, publishToPoemsLand: value }));
  };

  const handlePoemEntryChange = (index: number, field: string, value: string) => {
    setMassUploadData(prev => {
      const newEntries = [...prev.poemEntries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return { ...prev, poemEntries: newEntries };
    });
  };

  const generateMassUploadPoems = async (data: Partial<MassUploadData> = {}) => {
    setIsGenerating(true);
    try {
      const currentData = { ...massUploadData, ...data, language };
      
      // Check if there are entries to process
      if (currentData.poemEntries.length === 0) {
        throw new Error('No poem entries to generate');
      }

      // Process each poem entry
      for (let entry of currentData.poemEntries) {
        if (!entry.title.trim()) {
          continue; // Skip entries without a title
        }

        // Generate poem content if needed
        let poemContent = entry.content;
        if (!poemContent.trim()) {
          const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
            body: {
              title: entry.title,
              occasion: entry.occasion,
              contentType: entry.contentType,
              style: currentData.style,
              verseType: currentData.verseType,
              length: currentData.length,
              keywords: entry.keywords,
              language: currentData.language
            }
          });
          
          if (generationError) {
            console.error(`Error generating content for poem "${entry.title}":`, generationError);
            continue;
          }
          
          poemContent = generationResult.poem;
        }

        // Save the poem to the database
        const { error } = await supabase
          .from('user_poems')
          .insert({
            title: entry.title,
            content: poemContent,
            occasion: entry.occasion,
            content_type: entry.contentType,
            style: currentData.style,
            verse_type: currentData.verseType,
            length: currentData.length,
            keywords: entry.keywords,
            batch_created: true,
            status: currentData.publishToPoemsLand ? 'published' : 'draft',
            language: currentData.language
          });
          
        if (error) {
          console.error(`Error saving poem "${entry.title}":`, error);
        }
      }
      
      toast.success(currentData.language === 'en' 
        ? 'Poems uploaded successfully' 
        : 'Gedichte erfolgreich hochgeladen');
      onSuccess();
    } catch (error) {
      console.error('Error in mass upload:', error);
      toast.error('Fehler beim Hochladen der Gedichte: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    massUploadData,
    isGenerating,
    handleStyleChange,
    handleVerseTypeChange,
    handleLengthChange,
    handleRandomOptionsChange,
    handlePublishToPoemsLandChange,
    handlePoemEntryChange,
    generateMassUploadPoems
  };
};
