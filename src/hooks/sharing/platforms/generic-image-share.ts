
import { toast } from "sonner";
import { trackShareUsage } from "../share-utils";

interface ShareImageProps {
  blob: Blob;
  platform: string;
}

export async function shareImageGeneric({ blob, platform }: ShareImageProps): Promise<void> {
  // Track feature usage
  await trackShareUsage(platform, 'image');
  
  // General purpose image download for any platform
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
