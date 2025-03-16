
import React, { useEffect } from 'react';
import BlurredContent from './BlurredContent';
import { Printer, Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
    alert('Diese Funktion wird in Kürze verfügbar sein.');
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
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-8 animate-fade-in poem-container">
      {/* Increased top margin of the title to ensure it's fully visible */}
      <h2 className="text-xl sm:text-2xl font-serif mt-2 mb-4 sm:mb-6 text-center">{title}</h2>
      
      {isPaid ? (
        <>
          <div className="poem-text mb-6 sm:mb-10 whitespace-pre-line text-center text-base sm:text-lg">
            {poem}
          </div>
          
          <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6 print-actions">
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
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
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Reduced bottom margin of visible poem text to bring sections closer */}
          <div className="poem-text whitespace-pre-line mb-2 text-center text-base sm:text-lg">
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
    </div>
  );
};

export default PoemPreview;
