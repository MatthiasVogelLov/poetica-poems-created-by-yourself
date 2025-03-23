
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";

interface ImageShareProps {
  poem: string;
  title: string;
  onOpenChange: (open: boolean) => void;
  setIsCapturingImage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useImageShare = ({
  poem,
  title,
  onOpenChange,
  setIsCapturingImage
}: ImageShareProps) => {
  const trackImageShareUsage = async (platform: string) => {
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
        await trackImageShareUsage(platform);
        
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

  return { handleImageShare };
};
