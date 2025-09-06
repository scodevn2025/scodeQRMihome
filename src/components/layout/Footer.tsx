'use client';

import React from 'react';
import { Github, Mail, Phone, MapPin, Globe, Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-cyan-500/30 mt-auto">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-purple-900/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-xl shadow-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Scode Control
                </h3>
                <p className="text-xs text-cyan-300/80">Smart Home Management</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Giải pháp quản lý thiết bị thông minh toàn diện, 
              giúp bạn điều khiển ngôi nhà một cách thông minh và hiệu quả.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/scodevn2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@scodevn.com" 
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Quản lý thiết bị
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Tự động hóa
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Cài đặt
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Tài liệu API
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Liên hệ hỗ trợ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  Báo cáo lỗi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">contact@scodevn.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>© 2024 Smart Control. Được phát triển với</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>bởi</span>
            <a 
              href="https://github.com/scodevn2025" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
            >
              ScodeVN
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Chính sách bảo mật
            </a>
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-60"></div>
    </footer>
  );
};

export default Footer;