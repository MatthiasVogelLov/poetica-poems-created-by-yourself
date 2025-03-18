
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const TellAFriend = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Hallo,\n\nIch habe diese tolle Webseite zum Erstellen personalisierter Gedichte entdeckt und dachte, das könnte dich interessieren!\n\nSchau sie dir an: https://poetica.advora.com');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Fehler", {
        description: "Bitte geben Sie eine E-Mail-Adresse ein."
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending recommendation email to:", email);
      
      const { data, error } = await supabase.functions.invoke('tell-a-friend', {
        body: {
          recipientEmail: email,
          message: message
        }
      });

      if (error) throw error;

      console.log("Recommendation email sent successfully");

      toast.success("Nachricht gesendet", {
        description: "Ihre Empfehlung wurde erfolgreich versendet."
      });

      setIsOpen(false);
      setEmail('');
      setMessage('Hallo,\n\nIch habe diese tolle Webseite zum Erstellen personalisierter Gedichte entdeckt und dachte, das könnte dich interessieren!\n\nSchau sie dir an: https://poetica.advora.com');
    } catch (error) {
      console.error("Error sending recommendation:", error);
      
      toast.error("Fehler", {
        description: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
          Einem Freund empfehlen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Poetica empfehlen</DialogTitle>
          <DialogDescription>
            Teilen Sie Poetica mit Freunden und Familie, die Gedichte lieben könnten.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input 
              id="email" 
              placeholder="freund@example.com" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Nachricht</Label>
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
                Wird gesendet...
              </>
            ) : "Senden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TellAFriend;
