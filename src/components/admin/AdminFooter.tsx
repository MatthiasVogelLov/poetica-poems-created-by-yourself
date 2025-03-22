
import React from 'react';

const AdminFooter: React.FC = () => {
  return (
    <footer className="py-10 border-t">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
            <a href="/hilfe" className="hover:text-foreground transition-colors">Hilfe</a>
            <a href="/kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
            <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
