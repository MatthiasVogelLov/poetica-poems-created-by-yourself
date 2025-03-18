
import React from 'react';
import { Facebook, Instagram, Twitter, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface ShareDialogProps {
  poem: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  poem,
  title,
  open,
  onOpenChange
}) => {
  const handleShare = (platform: string) => {
    const poemText = `${title}\n\n${poem}\n\nErstellt mit poetica.advora.com`;
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://poetica.advora.com&quote=${encodeURIComponent(poemText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poemText)}`;
        break;
      case 'instagram':
        toast.info('Instagram unterstützt kein direktes Teilen. Bitte machen Sie einen Screenshot und teilen Sie ihn über die Instagram-App.', {
          duration: 5000,
          description: "Tippen Sie auf den Bildschirm und halten Sie gedrückt, um einen Screenshot zu machen."
        });
        onOpenChange(false);
        return;
      default:
        navigator.clipboard.writeText(poemText)
          .then(() => toast.success('Gedicht in die Zwischenablage kopiert'))
          .catch(() => toast.error('Fehler beim Kopieren'));
        onOpenChange(false);
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gedicht teilen</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Plattform, um Ihr Gedicht zu teilen.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 py-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-6 w-6 text-blue-600" />
            <span className="sr-only">Auf Facebook teilen</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-6 w-6 text-sky-500" />
            <span className="sr-only">Auf Twitter teilen</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-6 w-6 text-pink-600" />
            <span className="sr-only">Auf Instagram teilen</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => handleShare('copy')}
          >
            <Share2 className="h-6 w-6" />
            <span className="sr-only">Kopieren</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
