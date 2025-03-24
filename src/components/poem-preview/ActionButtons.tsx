
import React, { useState } from 'react';
import { Printer, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import EmailDialog from './dialogs/EmailDialog';
import ShareDialog from './dialogs/share';
import { toast } from 'sonner';

interface ActionButtonsProps {
  poem: string;
  title: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ poem, title }) => {
  const isMobile = useIsMobile();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="border-t pt-6 mt-6 print-actions">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <Button
          onClick={() => setEmailDialogOpen(true)}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Send size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>E-Mail senden</span>
        </Button>
        
        {/* Hide print button on mobile */}
        {!isMobile && (
          <Button
            onClick={handlePrint}
            variant="outline"
            size="default"
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Drucken</span>
          </Button>
        )}
        
        <Button
          onClick={() => setShareDialogOpen(true)}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Share2 size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>Teilen</span>
        </Button>
      </div>

      <EmailDialog 
        poem={poem}
        title={title}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
      
      <ShareDialog
        poem={poem}
        title={title}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};

export default ActionButtons;
