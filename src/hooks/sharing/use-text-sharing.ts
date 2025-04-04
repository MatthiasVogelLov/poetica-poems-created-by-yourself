
import { toast } from "sonner";
import { trackShareUsage } from "./share-utils";
import { useTranslations } from "@/hooks/use-translations";

interface UseTextSharingProps {
  poem: string;
  title: string;
  onCompleted?: () => void;
}

export function useTextSharing({ poem, title, onCompleted }: UseTextSharingProps) {
  const { language } = useTranslations();
  
  const handleTextShare = async (platform: string) => {
    const websiteUrl = language === 'en' ? 'poetica.apvora.com/en' : 'poetica.apvora.com';
    const poemText = `${title}\n\n${poem}\n\n${language === 'en' ? 'Created with' : 'Erstellt mit'} ${websiteUrl}`;
    let shareUrl = '';
    
    // Track feature usage
    await trackShareUsage(platform, 'text');
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://${websiteUrl}&quote=${encodeURIComponent(poemText)}`;
        break;
        
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poemText)}`;
        break;
        
      case 'whatsapp':
        // Mobile WhatsApp sharing - works better on mobile with direct link
        shareUrl = `whatsapp://send?text=${encodeURIComponent(poemText)}`;
        
        // Fallback for desktop
        if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(poemText)}`;
        }
        break;
        
      case 'tiktok':
        const tiktokMessage = language === 'en'
          ? 'TikTok does not support direct text sharing. Please create a video in the TikTok app and read your poem aloud.'
          : 'TikTok unterstützt kein direktes Teilen von Text. Bitte erstellen Sie ein Video in der TikTok-App und lesen Sie Ihr Gedicht vor.';
        
        const tiktokDescription = language === 'en'
          ? 'You can take a screenshot and use it as background in TikTok.'
          : 'Sie können einen Screenshot machen und dann in TikTok als Hintergrund verwenden.';
          
        toast.info(tiktokMessage, {
          duration: 5000,
          description: tiktokDescription
        });
        onCompleted?.();
        return;
        
      case 'instagram':
        const instagramMessage = language === 'en'
          ? 'Instagram does not support direct sharing. Please take a screenshot and share it through the Instagram app.'
          : 'Instagram unterstützt kein direktes Teilen. Bitte machen Sie einen Screenshot und teilen Sie ihn über die Instagram-App.';
        
        const instagramDescription = language === 'en'
          ? 'Tap and hold on the screen to take a screenshot.'
          : 'Tippen Sie auf den Bildschirm und halten Sie gedrückt, um einen Screenshot zu machen.';
          
        toast.info(instagramMessage, {
          duration: 5000,
          description: instagramDescription
        });
        onCompleted?.();
        return;
        
      case 'copy':
        try {
          // Use modern clipboard API
          await navigator.clipboard.writeText(poemText);
          toast.success(language === 'en' ? 'Poem copied to clipboard' : 'Gedicht in die Zwischenablage kopiert');
        } catch (err) {
          console.error('Clipboard error:', err);
          
          // Fallback method for older browsers or if permission denied
          const textArea = document.createElement('textarea');
          textArea.value = poemText;
          textArea.style.position = 'fixed';  // Prevent scrolling to bottom
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            const successful = document.execCommand('copy');
            if (successful) {
              toast.success(language === 'en' ? 'Poem copied to clipboard' : 'Gedicht in die Zwischenablage kopiert');
            } else {
              toast.error(language === 'en' ? 'Copy failed. Please copy manually.' : 'Kopieren fehlgeschlagen. Bitte manuell kopieren.');
            }
          } catch (err) {
            toast.error(language === 'en' ? 'Copy failed. Please copy manually.' : 'Kopieren fehlgeschlagen. Bitte manuell kopieren.');
          }
          
          document.body.removeChild(textArea);
        }
        onCompleted?.();
        return;
        
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onCompleted?.();
  };

  return { handleTextShare };
}
