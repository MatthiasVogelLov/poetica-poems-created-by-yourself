
import React from 'react';
import { Sparkles } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/100 animate-spin"></div>
            <span>Gedicht wird erstellt...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Gedicht erstellen</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
