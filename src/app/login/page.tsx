'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  User, 
  Lock, 
  Smartphone,
  Wifi,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [qrCode, setQrCode] = useState<string>('');
  const [qrStatus, setQrStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loginMethod, setLoginMethod] = useState<'qr' | 'credentials'>('qr');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const generateQR = async () => {
    setQrStatus('loading');
    try {
      const response = await apiClient.generateQR();
      if (response.success && response.data?.qrCode) {
        setQrCode(response.data.qrCode);
        setQrStatus('idle');
        checkQRStatus();
      } else {
        setQrStatus('error');
        toast.error('Không thể tạo mã QR');
      }
    } catch {
      setQrStatus('error');
      toast.error('Lỗi khi tạo mã QR');
    }
  };

  const checkQRStatus = async () => {
    try {
      const response = await apiClient.checkQRStatus('');
      if (response.success) {
        if (response.data?.status === 'confirmed') {
          setQrStatus('success');
          toast.success('Đăng nhập thành công!');
          await login(response.data, '');
          router.push('/dashboard');
        } else if (response.data?.status === 'expired') {
          setQrStatus('error');
          toast.error('Mã QR đã hết hạn');
        } else {
          // Continue checking
          setTimeout(checkQRStatus, 2000);
        }
      }
    } catch {
      setQrStatus('error');
      toast.error('Lỗi khi kiểm tra trạng thái QR');
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.loginWithCredentials(credentials.username, credentials.password);
      if (response.success) {
        toast.success('Đăng nhập thành công!');
        await login(response.data, '');
        router.push('/dashboard');
      } else {
        toast.error(response.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Moving particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl shadow-2xl mb-6 relative group hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Wifi className="h-10 w-10 text-white relative z-10 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-slide-up">
            Smart Control
          </h1>
          <p className="text-pink-200 text-lg animate-slide-up delay-200">✨ Quản lý thiết bị thông minh ✨</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/20 border-white/30 shadow-2xl relative overflow-hidden group hover:bg-white/25 transition-all duration-500">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="text-center pb-4 relative z-10">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
              🚀 Đăng nhập
            </CardTitle>
            <CardDescription className="text-pink-200 text-lg">
              Chọn phương thức đăng nhập của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'qr' | 'credentials')}>
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-white/20 backdrop-blur-sm">
                <TabsTrigger 
                  value="qr" 
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  📱 QR Code
                </TabsTrigger>
                <TabsTrigger 
                  value="credentials" 
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  👤 Tài khoản
                </TabsTrigger>
              </TabsList>

              {/* QR Code Login */}
              <TabsContent value="qr" className="space-y-6 mt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Đăng nhập bằng QR Code</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Quét mã QR bằng ứng dụng Mi Home để đăng nhập
                  </p>
                </div>

                {qrStatus === 'idle' && !qrCode && (
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-slate-300">Đang tạo mã QR...</p>
                  </div>
                )}

                {qrCode && qrStatus === 'idle' && (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-2xl inline-block">
                      <Image 
                        src={qrCode} 
                        alt="QR Code" 
                        width={192}
                        height={192}
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-slate-300 text-sm">
                      Quét mã QR bằng ứng dụng Mi Home
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={generateQR}
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tạo mã mới
                    </Button>
                  </div>
                )}

                {qrStatus === 'success' && (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-green-400 font-medium">Đăng nhập thành công!</p>
                  </div>
                )}

                {qrStatus === 'error' && (
                  <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 font-medium mb-4">Lỗi khi tạo mã QR</p>
                    <Button 
                      onClick={generateQR}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Thử lại
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Credentials Login */}
              <TabsContent value="credentials" className="space-y-6 mt-6">
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Tên đăng nhập</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:bg-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:bg-white/20"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Đăng nhập
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            © 2024 Smart Control. Được phát triển bởi ScodeVN
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
