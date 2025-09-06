'use client';

import React from 'react';
import { Search, Bell, Settings, User, Menu, LogOut, Wifi, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, className, showLogo = true }) => {
  return (
    <header className={`relative z-50 backdrop-blur-xl bg-black/40 border-b border-cyan-500/30 shadow-2xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo and Brand */}
            {showLogo && (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-2xl shadow-lg">
                    <Wifi className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Scode Control
                  </h1>
                  <p className="text-xs text-cyan-300/80">Smart Home Management</p>
                </div>
              </div>
            )}
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm kiếm thiết bị, kịch bản..."
                className="pl-10 w-80 bg-black/20 border-cyan-500/30 text-white placeholder:text-slate-400 focus:bg-black/30 focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-8">
            <a href="#" className="text-white/80 hover:text-cyan-400 transition-all duration-300 text-sm font-medium flex items-center space-x-2 group">
              <Shield className="h-4 w-4 group-hover:text-cyan-400" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="text-white/80 hover:text-cyan-400 transition-all duration-300 text-sm font-medium flex items-center space-x-2 group">
              <Zap className="h-4 w-4 group-hover:text-cyan-400" />
              <span>Thiết bị</span>
            </a>
            <a href="#" className="text-white/80 hover:text-cyan-400 transition-all duration-300 text-sm font-medium">
              Tự động hóa
            </a>
            <a href="#" className="text-white/80 hover:text-cyan-400 transition-all duration-300 text-sm font-medium">
              Hỗ trợ
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-white/80 hover:text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-pink-500 to-red-500 border-0"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-black/90 backdrop-blur-xl border-cyan-500/30 text-white">
              <DropdownMenuLabel className="text-cyan-400">Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cyan-500/30" />
              <DropdownMenuItem className="hover:bg-white/10">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Thiết bị mới được thêm</p>
                  <p className="text-xs text-slate-300">Xiaomi Air Purifier đã được kết nối</p>
                  <p className="text-xs text-slate-400">2 phút trước</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Cảnh báo bảo mật</p>
                  <p className="text-xs text-slate-300">Đăng nhập từ thiết bị mới</p>
                  <p className="text-xs text-slate-400">1 giờ trước</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Cập nhật hệ thống</p>
                  <p className="text-xs text-slate-300">Phiên bản mới đã sẵn sàng</p>
                  <p className="text-xs text-slate-400">3 giờ trước</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-cyan-500/30 text-white">
              <DropdownMenuLabel className="text-cyan-400">Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cyan-500/30" />
              <DropdownMenuItem className="hover:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10">
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-cyan-500/30" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
