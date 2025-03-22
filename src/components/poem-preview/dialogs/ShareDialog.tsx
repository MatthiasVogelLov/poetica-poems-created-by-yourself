
import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Share2, MessageSquare, Copy, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";
import html2canvas from 'html2canvas';

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
  const [isCapturingImage, setIsCapturingImage] = useState(false);

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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(poemText)}`;
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

  const handleImageShare = async (platform: string) => {
    setIsCapturingImage(true);
    
    try {
      // Find the poem container
      const poemElement = document.querySelector('.poem-container');
      
      if (!poemElement) {
        throw new Error('Gedicht-Element nicht gefunden');
      }
      
      // Capture the poem as an image
      const canvas = await html2canvas(poemElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Fehler beim Erstellen des Bildes');
          setIsCapturingImage(false);
          return;
        }
        
        // Track feature usage
        try {
          await supabase.functions.invoke('track-stats', {
            body: {
              action: 'feature_used',
              data: {
                featureName: `share_image_${platform}`
              }
            }
          });
        } catch (error) {
          console.error('Error tracking image share feature usage:', error);
        }
        
        // Handle different platforms
        if (platform === 'whatsapp') {
          // For WhatsApp, we need to first save the image, then share it
          try {
            const imageUrl = URL.createObjectURL(blob);
            
            // Check if Web Share API is available
            if (navigator.share) {
              const file = new File([blob], 'poetica-gedicht.png', { type: 'image/png' });
              
              await navigator.share({
                files: [file],
                title: title,
                text: 'Mein Gedicht von Poetica'
              });
              
              toast.success('Bild zum Teilen bereitgestellt');
            } else {
              // Fallback for browsers without Web Share API
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'poetica-gedicht.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast.success('Bild heruntergeladen für WhatsApp', {
                description: 'Sie können das Bild jetzt in WhatsApp teilen'
              });
            }
          } catch (error) {
            console.error('Error sharing image:', error);
            toast.error('Fehler beim Teilen des Bildes');
          }
        } else {
          // For other platforms or copy
          const imageUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = 'poetica-gedicht.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success('Bild heruntergeladen', {
            description: 'Sie können das Bild jetzt in Ihren Apps teilen'
          });
        }
        
        onOpenChange(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Fehler beim Erstellen des Bildes');
    } finally {
      setIsCapturingImage(false);
    }
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

  // WhatsApp icon
  const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
        fill="#25D366"
      />
    </svg>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gedicht teilen</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Plattform und Art, um Ihr Gedicht zu teilen.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Als Text</TabsTrigger>
            <TabsTrigger value="image">Als Bild</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
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
                onClick={() => handleShare('whatsapp')}
              >
                <WhatsAppIcon className="h-6 w-6" />
                <span className="sr-only">Auf WhatsApp teilen</span>
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
                <Copy className="h-6 w-6" />
                <span className="sr-only">Kopieren</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <div className="flex justify-center gap-4 py-6 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={() => handleImageShare('whatsapp')}
                disabled={isCapturingImage}
              >
                {isCapturingImage ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <WhatsAppIcon className="h-6 w-6" />
                )}
                <span className="sr-only">Bild auf WhatsApp teilen</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={() => handleImageShare('download')}
                disabled={isCapturingImage}
              >
                {isCapturingImage ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-600" />
                )}
                <span className="sr-only">Bild herunterladen</span>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              Das Gedicht wird als Bild gespeichert, das Sie teilen können.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
