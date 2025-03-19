
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
import { supabase } from "@/integrations/supabase/client";

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
  const handleShare = async (platform: string) => {
    const poemText = `${title}\n\n${poem}\n\nErstellt mit poetica.advora.com`;
    let shareUrl = '';
    
    // Track feature usage
    try {
      await supabase.functions.invoke('track-stats', {
        body: {
          action: 'feature_used',
          data: {
            featureName: `share_${platform}`
          }
        }
      });
    } catch (error) {
      console.error('Error tracking share feature usage:', error);
    }
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://poetica.advora.com&quote=${encodeURIComponent(poemText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poemText)}`;
        break;
      case 'tiktok':
        toast.info('TikTok unterstützt kein direktes Teilen von Text. Bitte erstellen Sie ein Video in der TikTok-App und lesen Sie Ihr Gedicht vor.', {
          duration: 5000,
          description: "Sie können einen Screenshot machen und dann in TikTok als Hintergrund verwenden."
        });
        onOpenChange(false);
        return;
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

  // Custom TikTok icon as inline SVG component
  const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.9 2.9 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.83a6.34 6.34 0 0 0 10.86-4.43v-6.9A8.16 8.16 0 0 0 22 9.49v-3a4.85 4.85 0 0 1-2.41.2Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gedicht teilen</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Plattform, um Ihr Gedicht zu teilen.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 py-6 flex-wrap">
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
            onClick={() => handleShare('tiktok')}
          >
            <TikTokIcon className="h-6 w-6 text-black" />
            <span className="sr-only">Auf TikTok teilen</span>
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
