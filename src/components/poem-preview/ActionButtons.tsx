
import React, { useState } from 'react';
import { 
  Printer, 
  Send, 
  Download, 
  Copy, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ActionButtonsProps {
  poem: string;
  title: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ poem, title }) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSend = () => {
    // In a real implementation, this would open a modal to enter email
    toast.info('Diese Funktion wird in Kürze verfügbar sein.');
  };

  const handleDownload = () => {
    // Create a text file with the poem content
    const element = document.createElement('a');
    const file = new Blob([`${title}\n\n${poem}`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Gedicht wurde heruntergeladen');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${title}\n\n${poem}`);
    setCopied(true);
    toast.success('In die Zwischenablage kopiert');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Schau dir dieses Gedicht an: ${title}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Schau dir dieses Gedicht an: ${title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Personalisiertes Gedicht');
    const summary = encodeURIComponent(`Schau dir dieses Gedicht an: ${title}`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  return (
    <div className="border-t pt-6 mt-6 print-actions">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <Button
          onClick={handleCopyToClipboard}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          {copied ? <Check size={isMobile ? 14 : 16} /> : <Copy size={isMobile ? 14 : 16} />}
          <span className={isMobile ? "text-xs" : ""}>Kopieren</span>
        </Button>
        <Button
          onClick={handleEmailSend}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Send size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>E-Mail senden</span>
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Printer size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>Drucken</span>
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Download size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>Herunterladen</span>
        </Button>
        
        {/* Social Media Sharing Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-1 sm:gap-2"
            >
              <Share2 size={isMobile ? 14 : 16} />
              <span className={isMobile ? "text-xs" : ""}>Teilen</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
              <Facebook size={16} className="mr-2" />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
              <Twitter size={16} className="mr-2" />
              <span>Twitter</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer">
              <Linkedin size={16} className="mr-2" />
              <span>LinkedIn</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ActionButtons;
