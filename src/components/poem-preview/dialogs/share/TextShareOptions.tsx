
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Copy } from 'lucide-react';
import { ShareIcons } from './icons/ShareIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePoemSharing } from '@/hooks/use-poem-sharing';

interface TextShareOptionsProps {
  poem: string;
  title: string;
  onOpenChange: (open: boolean) => void;
}

const TextShareOptions: React.FC<TextShareOptionsProps> = ({ 
  poem, 
  title, 
  onOpenChange 
}) => {
  const { handleTextShare } = usePoemSharing({ 
    poem, 
    title, 
    onCompleted: () => onOpenChange(false) 
  });
  
  const isMobile = useIsMobile();
  const { WhatsAppIcon, TikTokIcon } = ShareIcons;
  
  return (
    <div className="flex justify-center gap-4 py-6 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('facebook')}
      >
        <Facebook className="h-6 w-6 text-blue-600" />
        <span className="sr-only">Auf Facebook teilen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('twitter')}
      >
        <Twitter className="h-6 w-6 text-sky-500" />
        <span className="sr-only">Auf Twitter teilen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('whatsapp')}
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="sr-only">Auf WhatsApp teilen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('tiktok')}
      >
        <TikTokIcon className="h-6 w-6 text-black" />
        <span className="sr-only">Auf TikTok teilen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('instagram')}
      >
        <Instagram className="h-6 w-6 text-pink-600" />
        <span className="sr-only">Auf Instagram teilen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12"
        onClick={() => handleTextShare('copy')}
      >
        <Copy className="h-6 w-6" />
        <span className="sr-only">Kopieren</span>
      </Button>
    </div>
  );
};

export default TextShareOptions;
