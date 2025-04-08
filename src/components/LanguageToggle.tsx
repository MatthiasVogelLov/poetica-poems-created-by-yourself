
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminLoggedIn } = useAdminBypass();
  
  // Check if the current path is in English
  const isEnglish = location.pathname.startsWith('/en');
  
  // Function to handle language toggle
  const handleToggle = () => {
    const currentPath = location.pathname;
    
    if (isEnglish) {
      // Switch from English to German
      const germanPath = currentPath.replace(/^\/en/, '');
      navigate(germanPath || '/');
    } else {
      // Switch from German to English
      navigate(`/en${currentPath}`);
    }
  };

  // Only render if admin is logged in
  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Label htmlFor="language-toggle" className="cursor-pointer">
        DE
      </Label>
      <div className="relative">
        {isEnglish ? 
          <ToggleRight className="text-primary absolute -top-1 -left-1 z-10 pointer-events-none" size={22} /> :
          <ToggleLeft className="text-primary absolute -top-1 -left-1 z-10 pointer-events-none" size={22} />
        }
        <Switch
          id="language-toggle"
          checked={isEnglish}
          onCheckedChange={handleToggle}
          aria-label="Toggle language"
        />
      </div>
      <Label htmlFor="language-toggle" className="cursor-pointer">
        EN
      </Label>
    </div>
  );
};

export default LanguageToggle;
