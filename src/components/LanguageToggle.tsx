
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from '@/hooks/use-admin-auth';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();
  
  // Check if the current path is in English
  const isEnglish = location.pathname.startsWith('/en');
  
  // Function to handle language toggle
  const handleToggle = () => {
    const currentPath = location.pathname;
    
    // Extract poem slug from path if present
    const poemSlugMatch = currentPath.match(/\/poemsland\/([^\/]+)/);
    const poemSlug = poemSlugMatch ? poemSlugMatch[1] : null;
    
    if (isEnglish) {
      // Switch from English to German
      let germanPath = currentPath.replace(/^\/en/, '');
      
      // Special case for admin - redirect to German admin
      if (currentPath === '/en/admin') {
        germanPath = '/admin';
      }
      
      navigate(germanPath || '/');
    } else {
      // Switch from German to English
      let englishPath = `/en${currentPath}`;
      
      // Special case for admin - redirect to English admin
      if (currentPath === '/admin') {
        englishPath = '/en/admin';
      }
      
      navigate(englishPath);
    }
  };

  // Only render if admin is logged in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Label htmlFor="language-toggle" className="cursor-pointer">
        DE
      </Label>
      <Switch
        id="language-toggle"
        checked={isEnglish}
        onCheckedChange={handleToggle}
        aria-label="Toggle language"
      />
      <Label htmlFor="language-toggle" className="cursor-pointer">
        EN
      </Label>
    </div>
  );
};

export default LanguageToggle;
