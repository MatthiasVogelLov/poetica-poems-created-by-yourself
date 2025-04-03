import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Style, VerseType, Length } from '@/types/poem';
import { generateRandomOptions } from './poemUtils';

interface PoemEntry {
  title: string;
  keywords: string;
}

interface MassUploadData {
  style: Style;
  verseType: VerseType;
  length: Length;
  useRandomOptions: boolean;
  poemEntries: PoemEntry[];
  publishToPoemsLand: boolean;
}

// Default to 5 empty poem entries
const initialPoemEntries = Array(5).fill({
  title: '',
  keywords: ''
}).map(() => ({ title: '', keywords: '' }));

export const useMassUpload = (onCompletion: () => void) => {
  const [massUploadData, setMassUploadData] = useState<MassUploadData>({
    style: 'klassisch',
    verseType: 'kreuzreim',
    length: 'mittel',
    useRandomOptions: false,
    poemEntries: initialPoemEntries,
    publishToPoemsLand: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStyleChange = (style: Style) => {
    setMassUploadData(prev => ({ ...prev, style }));
  };

  const handleVerseTypeChange = (verseType: VerseType) => {
    setMassUploadData(prev => ({ ...prev, verseType }));
  };

  const handleLengthChange = (length: Length) => {
    setMassUploadData(prev => ({ ...prev, length }));
  };

  const handleRandomOptionsChange = (useRandomOptions: boolean) => {
    setMassUploadData(prev => ({ ...prev, useRandomOptions }));
  };

  const handlePublishToPoemsLandChange = (publishToPoemsLand: boolean) => {
    setMassUploadData(prev => ({ ...prev, publishToPoemsLand }));
  };

  const handlePoemEntryChange = (index: number, field: 'title' | 'keywords', value: string) => {
    setMassUploadData(prev => {
      const updatedEntries = [...prev.poemEntries];
      
      // Handle the case when index is beyond the current array length
      // This happens when uploading an Excel file with more entries than we currently have
      if (index >= updatedEntries.length) {
        // Add empty entries up to the index
        for (let i = updatedEntries.length; i <= index; i++) {
          updatedEntries.push({ title: '', keywords: '' });
        }
      }
      
      // Now update the entry at the specified index
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
      
      return { ...prev, poemEntries: updatedEntries };
    });
  };

  const generateMassUploadPoems = async () => {
    // Filter out empty entries
    const validEntries = massUploadData.poemEntries.filter(entry => entry.title.trim());
    
    if (validEntries.length === 0) {
      toast.error('Bitte geben Sie mindestens einen Titel ein.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create an array to track failed entries
      const failedEntries: { title: string, error: string }[] = [];
      const successfulEntries: string[] = [];
      
      // Process entries sequentially to avoid overwhelming the API
      for (const entry of validEntries) {
        let poemOptions = {
          style: massUploadData.style,
          verseType: massUploadData.verseType,
          length: massUploadData.length
        };

        // Use random options if enabled
        if (massUploadData.useRandomOptions) {
          const randomOpts = generateRandomOptions();
          poemOptions = {
            style: randomOpts.style,
            verseType: randomOpts.verseType,
            length: randomOpts.length
          };
        }

        try {
          // Call the generate-poem edge function
          const { data, error } = await supabase.functions.invoke('generate-poem', {
            body: {
              ...poemOptions,
              title: entry.title,
              keywords: entry.keywords,
              audience: 'erwachsene',
              occasion: 'andere',
              contentType: 'natur'
            }
          });

          if (error) {
            failedEntries.push({ title: entry.title, error: error.message });
            continue;
          }
          
          if (!data) {
            failedEntries.push({ title: entry.title, error: 'Keine Daten vom Server erhalten' });
            continue;
          }
          
          // Save the generated poem to the database
          const { error: saveError } = await supabase
            .from('user_poems')
            .insert({
              title: entry.title,
              content: data.poem,
              style: poemOptions.style,
              verse_type: poemOptions.verseType,
              occasion: 'andere',
              content_type: 'natur',
              audience: 'erwachsene',
              status: massUploadData.publishToPoemsLand ? 'published' : 'draft',
              keywords: entry.keywords,
              length: poemOptions.length,
              batch_created: true
            });

          if (saveError) {
            failedEntries.push({ title: entry.title, error: saveError.message });
          } else {
            successfulEntries.push(entry.title);
          }
        } catch (entryError) {
          console.error(`Error processing entry "${entry.title}":`, entryError);
          failedEntries.push({ title: entry.title, error: entryError instanceof Error ? entryError.message : 'Unbekannter Fehler' });
        }
        
        // Add a small delay between API calls to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Report results
      if (successfulEntries.length > 0) {
        toast.success(`${successfulEntries.length} Gedichte wurden erfolgreich erstellt.`);
      }
      
      if (failedEntries.length > 0) {
        console.error('Failed entries:', failedEntries);
        toast.error(`${failedEntries.length} Gedichte konnten nicht erstellt werden.`, {
          description: "Bitte versuchen Sie es später erneut oder reduzieren Sie die Anzahl der gleichzeitigen Anfragen."
        });
      }
      
      // Reset form entries but keep the style settings if at least one poem was successful
      if (successfulEntries.length > 0) {
        setMassUploadData(prev => ({
          ...prev,
          poemEntries: initialPoemEntries
        }));
      }
      
      // Trigger callback to refresh poem list
      onCompletion();
    } catch (error) {
      console.error('Error generating mass upload poems:', error);
      toast.error('Fehler beim Erstellen der Gedichte. Bitte versuchen Sie es später erneut.', {
        description: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });
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
