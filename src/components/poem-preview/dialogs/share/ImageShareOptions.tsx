
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { useImageShare } from './hooks/useImageShare';
import { ShareIcons } from './icons/ShareIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageShareOptionsProps {
  poem: string;
  title: string;
  onOpenChange: (open: boolean) => void;
}

const ImageShareOptions: React.FC<ImageShareOptionsProps> = ({ 
  poem, 
  title, 
  onOpenChange 
}) => {
  const [isCapturingImage, setIsCapturingImage] = useState(false);
  const { handleImageShare } = useImageShare({ 
    poem, 
    title, 
    onOpenChange, 
    setIsCapturingImage 
  });
  const isMobile = useIsMobile();
  const { WhatsAppIcon } = ShareIcons;

  return (
    <>
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
    </>
  );
};

export default ImageShareOptions;
