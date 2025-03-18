
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EmailDialogProps {
  poem: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({
  poem,
  title,
  open,
  onOpenChange
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleEmailSend = async () => {
    if (!email) {
      toast.error('Bitte geben Sie eine E-Mail-Adresse ein');
      return;
    }

    if (!poem || !title) {
      toast.error('Gedicht oder Titel fehlt');
      return;
    }

    setIsSending(true);
    try {
      console.log('Sending email to:', email);
      console.log('Poem content length:', poem.length);
      console.log('Title:', title);

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
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Fehler beim Senden der E-Mail');
      }

      console.log('Email send response:', data);
      toast.success('E-Mail erfolgreich gesendet');
      onOpenChange(false);
      setEmail('');
      setName('');
      setPersonalMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Fehler beim Senden der E-Mail: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSending) {
      onOpenChange(false);
      setEmail('');
      setName('');
      setPersonalMessage('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
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
          <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSending}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleEmailSend} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gesendet...
              </>
            ) : 'Senden'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
