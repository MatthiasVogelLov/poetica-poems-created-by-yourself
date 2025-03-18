import React, { useState } from 'react';
import { Printer, Send, Share2, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";

interface ActionButtonsProps {
  poem: string;
  title: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ poem, title }) => {
  const isMobile = useIsMobile();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
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
      const { data, error } = await supabase.functions.invoke('send-poem', {
        body: {
          recipientEmail: email,
          recipientName: name,
          poemTitle: title,
          poemContent: poem,
          personalMessage: personalMessage
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Fehler beim Senden der E-Mail');
      }

      toast.success('E-Mail erfolgreich gesendet');
      setEmailDialogOpen(false);
      setPersonalMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Fehler beim Senden der E-Mail');
    } finally {
      setIsSending(false);
    }
  };

  const handleShare = (platform: string) => {
    const poemText = `${title}\n\n${poem}\n\nErstellt mit poetica.advora.com`;
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://poetica.advora.com&quote=${encodeURIComponent(poemText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poemText)}`;
        break;
      case 'instagram':
        toast.info('Instagram unterstützt kein direktes Teilen. Bitte machen Sie einen Screenshot und teilen Sie ihn über die Instagram-App.', {
          duration: 5000,
          description: "Tippen Sie auf den Bildschirm und halten Sie gedrückt, um einen Screenshot zu machen."
        });
        setShareDialogOpen(false);
        return;
      default:
        navigator.clipboard.writeText(poemText)
          .then(() => toast.success('Gedicht in die Zwischenablage kopiert'))
          .catch(() => toast.error('Fehler beim Kopieren'));
        setShareDialogOpen(false);
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShareDialogOpen(false);
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
      </div>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gedicht per E-Mail senden</DialogTitle>
            <DialogDescription>
              Teilen Sie Ihr Gedicht per E-Mail mit Freunden oder Familie.
            </DialogDescription>
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
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="message" className="text-right pt-2">
                Nachricht
              </Label>
              <Textarea
                id="message"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                className="col-span-3 min-h-[100px]"
                placeholder="Fügen Sie hier eine persönliche Nachricht hinzu..."
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

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gedicht teilen</DialogTitle>
            <DialogDescription>
              Wählen Sie eine Plattform, um Ihr Gedicht zu teilen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-6 w-6 text-blue-600" />
              <span className="sr-only">Auf Facebook teilen</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-6 w-6 text-sky-500" />
              <span className="sr-only">Auf Twitter teilen</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => handleShare('instagram')}
            >
              <Instagram className="h-6 w-6 text-pink-600" />
              <span className="sr-only">Auf Instagram teilen</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => handleShare('copy')}
            >
              <Share2 className="h-6 w-6" />
              <span className="sr-only">Kopieren</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionButtons;
