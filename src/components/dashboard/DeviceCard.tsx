'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
  Wifi, 
  WifiOff, 
  Settings, 
  Battery, 
  Thermometer,
  Droplets,
  Lightbulb,
  Shield,
  Smartphone,
  Tv,
  Speaker,
  Camera,
  Home
} from 'lucide-react';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    type: string;
    model: string;
    online: boolean;
    properties: Record<string, unknown>;
    homeId?: string;
  };
  onToggle?: (deviceId: string, state: boolean) => void;
  onControl?: (deviceId: string, properties: Record<string, unknown>) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  onControl,
  className,
  style
}) => {
  const [loading, setLoading] = React.useState(false);
  const getDeviceIcon = (type: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'light': Lightbulb,
      'switch': Settings,
      'sensor': Thermometer,
      'camera': Camera,
      'speaker': Speaker,
      'tv': Tv,
      'phone': Smartphone,
      'security': Shield,
      'purifier': Droplets,
      'default': Home
    };
    return iconMap[type.toLowerCase()] || iconMap.default;
  };

  const getStatusColor = (online: boolean) => {
    return online ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'light': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'switch': 'text-blue-600 bg-blue-50 border-blue-200',
      'sensor': 'text-green-600 bg-green-50 border-green-200',
      'camera': 'text-purple-600 bg-purple-50 border-purple-200',
      'speaker': 'text-pink-600 bg-pink-50 border-pink-200',
      'tv': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      'phone': 'text-gray-600 bg-gray-50 border-gray-200',
      'security': 'text-red-600 bg-red-50 border-red-200',
      'purifier': 'text-cyan-600 bg-cyan-50 border-cyan-200',
      'default': 'text-slate-600 bg-slate-50 border-slate-200'
    };
    return colorMap[type.toLowerCase()] || colorMap.default;
  };

  const Icon = getDeviceIcon(device.type);
  const isPowerOn = Boolean(device.properties?.power || device.properties?.on);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-pointer focus:ring-2 focus:ring-pink-400 dark:bg-slate-900 dark:text-slate-100",
        getStatusColor(device.online),
        className
      )}
      style={style}
      tabIndex={0}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
      <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-bounce delay-300"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse",
            getTypeColor(device.type)
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
              {device.name}
            </CardTitle>
            <p className="text-xs text-slate-500 capitalize group-hover:text-slate-600 transition-colors duration-300">
              {device.type} • {device.model}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant={device.online ? "default" : "secondary"}
            className="text-xs animate-pulse"
          >
            {device.online ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                🟢 Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                🔴 Offline
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Power control */}
        {device.type === 'light' || device.type === 'switch' ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {isPowerOn ? 'Bật' : 'Tắt'}
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={isPowerOn}
                onCheckedChange={async (checked) => {
                  setLoading(true);
                  try {
                    await onToggle?.(device.id, checked);
                  } finally {
                    setLoading(false);
                  }
                }}
                    setLoading(false);
                  }
                }}
                disabled={!device.online || loading}
              />
              {loading && <span className="animate-spin h-4 w-4 border-b-2 border-pink-500 rounded-full"></span>}
            </div>
          </div>
        ) : null}

        {/* Device properties */}
        <div className="space-y-2">
          {typeof device.properties?.brightness === 'number' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Độ sáng</span>
              <span className="font-medium">{device.properties.brightness as number}%</span>
            </div>
          )}
          {typeof device.properties?.temperature === 'number' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Nhiệt độ</span>
              <span className="font-medium">{device.properties.temperature as number}°C</span>
            </div>
          )}
          {typeof device.properties?.humidity === 'number' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Độ ẩm</span>
              <span className="font-medium">{device.properties.humidity as number}%</span>
            </div>
          )}
          {typeof device.properties?.battery === 'number' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Pin</span>
              <div className="flex items-center space-x-1">
                <Battery className="h-3 w-3" />
                <span className="font-medium">{device.properties.battery as number}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={async () => {
              setLoading(true);
              try {
                await onControl?.(device.id, {});
              } finally {
                setLoading(false);
              }
            }}
              await onControl?.(device.id, {});
              setTimeout(() => setLoading(false), 500);
            }}
            disabled={!device.online || loading}
          >
            <Settings className="h-3 w-3 mr-1" />
            {loading ? 'Đang xử lý...' : 'Điều khiển'}
          </Button>
        </div>
      </CardContent>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
    </Card>
  );
};

export default DeviceCard;