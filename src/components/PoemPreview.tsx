
import React, { useEffect, useState } from 'react';
import BlurredContent from './BlurredContent';
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
import { Card, CardContent } from '@/components/ui/card';

interface PoemPreviewProps {
  title: string;
  poem: string;
  isPaid?: boolean;
}

const PoemPreview = ({
  title,
  poem,
  isPaid = false
}: PoemPreviewProps) => {
  const lines = poem.split('\n');
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  // For preview, show only first 10 lines if not paid
  const visibleLines = isPaid ? lines : lines.slice(0, Math.min(10, lines.length));
  const hiddenLines = isPaid ? [] : lines.slice(Math.min(10, lines.length));

  // Add print styles when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .poem-container, .poem-container * {
          visibility: visible;
        }
        .poem-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 2rem;
          text-align: center;
        }
        .print-actions, .print-actions * {
          display: none !important;
        }
        .print-footer {
          visibility: visible;
          position: fixed;
          bottom: 20px;
          width: 100%;
          text-align: center;
          font-family: serif;
          font-size: 12pt;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const printStyles = document.getElementById('print-styles');
      if (printStyles) {
        printStyles.remove();
      }
    };
  }, []);

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
    <Card className="w-full max-w-2xl mx-auto rounded-xl shadow-md overflow-hidden animate-fade-in poem-container transition-all hover:shadow-lg">
      <CardContent className="p-6 sm:p-8">
        {/* Title with decorative elements */}
        <div className="relative mb-6 text-center">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200" aria-hidden="true"></div>
          <h2 className="relative inline-block px-4 bg-white text-xl sm:text-2xl font-serif text-center z-10">
            {title}
          </h2>
        </div>
        
        {isPaid ? (
          <>
            <div className="poem-text mb-8 whitespace-pre-line text-center text-base sm:text-lg bg-gray-50 p-6 rounded-lg border border-gray-100">
              {poem}
            </div>
            
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
          </>
        ) : (
          <>
            <div className="poem-text whitespace-pre-line mb-2 text-center text-base sm:text-lg bg-gray-50 p-4 rounded-lg border border-gray-100">
              {visibleLines.join('\n')}
            </div>
            {hiddenLines.length > 0 && (
              <BlurredContent>
                <div className="poem-text whitespace-pre-line text-center text-base sm:text-lg">
                  {hiddenLines.join('\n')}
                </div>
              </BlurredContent>
            )}
          </>
        )}
        
        {/* Print footer - only visible when printing */}
        <div className="print-footer">
          
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemPreview;
