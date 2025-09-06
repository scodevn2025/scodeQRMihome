'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="flex flex-col h-screen relative z-10">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          showLogo={false}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className={cn(
            "hidden lg:flex lg:flex-shrink-0",
            sidebarOpen && "lg:hidden"
          )}>
            <Sidebar />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 w-64">
                <Sidebar />
              </div>
            </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className={cn(
            "flex-1 overflow-y-auto bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 backdrop-blur-sm",
            className
          )}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
