'use client';

import React from 'react';
import { Sparkles, Star, Shield, Zap, Cpu, Wifi, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerProps {
  title?: string;
  subtitle?: string;
  showFeatures?: boolean;
  showCTA?: boolean;
}

const Banner: React.FC<BannerProps> = ({ 
  title = "✨ Quản lý thiết bị thông minh ✨",
  subtitle = "Giải pháp toàn diện cho ngôi nhà thông minh của bạn",
  showFeatures = true,
  showCTA = false
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
      
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
      
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl shadow-2xl mb-8 relative group hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Wifi className="h-10 w-10 text-white relative z-10 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 animate-slide-up">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto animate-slide-up delay-200 leading-relaxed">
            {subtitle}
          </p>

          {/* Feature Highlights */}
          {showFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bảo mật cao</h3>
                <p className="text-blue-200 text-sm">Mã hóa end-to-end, bảo vệ dữ liệu của bạn một cách tuyệt đối</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nhanh chóng</h3>
                <p className="text-blue-200 text-sm">Phản hồi tức thì, điều khiển thiết bị trong tích tắc</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Thông minh</h3>
                <p className="text-blue-200 text-sm">AI tích hợp, tự động hóa thông minh cho ngôi nhà</p>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {showCTA && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              100+
            </div>
            <div className="text-blue-200 text-sm">Thiết bị hỗ trợ</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-blue-200 text-sm">Thời gian hoạt động</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-blue-200 text-sm">Hỗ trợ kỹ thuật</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              1000+
            </div>
            <div className="text-blue-200 text-sm">Người dùng tin tưởng</div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
    </div>
  );
};

export default Banner;