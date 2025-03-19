
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

interface AdminLoginFormProps {
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ 
  password, 
  setPassword, 
  handleLogin 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>Zurück zur Startseite</span>
      </Link>
      
      <h1 className="heading-lg mb-6">Admin-Login</h1>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Input 
                type="password" 
                placeholder="Passwort eingeben" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Anmelden
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
