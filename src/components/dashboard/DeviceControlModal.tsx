
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Device } from '@/types';

interface DeviceControlModalProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (properties: Record<string, unknown>) => void;
}

const DeviceControlModal: React.FC<DeviceControlModalProps> = ({ device, isOpen, onClose, onSubmit }) => {
  const [currentProperties, setCurrentProperties] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (isOpen) {
      setCurrentProperties(device.properties);
    }
  }, [isOpen, device.properties]);

  const handleChange = (key: string, value: unknown) => {
    setCurrentProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(currentProperties);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Điều khiển {device.name}</DialogTitle>
          <DialogDescription>
            Điều chỉnh các thuộc tính của thiết bị.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(currentProperties).map(([key, value]) => {
            if (key === 'power') {
              return (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key === 'power' ? 'Nguồn' : key}</Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => handleChange(key, checked)}
                  />
                </div>
              );
            } else if (typeof value === 'number') {
              return (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="col-span-1">
                    {key === 'brightness' ? 'Độ sáng' : key === 'temperature' ? 'Nhiệt độ' : key === 'humidity' ? 'Độ ẩm' : key === 'volume' ? 'Âm lượng' : key}
                  </Label>
                  <Slider
                    id={key}
                    min={0}
                    max={key === 'temperature' ? 50 : key === 'humidity' ? 100 : key === 'brightness' ? 100 : key === 'volume' ? 100 : 100}
                    step={1}
                    value={[value]}
                    onValueChange={(val) => handleChange(key, val[0])}
                    className="col-span-2"
                  />
                  <Input
                    id={key}
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                    className="col-span-1"
                  />
                </div>
              );
            } else if (typeof value === 'string' && key.toLowerCase().includes('color')) {
              return (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="col-span-1">Màu sắc</Label>
                  <Input
                    id={key}
                    type="color"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="col-span-3 h-10"
                  />
                </div>
              );
            } else if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key}</Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => handleChange(key, checked)}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceControlModal;


