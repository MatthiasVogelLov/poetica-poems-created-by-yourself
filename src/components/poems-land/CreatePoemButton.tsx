
import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';

interface CreatePoemButtonProps {
  onClick: () => void;
}

const CreatePoemButton: React.FC<CreatePoemButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-8 text-center">
      <Button 
        onClick={onClick}
        className="px-4 py-2 text-sm flex items-center gap-2 mx-auto"
      >
        <PenLine className="w-4 h-4" />
        <span>Erstelle Dein eigenes Gedicht</span>
      </Button>
    </div>
  );
};

export default CreatePoemButton;
