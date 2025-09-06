'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  Users,
  Home,
  Moon,
  Sun,
  Coffee,
  Shield
} from 'lucide-react';

interface SceneCardProps {
  scene: {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    homeId: string;
    type?: string;
    devices?: number;
  };
  onRun?: (sceneId: string) => void;
  onToggle?: (sceneId: string, enabled: boolean) => void;
  className?: string;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  onRun,
  onToggle,
  className
}) => {
  const getSceneIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('sleep') || nameLower.includes('ngủ')) return Moon;
    if (nameLower.includes('wake') || nameLower.includes('thức')) return Sun;
    if (nameLower.includes('coffee') || nameLower.includes('cà phê')) return Coffee;
    if (nameLower.includes('security') || nameLower.includes('bảo mật')) return Shield;
    if (nameLower.includes('home') || nameLower.includes('nhà')) return Home;
    return Zap;
  };

  const getSceneColor = (type?: string) => {
    const colorMap: Record<string, string> = {
      'sleep': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      'wake': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'security': 'text-red-600 bg-red-50 border-red-200',
      'entertainment': 'text-purple-600 bg-purple-50 border-purple-200',
      'default': 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colorMap[type || 'default'] || colorMap.default;
  };

  const Icon = getSceneIcon(scene.name);

  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-pointer focus:ring-2 focus:ring-purple-400 dark:bg-slate-900 dark:text-slate-100 animate-fade-in-up",
      getSceneColor(scene.type),
      className
    )} tabIndex={0}>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            getSceneColor(scene.type)
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {scene.name}
            </CardTitle>
            {scene.description && (
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                {scene.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant={scene.enabled ? "default" : "secondary"}
            className="text-xs animate-pulse"
          >
            {scene.enabled ? 'Hoạt động' : 'Tạm dừng'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scene info */}
  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{scene.devices || 0} thiết bị</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>2 phút</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            onClick={() => onRun?.(scene.id)}
            disabled={!scene.enabled}
          >
            <Play className="h-3 w-3 mr-1" />
            Chạy kịch bản
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:ring-2 focus:ring-purple-400"
            onClick={() => onToggle?.(scene.id, !scene.enabled)}
          >
            {scene.enabled ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
    </Card>
  );
};

export default SceneCard;
