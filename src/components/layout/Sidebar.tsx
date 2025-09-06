'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  LogOut, 
  Wifi, 
  Zap,
  BarChart3,
  Shield,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard',
    },
    {
      name: 'Thiết bị',
      href: '/devices',
      icon: Wifi,
      current: pathname === '/devices',
    },
    {
      name: 'Kịch bản',
      href: '/scenes',
      icon: Zap,
      current: pathname === '/scenes',
    },
    {
      name: 'Thống kê',
      href: '/analytics',
      icon: BarChart3,
      current: pathname === '/analytics',
    },
    {
      name: 'Bảo mật',
      href: '/security',
      icon: Shield,
      current: pathname === '/security',
    },
    {
      name: 'Thông báo',
      href: '/notifications',
      icon: Bell,
      current: pathname === '/notifications',
    },
    {
      name: 'Cài đặt',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings',
    },
  ];

  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-gradient-to-b from-purple-900 via-pink-900 to-red-900 border-r border-white/20 relative overflow-hidden",
      className
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
      
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg hover:scale-110 transition-transform duration-300 group">
            <Wifi className="h-6 w-6 text-white group-hover:animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white group-hover:text-pink-200 transition-colors duration-300">Smart Control</h1>
            <p className="text-xs text-pink-200">✨ Mijia Dashboard ✨</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 space-y-2 relative z-10">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden",
                item.current
                  ? "bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 text-white border border-pink-500/50 shadow-lg shadow-pink-500/20"
                  : "text-pink-200 hover:bg-white/10 hover:text-white"
              )}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 relative z-10",
                  item.current ? "text-pink-300 group-hover:animate-pulse" : "text-pink-300 group-hover:text-white group-hover:scale-110"
                )}
              />
              <span className="relative z-10">{item.name}</span>
              {item.name === 'Thông báo' && (
                <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs animate-pulse relative z-10">
                  🔔 3
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-slate-400 truncate">user@example.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
