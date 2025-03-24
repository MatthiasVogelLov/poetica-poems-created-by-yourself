
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import { getRandomOption } from './batch-creation/poemUtils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PoemPreviewDialogProps {
  poemId: string | null;
  onClose: () => void;
  onPublish: (id: string) => void;
}

const PoemPreviewDialog: React.FC<PoemPreviewDialogProps> = ({ 
  poemId, 
  onClose,
  onPublish
}) => {
  const [poem, setPoem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

  // Generate a new poem with the same parameters
  const handleRegeneratePoem = async () => {
    if (!poem) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would call an API that generates the poem
      // For now, we'll simulate updating the same poem
      const audience = getRandomOption('audience');
      const occasion = getRandomOption('occasion');
      const contentType = getRandomOption('contentType');
      const style = getRandomOption('style');
      const verseType = getRandomOption('verseType');
      const length = getRandomOption('length');
      
      const { data, error } = await supabase
        .from('user_poems')
        .update({
          content: `Dies ist ein neu generiertes Gedicht.\nAnlass: ${occasion}\nThema: ${contentType}\nStil: ${style}`,
          occasion: occasion,
          content_type: contentType,
          style: style,
          verse_type: verseType,
          length: length
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
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!poem || publishing) return;
    
    setPublishing(true);
    try {
      onPublish(poem.id);
      toast.success('Gedicht wurde veröffentlicht');
      onClose();
    } catch (error) {
      console.error('Error publishing poem:', error);
      toast.error('Fehler beim Veröffentlichen des Gedichts');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={!!poemId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{poem?.title || 'Gedicht Vorschau'}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <div className="poem-container rounded-lg p-6 border shadow-sm mt-4">
              <h2 className="text-xl font-serif text-center mb-6">{poem?.title}</h2>
              
              <div className="whitespace-pre-wrap text-center font-serif leading-relaxed">
                {poem?.content}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500 justify-center">
                {poem?.occasion && (
                  <span className="bg-gray-100 rounded-full px-3 py-1">
                    {poem.occasion}
                  </span>
                )}
                {poem?.content_type && (
                  <span className="bg-gray-100 rounded-full px-3 py-1">
                    {poem.content_type}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleRegeneratePoem}
                disabled={loading}
              >
                Neu generieren
              </Button>
              
              {poem?.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  In PoemsLand veröffentlichen
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PoemPreviewDialog;
