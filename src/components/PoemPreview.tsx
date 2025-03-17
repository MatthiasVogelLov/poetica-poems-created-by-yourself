
import React from 'react';
import BlurredContent from './BlurredContent';
import { Card, CardContent } from '@/components/ui/card';
import PoemTitle from './poem-preview/PoemTitle';
import PoemContent from './poem-preview/PoemContent';
import ActionButtons from './poem-preview/ActionButtons';
import { usePrintStyles } from '@/hooks/use-print-styles';

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
  
  // For preview, show only first 10 lines if not paid
  const visibleLines = isPaid ? lines : lines.slice(0, Math.min(10, lines.length));
  const hiddenLines = isPaid ? [] : lines.slice(Math.min(10, lines.length));

  // Add print styles when component mounts
  usePrintStyles();

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-xl shadow-md overflow-hidden animate-fade-in poem-container transition-all hover:shadow-lg">
      <CardContent className="p-6 sm:p-8">
        {/* Print header - only visible when printing */}
        <div className="print-header">
          <div className="font-serif text-xl font-medium">Poetica</div>
        </div>
        
        <PoemTitle title={title} />
        
        {isPaid ? (
          <>
            <PoemContent poem={poem} />
            <ActionButtons poem={poem} title={title} />
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
        
        {/* Removed print footer with "Created with poetica.advora.com" */}
      </CardContent>
    </Card>
  );
};

export default PoemPreview;
