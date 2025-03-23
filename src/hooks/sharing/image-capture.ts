
import html2canvas from 'html2canvas';
import { toast } from "sonner";

export async function capturePoemAsImage(): Promise<Blob | null> {
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
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Fehler beim Erstellen des Bildes');
          resolve(null);
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error capturing image:', error);
    toast.error('Fehler beim Erstellen des Bildes');
    return null;
  }
}
