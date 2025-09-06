
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Device } from '@/types';
import { Loader2 } from 'lucide-react';

type DevicePropertyValue = string | number | boolean;

interface DeviceControlModalProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (properties: Record<string, DevicePropertyValue>) => void;
}

const DeviceControlModal: React.FC<DeviceControlModalProps> = ({ device, isOpen, onClose, onSubmit }) => {
  const [currentProperties, setCurrentProperties] = useState<Record<string, DevicePropertyValue>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentProperties(device.properties);
      setIsLoading(false);
    }
  }, [isOpen, device.properties]);

  const handleChange = (key: string, value: DevicePropertyValue) => {
    setCurrentProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(currentProperties);
      onClose();
    } catch (error) {
      console.error('Error updating device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyLabel = (key: string): string => {
    const labels: Record<string, string> = {
      power: 'Nguồn',
      brightness: 'Độ sáng',
      temperature: 'Nhiệt độ',
      humidity: 'Độ ẩm',
      volume: 'Âm lượng',
      color: 'Màu sắc',
      speed: 'Tốc độ',
      mode: 'Chế độ'
    };
    return labels[key] || key;
  };

  const getSliderConfig = (key: string) => {
    const configs: Record<string, { min: number; max: number; step: number }> = {
      brightness: { min: 0, max: 100, step: 1 },
      temperature: { min: 0, max: 50, step: 1 },
      humidity: { min: 0, max: 100, step: 1 },
      volume: { min: 0, max: 100, step: 1 },
      speed: { min: 0, max: 100, step: 1 }
    };
    return configs[key] || { min: 0, max: 100, step: 1 };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] cyberpunk-glass">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cyan-300">
            Điều khiển {device.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Điều chỉnh các thuộc tính của thiết bị. Thay đổi sẽ được áp dụng ngay lập tức.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(currentProperties).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Không có thuộc tính nào để điều khiển
            </div>
          ) : (
            Object.entries(currentProperties).map(([key, value]) => {
              if (key === 'power' || typeof value === 'boolean') {
                return (
                  <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-cyan-500/20 bg-slate-900/50">
                    <Label 
                      htmlFor={key} 
                      className="text-sm font-medium text-slate-200 cursor-pointer"
                    >
                      {getPropertyLabel(key)}
                    </Label>
                    <Switch
                      id={key}
                      checked={Boolean(value)}
                      onCheckedChange={(checked) => handleChange(key, checked)}
                      disabled={isLoading}
                      aria-label={`Toggle ${getPropertyLabel(key)}`}
                    />
                  </div>
                );
              } else if (typeof value === 'number') {
                const config = getSliderConfig(key);
                return (
                  <div key={key} className="p-4 rounded-lg border border-cyan-500/20 bg-slate-900/50 space-y-3">
                    <Label htmlFor={key} className="text-sm font-medium text-slate-200">
                      {getPropertyLabel(key)}: {value}{key === 'temperature' ? '°C' : key === 'humidity' ? '%' : key === 'brightness' || key === 'volume' ? '%' : ''}
                    </Label>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Slider
                        id={key}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={[Number(value)]}
                        onValueChange={(val) => handleChange(key, val[0])}
                        className="col-span-3"
                        disabled={isLoading}
                        aria-label={`Adjust ${getPropertyLabel(key)}`}
                      />
                      <Input
                        type="number"
                        value={Number(value)}
                        onChange={(e) => handleChange(key, Number(e.target.value))}
                        className="col-span-1 h-8 text-center border-cyan-500/30 focus:border-cyan-400"
                        min={config.min}
                        max={config.max}
                        disabled={isLoading}
                        aria-label={`${getPropertyLabel(key)} value`}
                      />
                    </div>
                  </div>
                );
              } else if (typeof value === 'string' && key.toLowerCase().includes('color')) {
                return (
                  <div key={key} className="p-4 rounded-lg border border-cyan-500/20 bg-slate-900/50 space-y-3">
                    <Label htmlFor={key} className="text-sm font-medium text-slate-200">
                      {getPropertyLabel(key)}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id={key}
                        type="color"
                        value={String(value)}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-16 h-10 border-cyan-500/30 focus:border-cyan-400 cursor-pointer"
                        disabled={isLoading}
                        aria-label="Color picker"
                      />
                      <Input
                        type="text"
                        value={String(value)}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="flex-1 border-cyan-500/30 focus:border-cyan-400"
                        placeholder="#000000"
                        disabled={isLoading}
                        aria-label="Color hex value"
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
        
        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || Object.entries(currentProperties).length === 0}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceControlModal;


