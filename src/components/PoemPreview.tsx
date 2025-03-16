
import React from 'react';
import BlurredContent from './BlurredContent';
import { Printer, Send, Download } from 'lucide-react';

interface PoemPreviewProps {
  title: string;
  poem: string;
  isPaid?: boolean;
}

const PoemPreview = ({ title, poem, isPaid = false }: PoemPreviewProps) => {
  const lines = poem.split('\n');
  
  // For preview, show only first 10 lines if not paid
  const visibleLines = isPaid ? lines : lines.slice(0, Math.min(10, lines.length));
  const hiddenLines = isPaid ? [] : lines.slice(Math.min(10, lines.length));
  
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
    const file = new Blob([`${title}\n\n${poem}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 animate-fade-in">
      <h2 className="text-2xl font-serif mb-6 text-center">{title}</h2>
      
      {isPaid ? (
        <>
          <div className="poem-text mb-10 whitespace-pre-line">
            {poem}
          </div>
          
          <div className="border-t pt-6 mt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleEmailSend}
                className="btn-secondary flex items-center gap-2"
              >
                <Send size={16} />
                <span>Per E-Mail senden</span>
              </button>
              <button 
                onClick={handlePrint}
                className="btn-secondary flex items-center gap-2"
              >
                <Printer size={16} />
                <span>Drucken</span>
              </button>
              <button 
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2"
              >
                <Download size={16} />
                <span>Herunterladen</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="poem-text whitespace-pre-line mb-4">
            {visibleLines.join('\n')}
          </div>
          {hiddenLines.length > 0 && (
            <BlurredContent>
              <div className="poem-text whitespace-pre-line">
                {hiddenLines.join('\n')}
              </div>
            </BlurredContent>
          )}
        </>
      )}
    </div>
  );
};

export default PoemPreview;
