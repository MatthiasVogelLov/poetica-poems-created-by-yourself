
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePoemSharing } from '@/hooks/sharing';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SinglePoemViewProps {
  poem: any;
  goBack: () => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
}

const SinglePoemView: React.FC<SinglePoemViewProps> = ({
  poem,
  goBack,
  getOccasionDisplay,
  getContentTypeDisplay
}) => {
  const isMobile = useIsMobile();
  const { handleTextShare, handleImageShare, isCapturingImage } = usePoemSharing({
    poem: poem?.content || '',
    title: poem?.title || 'Gedicht',
    onCompleted: () => {}
  });

  if (!poem) {
    return <div className="text-center py-8">Gedicht nicht gefunden</div>;
  }

  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        onClick={goBack}
      >
        <ArrowLeft size={16} />
        <span>Zurück</span>
      </Button>
      
      <div className="max-w-xl mx-auto">
        <div className="poem-container rounded-lg p-6 border shadow-sm">
          <h1 className="text-2xl font-serif text-center mb-6 text-gray-800">{poem.title}</h1>
          
          <div className="whitespace-pre-wrap text-center font-serif text-lg leading-relaxed">
            {poem.content}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500 justify-center">
            {poem.occasion && (
              <span className="bg-gray-100 rounded-full px-3 py-1">
                {getOccasionDisplay(poem.occasion)}
              </span>
            )}
            {poem.content_type && (
              <span className="bg-gray-100 rounded-full px-3 py-1">
                {getContentTypeDisplay(poem.content_type)}
              </span>
            )}
          </div>
        </div>
        
        {/* Sharing Features */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">Teilen Sie dieses Gedicht</h3>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleTextShare('whatsapp')}
              disabled={isCapturingImage}
            >
              <span className={isMobile ? "text-xs" : ""}>WhatsApp</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleTextShare('email')}
              disabled={isCapturingImage}
            >
              <span className={isMobile ? "text-xs" : ""}>E-Mail</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleImageShare('download')}
              disabled={isCapturingImage}
            >
              <span className={isMobile ? "text-xs" : ""}>Als Bild</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleImageShare('whatsapp')}
              disabled={isCapturingImage}
            >
              <span className={isMobile ? "text-xs" : ""}>Bild per WhatsApp</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>Erstellt mit Poetica - www.poetica.apvora.com</p>
        </div>
      </div>
    </div>
  );
};

export default SinglePoemView;
