
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PoemContent from './poem-preview/PoemContent';
import PoemDialogActions from './poem-preview/PoemDialogActions';
import { usePoemPreview } from './poem-preview/usePoemPreview';

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
  const {
    poem,
    loading,
    generating,
    publishing,
    setPublishing,
    handleRegeneratePoem,
    handlePublish
  } = usePoemPreview(poemId);

  const handlePublishClick = () => {
    handlePublish();
    if (poem) {
      onPublish(poem.id);
      // Close the dialog after publishing
      onClose();
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
              <PoemContent poem={poem} />
            </ScrollArea>
            
            <PoemDialogActions 
              poem={poem}
              generating={generating}
              publishing={publishing}
              onRegeneratePoem={handleRegeneratePoem}
              onPublish={handlePublishClick}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PoemPreviewDialog;
