
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  personalMessage: string;
  setPersonalMessage: (message: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({
  email,
  setEmail,
  name,
  setName,
  personalMessage,
  setPersonalMessage
}) => {
  return (
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
  );
};

export default EmailForm;
