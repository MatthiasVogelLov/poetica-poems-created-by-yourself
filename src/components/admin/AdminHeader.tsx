
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface AdminHeaderProps {
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ handleLogout }) => {
  const { isAdmin } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={18} />
        <span>{t('common.backToHome')}</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button variant="outline" onClick={handleLogout} className="text-sm">
          {t('common.logout')}
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
