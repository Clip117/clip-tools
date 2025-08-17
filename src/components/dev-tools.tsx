/**
 * Development tools for BentoGrid
 * BentoGrid开发者工具
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Tool } from '@/types/tools';
import { useBentoGridPerformance, useBentoGridOptimization } from '@/hooks/use-bento-grid-performance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevToolsProps {
  tools: Tool[];
  decorativeCount: number;
  className?: string;
}

export function DevTools({ tools, decorativeCount, className }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    getPerformanceReport,
    currentMetrics,
    hasPerformanceIssues,
    memoryUsage
  } = useBentoGridPerformance();
  
  const { analysis, suggestions, isOptimal } = useBentoGridOptimization(tools, decorativeCount);
  
  const [performanceReport, setPerformanceReport] = useState(getPerformanceReport());
  
  // 定期更新性能报告
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceReport(getPerformanceReport());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPerformanceReport]);
  
  // 仅在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const formatMemory = (bytes?: number) => {
    if (!bytes) return 'N/A';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };
  
  const getPerformanceStatus = () => {
    if (hasPerformanceIssues) return { icon: AlertTriangle, color: 'destructive', text: '性能问题' };
    if (isOptimal) return { icon: CheckCircle, color: 'success', text: '性能良好' };
    return { icon: Activity, color: 'warning', text: '一般' };
  };
  
  const status = getPerformanceStatus();
  const StatusIcon = status.icon;
  
  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "shadow-lg backdrop-blur-sm bg-background/80 border-2",
            status.color === 'destructive' && "border-red-500 text-red-600",
            status.color === 'success' && "border-green-500 text-green-600",
            status.color === 'warning' && "border-yellow-500 text-yellow-600"
          )}
        >
          <StatusIcon className="w-4 h-4 mr-2" />
          Dev Tools
          {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
        </Button>
        
        {isOpen && (
          <div className="mt-2">
          <Card className="w-80 shadow-xl backdrop-blur-sm bg-background/95">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  BentoGrid 性能监控
                </span>
                <Badge variant={status.color === 'destructive' ? 'destructive' : 'secondary'}>
                  {status.text}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* 实时性能指标 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="text-muted-foreground">当前渲染时间</div>
                  <div className={cn(
                    "font-mono font-semibold",
                    currentMetrics && currentMetrics.renderTime > 16 ? "text-red-600" : "text-green-600"
                  )}>
                    {currentMetrics ? `${currentMetrics.renderTime.toFixed(2)}ms` : 'N/A'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground">平均渲染时间</div>
                  <div className={cn(
                    "font-mono font-semibold",
                    performanceReport.averageRenderTime > 16 ? "text-red-600" : "text-green-600"
                  )}>
                    {performanceReport.averageRenderTime.toFixed(2)}ms
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground">内存使用</div>
                  <div className="font-mono font-semibold text-blue-600">
                    {formatMemory(memoryUsage)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground">测量次数</div>
                  <div className="font-mono font-semibold">
                    {performanceReport.totalMeasurements}
                  </div>
                </div>
              </div>
              
              {/* 布局分析 */}
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-2">布局分析</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>工具卡片: <span className="font-semibold">{analysis.toolCards}</span></div>
                  <div>装饰卡片: <span className="font-semibold">{analysis.decorativeCards}</span></div>
                  <div>大尺寸卡片: <span className="font-semibold">{analysis.largeCards}</span></div>
                  <div>高尺寸卡片: <span className="font-semibold">{analysis.tallCards}</span></div>
                  <div className="col-span-2">
                    网格利用率: <span className={cn(
                      "font-semibold",
                      analysis.gridUtilization > 80 ? "text-green-600" : 
                      analysis.gridUtilization > 50 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {analysis.gridUtilization.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 优化建议 */}
              {suggestions.length > 0 && (
                <div className="border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full justify-between p-0 h-auto font-medium text-sm"
                  >
                    优化建议 ({suggestions.length})
                    {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  
                  {showDetails && (
                    <div className="mt-2 space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={cn(
                            "text-xs p-2 rounded border-l-2",
                            suggestion.includes('良好') 
                              ? "bg-green-50 border-green-500 text-green-700"
                              : suggestion.includes('过多') || suggestion.includes('超过')
                              ? "bg-red-50 border-red-500 text-red-700"
                              : "bg-yellow-50 border-yellow-500 text-yellow-700"
                          )}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* 操作按钮 */}
              <div className="border-t pt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('� 完整性能报告:', {
                      performanceReport,
                      currentMetrics,
                      analysis,
                      suggestions,
                      memoryUsage
                    });
                  }}
                  className="flex-1 text-xs"
                >
                  导出报告
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // 清除性能数据
                    const monitor = (window as Window & { __bentoGridDebug?: unknown }).__bentoGridDebug;
                    if (monitor) {
                      console.log('清除性能数据');
                    }
                  }}
                  className="flex-1 text-xs"
                >
                  清除数据
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// 简化版本的开发者工具
export function SimpleDevTools({ }: Omit<DevToolsProps, 'className'>) {
  const { hasPerformanceIssues, currentMetrics } = useBentoGridPerformance();
  
  if (process.env.NODE_ENV !== 'development' || !hasPerformanceIssues) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="destructive" className="animate-pulse">
        <AlertTriangle className="w-3 h-3 mr-1" />
        性能警告: {currentMetrics?.renderTime.toFixed(2)}ms
      </Badge>
    </div>
  );
}