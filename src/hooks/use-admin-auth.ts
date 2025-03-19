
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Check if admin is already logged in
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Simple password protection - in a real app, this should be handled securely
    // The admin password is "poetica-admin" - in a production app, this would be handled with proper authentication
    if (password === 'poetica-admin') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Angemeldet",
        description: "Sie sind nun als Administrator angemeldet.",
      });
    } else {
      toast({
        title: "Fehler",
        description: "Falsches Passwort. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  return {
    isAuthenticated,
    password,
    setPassword,
    handleLogin,
    handleLogout
  };
};
