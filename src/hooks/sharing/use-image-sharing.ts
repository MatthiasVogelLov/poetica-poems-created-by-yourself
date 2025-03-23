
import { useState } from 'react';
import { toast } from "sonner";
import { capturePoemAsImage } from './image-capture';
import { shareImageToWhatsApp } from './platforms/whatsapp-image-share';
import { shareImageGeneric } from './platforms/generic-image-share';

interface UseImageSharingProps {
  poem: string;
  title: string;
  onCompleted?: () => void;
}

export function useImageSharing({ poem, title, onCompleted }: UseImageSharingProps) {
  const [isCapturingImage, setIsCapturingImage] = useState(false);

  const handleImageShare = async (platform: string) => {
    setIsCapturingImage(true);
    
    try {
      // Capture the poem as an image
      const blob = await capturePoemAsImage();
      
      if (!blob) {
        setIsCapturingImage(false);
        return;
      }
      
      // Handle different platforms
      if (platform === 'whatsapp') {
        await shareImageToWhatsApp({ blob, title });
      } else {
        // For other platforms or direct download
        await shareImageGeneric({ blob, platform });
      }
      
      onCompleted?.();
    } catch (error) {
      console.error('Error sharing image:', error);
      toast.error('Fehler beim Teilen des Bildes');
    } finally {
      setIsCapturingImage(false);
    }
  };

  return {
    isCapturingImage,
    handleImageShare
  };
}
