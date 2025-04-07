
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ handleLogout }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={18} />
        <span>Zurück zur Startseite</span>
      </Link>
      
      <Button variant="outline" onClick={handleLogout} className="text-sm">
        Abmelden
      </Button>
    </div>
  );
};

export default AdminHeader;
