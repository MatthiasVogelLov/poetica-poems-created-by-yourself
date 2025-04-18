
import { toast } from "sonner";
import { trackShareUsage } from "./share-utils";

interface UseTextSharingProps {
  poem: string;
  title: string;
  onCompleted?: () => void;
}

export function useTextSharing({ poem, title, onCompleted }: UseTextSharingProps) {
  const handleTextShare = async (platform: string) => {
    const poemText = `${title}\n\n${poem}\n\nErstellt mit poetica.apvora.com`;
    let shareUrl = '';
    
    // Track feature usage
    await trackShareUsage(platform, 'text');
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://poetica.apvora.com&quote=${encodeURIComponent(poemText)}`;
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
        toast.info('TikTok unterstützt kein direktes Teilen von Text. Bitte erstellen Sie ein Video in der TikTok-App und lesen Sie Ihr Gedicht vor.', {
          duration: 5000,
          description: "Sie können einen Screenshot machen und dann in TikTok als Hintergrund verwenden."
        });
        onCompleted?.();
        return;
        
      case 'instagram':
        toast.info('Instagram unterstützt kein direktes Teilen. Bitte machen Sie einen Screenshot und teilen Sie ihn über die Instagram-App.', {
          duration: 5000,
          description: "Tippen Sie auf den Bildschirm und halten Sie gedrückt, um einen Screenshot zu machen."
        });
        onCompleted?.();
        return;
        
      case 'copy':
        try {
          // Use modern clipboard API
          await navigator.clipboard.writeText(poemText);
          toast.success('Gedicht in die Zwischenablage kopiert');
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
              toast.success('Gedicht in die Zwischenablage kopiert');
            } else {
              toast.error('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
            }
          } catch (err) {
            toast.error('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
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
