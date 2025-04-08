
import React, { useState } from 'react';
import Header from '../../components/en/Header';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import ContentManagementTabs from '@/components/admin/ContentManagementTabs';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const { 
    isAuthenticated, 
    password, 
    setPassword, 
    handleLogin, 
    handleLogout 
  } = useAdminAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow px-4 sm:px-8">
          {!isAuthenticated ? (
            <AdminLoginForm 
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          ) : (
            <div className="max-w-5xl mx-auto">
              <AdminHeader handleLogout={handleLogout} />
              
              <h1 className="heading-lg mb-6 sm:mb-10">Admin Area</h1>
              
              <ContentManagementTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          )}
        </div>
      </div>
      
      <AdminFooter />
    </div>
  );
};

export default Admin;
