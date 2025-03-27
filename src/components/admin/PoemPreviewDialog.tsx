
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

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
          keywords: ''
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

  const handlePublish = async () => {
    if (!poem || publishing) return;
    
    setPublishing(true);
    try {
      onPublish(poem.id);
      // Close the dialog after publishing
      onClose();
    } catch (error) {
      console.error('Error publishing poem:', error);
      toast.error('Fehler beim Veröffentlichen des Gedichts');
      setPublishing(false);
    }
  };

  return (
    <Dialog open={!!poemId} onOpenChange={(open) => {
      if (!open) {
        // Reset publishing state when dialog is closed
        setPublishing(false);
        onClose();
      }
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{poem?.title || 'Gedicht Vorschau'}</DialogTitle>
          <DialogDescription>
            Hier sehen Sie die vollständige Vorschau des Gedichts, wie es in PoemsLand erscheinen wird.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow my-4 h-[50vh]">
              <div className="poem-container rounded-lg p-6 border shadow-sm">
                <h2 className="text-xl font-serif text-center mb-6">{poem?.title}</h2>
                
                <div className="whitespace-pre-wrap text-center font-serif leading-relaxed">
                  {poem?.content}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6 text-sm text-gray-500 justify-center">
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
                  {poem?.style && (
                    <span className="bg-gray-100 rounded-full px-3 py-1">
                      {poem.style}
                    </span>
                  )}
                </div>
                
                {poem?.keywords && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    <p className="font-medium">Schlüsselwörter:</p>
                    <p>{poem.keywords}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleRegeneratePoem}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird generiert...
                  </>
                ) : (
                  'Neu generieren'
                )}
              </Button>
              
              {poem?.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird veröffentlicht...
                    </>
                  ) : (
                    'In PoemsLand veröffentlichen'
                  )}
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
