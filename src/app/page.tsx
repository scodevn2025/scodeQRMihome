
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { QrCode, Smartphone, RefreshCw, CheckCircle, XCircle, ArrowRight, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [qrStatus, setQrStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setQrStatus('loading');
    try {
      const response = await apiClient.generateQR();
      if (response.success && response.data?.qrUrl) {
        setQrUrl(response.data.qrUrl);
        setQrStatus('idle');
        toast.success('Tạo mã QR thành công!');
      } else {
        setQrStatus('error');
        toast.error('Không thể tạo mã QR');
      }
    } catch {
      setQrStatus('error');
      toast.error('Lỗi khi tạo mã QR');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex flex-col">
      {/* Header */}
      <Header showLogo={true} />
      
      {/* Banner Section */}
      <Banner 
        title="✨ Quản lý thiết bị thông minh ✨"
        subtitle="Giải pháp toàn diện cho ngôi nhà thông minh của bạn"
        showFeatures={true}
        showCTA={false}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative w-full max-w-md z-10">
          {/* Login Options */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-slide-up">
              Chọn phương thức đăng nhập của bạn
            </h2>
            <p className="text-blue-200 text-lg animate-slide-up delay-200">
              Bắt đầu hành trình quản lý ngôi nhà thông minh
            </p>
          </div>

          {/* Login Methods */}
          <div className="space-y-4 mb-8">
            {/* QR Login Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6 relative overflow-hidden group hover:bg-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    📱 Đăng nhập bằng QR Code
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Quét mã QR bằng ứng dụng Mi Home để đăng nhập
                  </p>
                </div>

                {qrStatus === 'idle' && !qrUrl && (
                  <Button
                    onClick={generateQR}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <QrCode className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">✨ Tạo mã QR ✨</span>
                  </Button>
                )}

                {qrStatus === 'loading' && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                    <p className="text-slate-300 text-sm">Đang tạo mã QR...</p>
                  </div>
                )}

                {qrUrl && qrStatus === 'idle' && (
                  <div className="text-center space-y-3">
                    <div className="bg-white p-3 rounded-xl inline-block">
                      <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-28 h-28"
                      />
                    </div>
                    <p className="text-slate-300 text-xs">
                      Quét mã QR bằng Mi Home
                    </p>
                    <Button
                      onClick={generateQR}
                      variant="outline"
                      size="sm"
                      className="text-white border-white/30 hover:bg-white/10 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Tạo mã mới
                    </Button>
                  </div>
                )}

                {qrStatus === 'success' && (
                  <div className="text-center">
                    <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-medium text-sm">Đăng nhập thành công!</p>
                  </div>
                )}

                {qrStatus === 'error' && (
                  <div className="text-center">
                    <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400 font-medium text-xs mb-3">Lỗi khi tạo mã QR</p>
                    <Button
                      onClick={generateQR}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Thử lại
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Credential Login Card */}
            <Link href="/login">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6 relative overflow-hidden group hover:bg-white/20 transition-all duration-500 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    👤 Đăng nhập tài khoản
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Sử dụng tên đăng nhập và mật khẩu Mi Home
                  </p>
                  <div className="flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                    <span className="text-sm font-medium">Tiếp tục</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Features */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 text-slate-300">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm">Bảo mật cao</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <QrCode className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Nhanh chóng</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Hệ thống sử dụng mã hóa end-to-end để bảo vệ thông tin của bạn. 
              Tất cả dữ liệu được truyền tải an toàn.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
