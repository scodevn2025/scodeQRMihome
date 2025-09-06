'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useDeviceStore } from '@/lib/store';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import DeviceCard from '@/components/dashboard/DeviceCard';
import SceneCard from '@/components/dashboard/SceneCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Zap,
  Users,
  Activity
} from 'lucide-react';
import { Device } from '@/types';

const DashboardPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    devices, 
    loading, 
    error, 
    fetchDevices, 
    updateDevice,
    setError
  } = useDeviceStore();

  // State for homes and scenes
  const [scenes, setScenes] = useState<Array<{id: string; name: string; description?: string; enabled: boolean; homeId: string}>>([]);
  const [sharedDevices, setSharedDevices] = useState<Device[]>([]);

  const fetchScenes = useCallback(async (homeId: string) => {
    try {
      const response = await apiClient.getScenes(homeId);
      if (response.success && response.data) {
        setScenes(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch scenes:', err);
    }
  }, []);

  const fetchSharedDevices = useCallback(async () => {
    try {
      const response = await apiClient.getDevices();
      if (response.success && response.data) {
        // Lọc thiết bị được chia sẻ (có thể dựa vào thuộc tính shared hoặc owner)
        const shared = response.data.filter(device => 
          device.name.includes('Shared') || 
          device.name.includes('Chia sẻ') ||
          device.model?.includes('shared')
        );
        setSharedDevices(shared);
      }
    } catch (err) {
      console.error('Failed to fetch shared devices:', err);
    }
  }, []);

  const fetchHomes = useCallback(async () => {
    try {
      const response = await apiClient.getHomes();
      if (response.success && response.data && response.data.length > 0) {
        const homeId = response.data[0].id;
        await fetchScenes(homeId);
      }
    } catch (err) {
      console.error('Failed to fetch homes:', err);
    }
  }, [fetchScenes]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Khôi phục session Mijia nếu có
    if (user && user.mijiaSession) {
      // Session đã được set trong store khi login
    }
    
    fetchDevices();
    fetchHomes();
    fetchSharedDevices();
  }, [isAuthenticated, router, fetchDevices, fetchHomes, fetchSharedDevices, user]);


  const handleDeviceToggle = async (deviceId: string, state: boolean) => {
    try {
      await updateDevice(deviceId, { power: state });
      toast.success(`Thiết bị đã được ${state ? 'bật' : 'tắt'}`);
    } catch (err) {
      console.error('Error toggling device:', err);
      toast.error('Không thể điều khiển thiết bị');
    }
  };

  const handleDeviceControl = async (deviceId: string, properties: Record<string, unknown>) => {
    try {
      await updateDevice(deviceId, properties);
      toast.success('Thiết bị đã được cập nhật');
    } catch (err) {
      console.error('Error controlling device:', err);
      toast.error('Không thể cập nhật thiết bị');
    }
  };

  const handleRunScene = async (sceneId: string) => {
    try {
      const response = await apiClient.runScene(sceneId);
      if (response.success) {
        toast.success('Kịch bản đã được thực thi');
      } else {
        toast.error('Lỗi khi thực thi kịch bản');
      }
    } catch (err) {
      console.error('Error running scene:', err);
      toast.error('Lỗi khi thực thi kịch bản');
    }
  };

  const handleRefresh = () => {
    setError(null);
    fetchDevices();
    fetchHomes();
    fetchSharedDevices();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const onlineDevices = devices.filter(d => d.online).length;
  const totalScenes = scenes.length;
  const activeScenes = scenes.filter(s => s.enabled).length;

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold gradient-text mb-2">🚀 Dashboard</h1>
              <p className="text-slate-700 text-xl">✨ Quản lý thiết bị thông minh của bạn ✨</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                🔄 Làm mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tổng thiết bị"
          value={devices.length}
          description="Thiết bị được kết nối"
          icon={Wifi}
          trend={{ value: 12, label: "so với tháng trước" }}
          status="info"
        />
        <StatsCard
          title="Đang hoạt động"
          value={onlineDevices}
          description="Thiết bị trực tuyến"
          icon={Activity}
          trend={{ value: 8, label: "tăng từ hôm qua" }}
          status="success"
        />
        <StatsCard
          title="Kịch bản"
          value={totalScenes}
          description="Kịch bản tự động"
          icon={Zap}
          trend={{ value: 3, label: "kịch bản mới" }}
          status="warning"
        />
        <StatsCard
          title="Thiết bị chia sẻ"
          value={sharedDevices.length}
          description="Được chia sẻ với người khác"
          icon={Users}
          status="info"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Thiết bị</TabsTrigger>
          <TabsTrigger value="scenes">Kịch bản</TabsTrigger>
          <TabsTrigger value="shared">Chia sẻ</TabsTrigger>
        </TabsList>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Thiết bị của bạn</h2>
            <Badge variant="outline" className="text-sm">
              {onlineDevices} / {devices.length} đang hoạt động
            </Badge>
          </div>

          {devices.length === 0 ? (
            <Card className="p-12 text-center">
              <WifiOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có thiết bị nào</h3>
              <p className="text-slate-500 mb-4">Hãy thêm thiết bị đầu tiên của bạn</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tải lại
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={handleDeviceToggle}
                  onControl={handleDeviceControl}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scenes Tab */}
        <TabsContent value="scenes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Kịch bản tự động</h2>
            <Badge variant="outline" className="text-sm">
              {activeScenes} / {totalScenes} đang hoạt động
            </Badge>
          </div>

          {scenes.length === 0 ? (
            <Card className="p-12 text-center">
              <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có kịch bản nào</h3>
              <p className="text-slate-500 mb-4">Tạo kịch bản đầu tiên để tự động hóa ngôi nhà</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tải lại
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  onRun={handleRunScene}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shared Devices Tab */}
        <TabsContent value="shared" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Thiết bị được chia sẻ</h2>
            <Badge variant="outline" className="text-sm">
              {sharedDevices.length} thiết bị
            </Badge>
          </div>

          {sharedDevices.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có thiết bị chia sẻ</h3>
              <p className="text-slate-500 mb-4">Các thiết bị được chia sẻ với bạn sẽ xuất hiện ở đây</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tải lại
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={handleDeviceToggle}
                  onControl={handleDeviceControl}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default DashboardPage;
