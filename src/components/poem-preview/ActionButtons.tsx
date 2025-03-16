
import React, { useState } from 'react';
import { Printer, Send, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ActionButtonsProps {
  poem: string;
  title: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ poem, title }) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSend = async () => {
    if (!email) {
      toast.error('Bitte geben Sie eine E-Mail-Adresse ein');
      return;
    }

    setIsSending(true);
    try {
      // Call Supabase Edge Function to send email
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-poem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: email,
          recipientName: name,
          poemTitle: title,
          poemContent: poem
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Senden der E-Mail');
      }

      toast.success('E-Mail erfolgreich gesendet');
      setEmailDialogOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Fehler beim Senden der E-Mail');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${title}\n\n${poem}`);
    setCopied(true);
    toast.success('In die Zwischenablage kopiert');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gedicht per E-Mail senden</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Max Mustermann"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button type="button" onClick={handleEmailSend} disabled={isSending}>
              {isSending ? 'Wird gesendet...' : 'Senden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionButtons;
