import React, { useState } from 'react';
import { Printer, Send, Share2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import EmailDialog from './dialogs/EmailDialog';
import ShareDialog from './dialogs/ShareDialog';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFontSize(24);
    doc.setFont('times', 'italic');
    doc.text('Poetica', 20, 20);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleWidth = doc.getStringUnitWidth(title) * 18 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, 40);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const lines = poem.split('\n');
    let y = 60;
    
    lines.forEach(line => {
      const lineWidth = doc.getStringUnitWidth(line) * 12 / doc.internal.scaleFactor;
      const lineX = (doc.internal.pageSize.width - lineWidth) / 2;
      doc.text(line, lineX, y);
      y += 8;
    });
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Erstellt mit Poetica', 20, 280);
    
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    
    toast.success("PDF heruntergeladen", {
      description: "Das Gedicht wurde erfolgreich als PDF heruntergeladen."
    });
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
          onClick={() => setShareDialogOpen(true)}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Share2 size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>Teilen</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={handleDownloadPDF}
        >
          <FileDown size={16} />
          <span>Als PDF</span>
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
