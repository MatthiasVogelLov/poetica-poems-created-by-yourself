
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
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('Hello,\n\nI\'ve discovered this great website for creating personalized poems and thought you might be interested!\n\nCheck it out: https://poetica.apvora.com');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Error", {
        description: "Please enter an email address."
      });
      return;
    }

    if (!senderName) {
      toast.error("Error", {
        description: "Please enter your name."
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

      toast.success("Message sent", {
        description: "Your recommendation has been sent successfully."
      });

      setIsOpen(false);
      setEmail('');
      setName('');
      setSenderName('');
      setMessage('Hello,\n\nI\'ve discovered this great website for creating personalized poems and thought you might be interested!\n\nCheck it out: https://poetica.apvora.com');
    } catch (error) {
      console.error("Error sending recommendation:", error);
      
      toast.error("Error", {
        description: "The message could not be sent. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
          Recommend to a Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recommend Poetica</DialogTitle>
          <DialogDescription>
            Share Poetica with friends and family who might enjoy creating poems.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="senderName">From <span className="text-destructive">*</span></Label>
            <Input 
              id="senderName" 
              placeholder="Your name" 
              value={senderName} 
              onChange={(e) => setSenderName(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
            <Input 
              id="email" 
              placeholder="friend@example.com" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
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
                Sending...
              </>
            ) : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TellAFriend;
