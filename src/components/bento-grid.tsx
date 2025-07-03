/**
 * BentoGrid layout component
 * BentoGrid布局组件 - 优化版本
 */

'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { Tool } from '@/types/tools';
import { ToolCard } from './tool-card';
import { SafeDecorativeCard } from './decorative-card';
import { cn } from '@/lib/utils';
import { 
  DEFAULT_LAYOUT_CONFIG, 
  calculateLayoutClasses,
  type BentoGridConfig 
} from '@/config/layout';
import { useBentoGridPerformance } from '@/hooks/use-bento-grid-performance';

interface BentoGridProps {
  tools: Tool[];
  className?: string;
  config?: Partial<BentoGridConfig>;
  showDecorative?: boolean;
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean;
  /** 性能阈值（毫秒） */
  performanceThreshold?: number;
  /** 错误边界回调 */
  onError?: (error: Error) => void;
}



export function BentoGrid({ 
  tools, 
  className, 
  config: userConfig,
  showDecorative = true,
  enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
  performanceThreshold = 16,
  onError
}: BentoGridProps) {
  // 性能监控
  const {
    startMeasure,
    analyzeLayout,
    getOptimizationSuggestions,
    hasPerformanceIssues
  } = useBentoGridPerformance({
    enabled: enablePerformanceMonitoring || false,
    performanceThreshold
  });
  // 错误处理
  const handleError = useCallback((error: Error) => {
    console.error('BentoGrid Error:', error);
    onError?.(error);
  }, [onError]);

  // 合并用户配置和默认配置
  const config = useMemo(() => {
    try {
      return {
        ...DEFAULT_LAYOUT_CONFIG,
        ...userConfig,
        decorativeConfig: {
          ...DEFAULT_LAYOUT_CONFIG.decorativeConfig,
          ...userConfig?.decorativeConfig
        }
      };
    } catch (error) {
      handleError(error as Error);
      return DEFAULT_LAYOUT_CONFIG;
    }
  }, [userConfig, handleError]);

  // 生成网格项目
  const gridItems = useMemo(() => {
    const endMeasure = startMeasure();
    
    try {
      const items = [];
      
      // 验证工具数据
      const validTools = tools.filter(tool => 
        tool && 
        typeof tool.id === 'string' && 
        typeof tool.name === 'string'
      );
      
      if (validTools.length !== tools.length) {
        console.warn(`过滤了 ${tools.length - validTools.length} 个无效工具`);
      }
      
      // 添加工具卡片
      validTools.forEach((tool, index) => {
        try {
          const layoutClasses = calculateLayoutClasses(
          index,
          tool.featured || false,
          config.layoutRules
        );
          
          items.push(
            <div
              key={tool.id}
              className={cn(
                "min-h-[120px]",
                layoutClasses
              )}
              role="gridcell"
              aria-label={`工具: ${tool.name}`}
            >
              <ToolCard 
                tool={tool} 
                featured={tool.featured}
                className="h-full"
              />
            </div>
          );
        } catch (error) {
          console.error(`渲染工具卡片失败: ${tool.id}`, error);
        }
      });
      
      // 添加装饰性卡片
      if (showDecorative && config.decorativeConfig?.enabled) {
        const { maxCount, fillStrategy } = config.decorativeConfig;
        let decorativeCount = 0;
        
        if (fillStrategy === 'auto') {
          // 智能计算装饰卡片数量，基于当前行剩余空间
          const gridCols = 4; // 默认4列网格
          let occupiedCols = 0;
          
          // 计算所有工具卡片占用的总列数
          validTools.forEach((tool, index) => {
            const layoutClasses = calculateLayoutClasses(
              index,
              tool.featured || false,
              config.layoutRules
            );
            // 检查是否有col-span-2类
             if (layoutClasses.includes('col-span-2')) {
               occupiedCols += 2;
             } else {
               occupiedCols += 1;
             }
          });
          
          // 计算当前行已占用的列数
          const currentRowOccupied = occupiedCols % gridCols;
          // 计算剩余列数
          const remainingCols = currentRowOccupied === 0 ? 0 : gridCols - currentRowOccupied;
          
          // 装饰卡片数量不超过剩余空间，且不超过工具数量的1/4
          const maxDecorativeByTools = Math.ceil(validTools.length / 4);
          decorativeCount = Math.min(maxCount, remainingCols, maxDecorativeByTools);
        } else {
          // 基于工具数量动态计算装饰卡片数量，约为工具数量的1/4
          const dynamicMaxCount = Math.ceil(validTools.length / 4);
          decorativeCount = Math.min(maxCount, dynamicMaxCount);
        }
        
        for (let i = 0; i < decorativeCount; i++) {
          try {
            items.push(
              <div 
                key={`decorative-${i}`} 
                className="min-h-[120px]"
                role="gridcell"
                aria-label="装饰卡片"
              >
                <SafeDecorativeCard 
                  config={config.decorativeConfig}
                  seed={`bento-grid-${validTools.length}`}
                  index={i}
                />
              </div>
            );
          } catch (error) {
            console.error(`渲染装饰卡片失败: ${i}`, error);
          }
        }
      }
      
      return items;
    } catch (error) {
      handleError(error as Error);
      return [];
    } finally {
      endMeasure();
    }
  }, [tools, config, showDecorative, startMeasure, handleError]);

  // 响应式网格类名
  const gridClasses = useMemo(() => {
    try {
      const { gridCols } = config.responsive;
      return cn(
        "grid gap-4 auto-rows-fr",
        `grid-cols-${gridCols.sm}`,
        `md:grid-cols-${gridCols.md}`,
        `lg:grid-cols-${gridCols.lg}`,
        `xl:grid-cols-${gridCols.xl}`
      );
    } catch (error) {
      handleError(error as Error);
      return "grid gap-4 auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  }, [config.responsive, handleError]);

  // 性能分析和优化建议（仅在开发环境）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && enablePerformanceMonitoring) {
      const decorativeCount = showDecorative && config.decorativeConfig?.enabled 
        ? config.decorativeConfig.maxCount 
        : 0;
      
      const analysis = analyzeLayout(tools, decorativeCount);
      const suggestions = getOptimizationSuggestions(analysis);
      
      if (suggestions.length > 1 || hasPerformanceIssues) {
        console.group('🔍 BentoGrid 性能分析');
        console.log('布局分析:', analysis);
        console.log('优化建议:', suggestions);
        if (hasPerformanceIssues) {
          console.warn('检测到性能问题');
        }
        console.groupEnd();
      }
    }
  }, [tools, config, showDecorative, enablePerformanceMonitoring, analyzeLayout, getOptimizationSuggestions, hasPerformanceIssues]);

  return (
    <div 
      className={cn(
        gridClasses, 
        className,
        hasPerformanceIssues && process.env.NODE_ENV === 'development' && "ring-2 ring-yellow-500 ring-opacity-50"
      )}
      role="grid"
      aria-label="工具网格布局"
      aria-rowcount={Math.ceil(gridItems.length / 4)}
      aria-colcount={4}
      data-testid="bento-grid"
    >
      {gridItems.length > 0 ? gridItems : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          暂无工具可显示
        </div>
      )}
    </div>
  );
}