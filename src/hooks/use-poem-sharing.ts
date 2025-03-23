
import { useState } from 'react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";

interface UsePoemSharingProps {
  poem: string;
  title: string;
  onCompleted?: () => void;
}

export function usePoemSharing({ poem, title, onCompleted }: UsePoemSharingProps) {
  const [isCapturingImage, setIsCapturingImage] = useState(false);

  // Track feature usage in Supabase
  const trackShareUsage = async (platform: string, type: 'text' | 'image') => {
    try {
      await supabase.functions.invoke('track-stats', {
        body: {
          action: 'feature_used',
          data: {
            featureName: `share_${type === 'image' ? 'image_' : ''}${platform}`
          }
        }
      });
    } catch (error) {
      console.error(`Error tracking ${type} share feature usage:`, error);
    }
  };

  // Handle text sharing
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

  // Handle image sharing
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
        await trackShareUsage(platform, 'image');
        
        // Handle different platforms
        if (platform === 'whatsapp') {
          try {
            const imageUrl = URL.createObjectURL(blob);
            
            // Special handling for mobile WhatsApp
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              // Check if Web Share API is available for modern mobile browsers
              if (navigator.share) {
                try {
                  const file = new File([blob], 'poetica-gedicht.png', { type: 'image/png' });
                  await navigator.share({
                    files: [file],
                    title: title,
                    text: 'Mein Gedicht von Poetica'
                  });
                  toast.success('Bild zum Teilen bereitgestellt');
                } catch (err) {
                  console.error('Error with Web Share API:', err);
                  // Fallback to direct WhatsApp link if Web Share API fails
                  const link = document.createElement('a');
                  link.href = `whatsapp://send?text=Mein Gedicht von Poetica`;
                  link.click();
                  
                  // Also download the image so they can share it manually
                  const download = document.createElement('a');
                  download.href = imageUrl;
                  download.download = 'poetica-gedicht.png';
                  download.click();
                }
              } else {
                // Direct WhatsApp link for older mobile browsers
                const link = document.createElement('a');
                link.href = `whatsapp://send?text=Mein Gedicht von Poetica`;
                link.click();
                
                // Also download the image
                const download = document.createElement('a');
                download.href = imageUrl;
                download.download = 'poetica-gedicht.png';
                download.click();
              }
            } else {
              // Desktop fallback - download image and open web WhatsApp
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'poetica-gedicht.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              window.open('https://web.whatsapp.com/', '_blank');
              
              toast.success('Bild heruntergeladen für WhatsApp', {
                description: 'Sie können das Bild jetzt in WhatsApp teilen'
              });
            }
          } catch (error) {
            console.error('Error sharing image to WhatsApp:', error);
            toast.error('Fehler beim Teilen des Bildes');
          }
        } else {
          // For other platforms or direct download
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
        
        onCompleted?.();
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Fehler beim Erstellen des Bildes');
    } finally {
      setIsCapturingImage(false);
    }
  };

  return {
    isCapturingImage,
    handleTextShare,
    handleImageShare
  };
}
