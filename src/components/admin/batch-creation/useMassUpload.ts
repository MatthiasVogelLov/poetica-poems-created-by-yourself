
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
    poemEntries: initialPoemEntries
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
      const generatePromises = validEntries.map(async (entry) => {
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

        // Call the generate-poem edge function
        const { data, error } = await supabase.functions.invoke('generate-poem', {
          body: {
            ...poemOptions,
            title: entry.title,
            keywords: entry.keywords
          }
        });

        if (error) throw error;
        
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
            status: 'draft',
            keywords: entry.keywords,
            length: poemOptions.length,
            batch_created: true
          });

        if (saveError) throw saveError;
        
        return data;
      });

      await Promise.all(generatePromises);
      
      toast.success(`${validEntries.length} Gedichte wurden erfolgreich erstellt.`);
      
      // Reset form entries but keep the style settings
      setMassUploadData(prev => ({
        ...prev,
        poemEntries: initialPoemEntries
      }));
      
      // Trigger callback to refresh poem list
      onCompletion();
    } catch (error) {
      console.error('Error generating mass upload poems:', error);
      toast.error('Fehler beim Erstellen der Gedichte. Bitte versuchen Sie es später erneut.');
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
    handlePoemEntryChange,
    generateMassUploadPoems
  };
};
