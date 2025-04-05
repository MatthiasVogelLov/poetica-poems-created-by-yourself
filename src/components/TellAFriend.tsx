
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/contexts/LanguageContext';

const TellAFriend = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState(
    language === 'en' 
      ? 'Hello,\n\nI discovered this great website for creating personalized poems and thought you might be interested!\n\nCheck it out: https://poetica.apvora.com'
      : 'Hallo,\n\nIch habe diese tolle Webseite zum Erstellen personalisierter Gedichte entdeckt und dachte, das könnte dich interessieren!\n\nSchau sie dir an: https://poetica.apvora.com'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error(language === 'en' ? "Error" : "Fehler", {
        description: language === 'en' ? "Please enter an email address." : "Bitte geben Sie eine E-Mail-Adresse ein."
      });
      return;
    }

    if (!senderName) {
      toast.error(language === 'en' ? "Error" : "Fehler", {
        description: language === 'en' ? "Please enter your name." : "Bitte geben Sie Ihren Namen ein."
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending recommendation email to:", email);
      
      const { data, error } = await supabase.functions.invoke('tell-a-friend', {
        body: {
          recipientEmail: email,
          senderName: senderName,
          message: message
        }
      });

      if (error) throw error;

      console.log("Recommendation email sent successfully");

      toast.success(language === 'en' ? "Message sent" : "Nachricht gesendet", {
        description: language === 'en' ? "Your recommendation has been sent successfully." : "Ihre Empfehlung wurde erfolgreich versendet."
      });

      setIsOpen(false);
      setEmail('');
      setName('');
      setSenderName('');
      setMessage(
        language === 'en' 
          ? 'Hello,\n\nI discovered this great website for creating personalized poems and thought you might be interested!\n\nCheck it out: https://poetica.apvora.com'
          : 'Hallo,\n\nIch habe diese tolle Webseite zum Erstellen personalisierter Gedichte entdeckt und dachte, das könnte dich interessieren!\n\nSchau sie dir an: https://poetica.apvora.com'
      );
    } catch (error) {
      console.error("Error sending recommendation:", error);
      
      toast.error(language === 'en' ? "Error" : "Fehler", {
        description: language === 'en' ? "The message could not be sent. Please try again later." : "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Translations for UI text
  const translations = {
    buttonText: language === 'en' ? "Recommend to a friend" : "Einem Freund empfehlen",
    title: language === 'en' ? "Recommend Poetica" : "Poetica empfehlen",
    description: language === 'en' ? "Share Poetica with friends and family who might love poems." : "Teilen Sie Poetica mit Freunden und Familie, die Gedichte lieben könnten.",
    from: language === 'en' ? "From" : "Von",
    yourName: language === 'en' ? "Your name" : "Ihr Name",
    emailAddress: language === 'en' ? "Email address" : "E-Mail-Adresse",
    messageLabel: language === 'en' ? "Message" : "Nachricht",
    sendButton: language === 'en' ? "Send" : "Senden",
    sending: language === 'en' ? "Sending..." : "Wird gesendet..."
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
          {translations.buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="senderName">{translations.from} <span className="text-destructive">*</span></Label>
            <Input 
              id="senderName" 
              placeholder={translations.yourName} 
              value={senderName} 
              onChange={(e) => setSenderName(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{translations.emailAddress} <span className="text-destructive">*</span></Label>
            <Input 
              id="email" 
              placeholder={language === 'en' ? "friend@example.com" : "freund@example.com"} 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">{translations.messageLabel}</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSendEmail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translations.sending}
              </>
            ) : translations.sendButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TellAFriend;
