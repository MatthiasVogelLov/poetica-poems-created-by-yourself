import React, { useState } from 'react';
import { Printer, Send, Share2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import EmailDialog from './dialogs/EmailDialog';
import ShareDialog from './dialogs/share';
import jsPDF from 'jspdf';
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set margins and usable area
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    
    // Draw decorative frame
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - (margin * 2) + 10);
    
    // Add inner decorative frame with softer lines
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));
    
    // Header - Poetica logo with italic styling
    doc.setFontSize(24);
    doc.setFont('times', 'italic');
    doc.text('Poetica', margin, margin + 10);
    
    // Title - centered
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleWidth = doc.getStringUnitWidth(title) * 18 / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, margin + 30);
    
    // Add a subtle decorative line under the title
    doc.setDrawColor(180, 180, 180);
    doc.line(margin + 20, margin + 35, pageWidth - margin - 20, margin + 35);
    
    // Poem content - centered with proper formatting
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const lines = poem.split('\n');
    let y = margin + 50; // Starting y position for poem content
    
    lines.forEach(line => {
      if (line.trim() === '') {
        // Add space for empty lines (stanza breaks)
        y += 8;
        return;
      }
      
      const lineWidth = doc.getStringUnitWidth(line) * 12 / doc.internal.scaleFactor;
      const lineX = (pageWidth - lineWidth) / 2;
      doc.text(line, lineX, y);
      y += 8;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('Erstellt mit poetica.apvora.com', margin, pageHeight - margin);
    
    // Draw a subtle decorative line above the footer
    doc.setDrawColor(180, 180, 180);
    doc.line(margin + 20, pageHeight - margin - 10, pageWidth - margin - 20, pageHeight - margin - 10);
    
    // Save the PDF
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
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1 sm:gap-2" 
          onClick={handleDownloadPDF}
        >
          <FileDown size={isMobile ? 14 : 16} />
          <span className={isMobile ? "text-xs" : ""}>Als PDF</span>
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
