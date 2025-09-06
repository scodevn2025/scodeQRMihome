'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  status = 'info',
  className
}) => {
  const statusColors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer",
      statusColors[status],
      className
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
      <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full animate-bounce delay-500"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">
          {title}
        </CardTitle>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300",
          iconColors[status]
        )}>
          <Icon className="h-5 w-5 group-hover:animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors duration-300">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-500 mb-2 group-hover:text-slate-600 transition-colors duration-300">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center space-x-1">
            <Badge 
              variant={trend.value > 0 ? "default" : "secondary"}
              className="text-xs animate-pulse"
            >
              {trend.value > 0 ? '📈' : '📉'} {trend.value > 0 ? '+' : ''}{trend.value}%
            </Badge>
            <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Card>
  );
};

export default StatsCard;
