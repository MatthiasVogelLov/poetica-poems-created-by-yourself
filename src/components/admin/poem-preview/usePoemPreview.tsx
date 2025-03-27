
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePoemPreview = (poemId: string | null) => {
  const [poem, setPoem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Reset states when dialog opens with a new poem ID
  useEffect(() => {
    if (poemId) {
      setPublishing(false);
      setGenerating(false);
    }
  }, [poemId]);

  // Fetch the poem when the dialog opens
  useEffect(() => {
    const fetchPoem = async () => {
      if (!poemId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .eq('id', poemId)
          .single();
          
        if (error) throw error;
        setPoem(data);
      } catch (error) {
        console.error('Error fetching poem:', error);
        toast.error('Fehler beim Laden des Gedichts');
      } finally {
        setLoading(false);
      }
    };

    fetchPoem();
  }, [poemId]);

  // Generate a new poem via OpenAI API
  const handleRegeneratePoem = async () => {
    if (!poem || generating) return;
    
    setGenerating(true);
    try {
      // Call the generate-poem edge function to create a new poem
      const { data: generationResult, error: generationError } = await supabase.functions.invoke('generate-poem', {
        body: {
          audience: poem.audience || 'erwachsene',
          occasion: poem.occasion || 'geburtstag',
          contentType: poem.content_type || 'liebe',
          style: poem.style || 'klassisch',
          verseType: poem.verse_type || 'kreuzreim',
          length: poem.length || 'mittel',
          keywords: poem.keywords || ''
        }
      });
      
      if (generationError) throw generationError;
      
      // Update the poem in the database
      const { data, error } = await supabase
        .from('user_poems')
        .update({
          content: generationResult.poem,
          title: generationResult.title || poem.title
        })
        .eq('id', poemId)
        .select('*')
        .single();
        
      if (error) throw error;
      setPoem(data);
      toast.success('Gedicht wurde neu generiert');
    } catch (error) {
      console.error('Error regenerating poem:', error);
      toast.error('Fehler bei der Neuererstellung des Gedichts');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!poem || publishing) return;
    setPublishing(true);
  };

  return {
    poem,
    loading,
    generating,
    publishing,
    setPublishing,
    handleRegeneratePoem,
    handlePublish
  };
};
