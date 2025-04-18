
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { validateEmail } from '@/utils/validation';
import EmailForm from './EmailForm';
import EmailDebugInfo from './EmailDebugInfo';

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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleEmailSend = async () => {
    // Reset debug info
    setDebugInfo(null);
    
    // Input validation
    if (!email) {
      toast.error('Bitte geben Sie eine E-Mail-Adresse ein');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    if (!poem || !title) {
      toast.error('Gedicht oder Titel fehlt');
      return;
    }

    setIsSending(true);
    try {
      // Additional logging to help with debugging
      console.log('Sending email request with the following data:');
      console.log('- Email:', email);
      console.log('- Name:', name);
      console.log('- Poem title length:', title.length);
      console.log('- Poem content length:', poem.length);
      console.log('- Personal message length:', personalMessage?.length || 0);

      const payload = {
        recipientEmail: email,
        recipientName: name || 'Empfänger', // Default name if not provided
        poemTitle: title,
        poemContent: poem,
        personalMessage: personalMessage
      };

      console.log('Full payload being sent:', JSON.stringify(payload));

      const { data, error } = await supabase.functions.invoke('send-poem', {
        body: payload
      });
      
      if (error) {
        console.error('Error from Edge Function:', error);
        setDebugInfo(`Edge Function error: ${JSON.stringify(error)}`);
        throw new Error(error.message || 'Fehler beim Senden der E-Mail');
      }

      console.log('Email send response:', data);
      
      if (!data || !data.success) {
        const errorMsg = data?.error || 'Unbekannter Fehler beim Senden';
        setDebugInfo(`API response error: ${JSON.stringify(data)}`);
        throw new Error(errorMsg);
      }

      toast.success('E-Mail erfolgreich gesendet');
      onOpenChange(false);
      setEmail('');
      setName('');
      setPersonalMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Fehler beim Senden der E-Mail: ${error.message || 'Unbekannter Fehler'}`);
      
      // Set debug info if not already set
      if (!debugInfo) {
        setDebugInfo(`Exception: ${error.message || 'Unbekannter Fehler'}`);
      }
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
      setDebugInfo(null);
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
        
        <EmailForm
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          personalMessage={personalMessage}
          setPersonalMessage={setPersonalMessage}
        />
        
        <EmailDebugInfo debugInfo={debugInfo} />
        
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
