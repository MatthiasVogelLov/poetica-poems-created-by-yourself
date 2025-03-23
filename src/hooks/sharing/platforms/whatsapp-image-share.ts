
import { toast } from "sonner";
import { trackShareUsage } from "../share-utils";

interface ShareImageProps {
  blob: Blob;
  title: string;
}

export async function shareImageToWhatsApp({ blob, title }: ShareImageProps): Promise<void> {
  const imageUrl = URL.createObjectURL(blob);
  
  // Track feature usage
  await trackShareUsage('whatsapp', 'image');
  
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
}
