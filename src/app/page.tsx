
"use client";

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { QrCode, Smartphone, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

  <div className="relative w-full max-w-xs z-10">
        <div className="text-center mb-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl shadow-xl mb-3 relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            <QrCode className="h-7 w-7 text-white relative z-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-1 animate-slide-up">
            Đăng nhập QR
          </h1>
          <p className="text-pink-200 text-sm animate-slide-up delay-200">
            Quét mã QR bằng Mi Home để truy cập
          </p>
        </div>

  <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 relative overflow-hidden group hover:bg-white/20 transition-all duration-500">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl mb-2">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Đăng nhập bằng QR Code
            </h3>
            <p className="text-slate-300 text-xs mb-3">
              Quét mã QR bằng Mi Home để đăng nhập
            </p>
          </div>

          {qrStatus === 'idle' && !qrUrl && (
            <button
              onClick={generateQR}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <QrCode className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Tạo mã QR</span>
            </button>
          )}

          {qrStatus === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-slate-300 text-xs">Đang tạo mã QR...</p>
            </div>
          )}

          {qrUrl && qrStatus === 'idle' && (
            <div className="text-center space-y-2">
              <div className="bg-white p-2 rounded-xl inline-block">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-slate-300 text-xs">
                Quét mã QR bằng Mi Home
              </p>
              <button
                onClick={generateQR}
                className="text-white border-white/30 hover:bg-white/10 px-3 py-1 rounded-lg border mt-1 text-xs"
              >
                <RefreshCw className="h-4 w-4 mr-1 inline-block" />
                Tạo mã mới
              </button>
            </div>
          )}

          {qrStatus === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium text-sm">Đăng nhập thành công!</p>
            </div>
          )}

          {qrStatus === 'error' && (
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 font-medium text-xs mb-2">Lỗi khi tạo mã QR</p>
              <button
                onClick={generateQR}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-1 rounded-lg text-xs"
              >
                <RefreshCw className="h-4 w-4 mr-1 inline-block" />
                Thử lại
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            © 2024 Smart Control. Được phát triển bởi ScodeVN
          </p>
        </div>
      </div>
    </div>
  );
}
