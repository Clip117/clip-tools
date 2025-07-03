/**
 * BentoGrid performance monitoring hook
 * BentoGrid性能监控Hook
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { PerformanceMonitor, LayoutAnalyzer, MemoryMonitor } from '@/utils/performance';
import { Tool } from '@/types/tools';
import { LayoutAnalysis, PerformanceMetrics } from '@/types/layout';

interface UseBentoGridPerformanceOptions {
  /** 是否启用性能监控 */
  enabled?: boolean;
  /** 是否在开发环境下输出日志 */
  enableLogging?: boolean;
  /** 性能阈值（毫秒） */
  performanceThreshold?: number;
  /** 内存监控间隔（毫秒） */
  memoryCheckInterval?: number;
}

interface BentoGridPerformanceResult {
  /** 开始性能测量 */
  startMeasure: () => () => void;
  /** 获取性能报告 */
  getPerformanceReport: () => ReturnType<PerformanceMonitor['getPerformanceReport']>;
  /** 分析布局 */
  analyzeLayout: (tools: Tool[], decorativeCount: number) => LayoutAnalysis;
  /** 获取优化建议 */
  getOptimizationSuggestions: (analysis: LayoutAnalysis) => string[];
  /** 当前性能指标 */
  currentMetrics: PerformanceMetrics | null;
  /** 是否存在性能问题 */
  hasPerformanceIssues: boolean;
  /** 内存使用情况 */
  memoryUsage: number | undefined;
}

export function useBentoGridPerformance(
  options: UseBentoGridPerformanceOptions = {}
): BentoGridPerformanceResult {
  const {
    enabled = process.env.NODE_ENV === 'development',
    enableLogging = process.env.NODE_ENV === 'development',
    performanceThreshold = 16, // 60fps = 16.67ms per frame
    memoryCheckInterval = 5000
  } = options;

  const performanceMonitor = useMemo(() => PerformanceMonitor.getInstance(), []);
  const currentMetricsRef = useRef<PerformanceMetrics | null>(null);
  const memoryUsageRef = useRef<number | undefined>(undefined);
  const hasPerformanceIssuesRef = useRef(false);

  // 内存监控
  useEffect(() => {
    if (!enabled) return;

    const checkMemory = () => {
      const usage = MemoryMonitor.getMemoryUsage();
      memoryUsageRef.current = usage;
      
      if (MemoryMonitor.detectMemoryLeaks()) {
        if (enableLogging) {
          console.warn('🚨 检测到潜在的内存泄漏');
        }
      }
    };

    const interval = setInterval(checkMemory, memoryCheckInterval);
    checkMemory(); // 立即执行一次

    return () => clearInterval(interval);
  }, [enabled, enableLogging, memoryCheckInterval]);

  // 开始性能测量
  const startMeasure = useCallback(() => {
    if (!enabled) {
      return () => {}; // 返回空函数
    }

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      const metrics: PerformanceMetrics = {
        renderTime,
        componentCount: 1, // BentoGrid组件
        memoryUsage: memoryUsageRef.current,
        timestamp: Date.now()
      };
      
      currentMetricsRef.current = metrics;
      performanceMonitor.addMetric(metrics);
      
      // 检查性能问题
      hasPerformanceIssuesRef.current = renderTime > performanceThreshold;
      
      if (enableLogging) {
        if (hasPerformanceIssuesRef.current) {
          console.warn(
            `⚠️ BentoGrid渲染时间过长: ${renderTime.toFixed(2)}ms (阈值: ${performanceThreshold}ms)`
          );
        } else {
          console.log(`✅ BentoGrid渲染时间: ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  }, [enabled, enableLogging, performanceThreshold, performanceMonitor]);

  // 获取性能报告
  const getPerformanceReport = useCallback(() => {
    return performanceMonitor.getPerformanceReport();
  }, [performanceMonitor]);

  // 分析布局
  const analyzeLayout = useCallback(
    (tools: Tool[], decorativeCount: number) => {
      // 简化的布局规则用于分析
      const layoutRules = [
        {
          condition: (index: number, featured: boolean) => featured && index % 7 === 0,
          classes: 'md:col-span-2'
        },
        {
          condition: (index: number, featured: boolean) => featured && index % 5 === 0,
          classes: 'md:row-span-1'
        }
      ];
      
      return LayoutAnalyzer.analyzeLayout(tools, decorativeCount, layoutRules);
    },
    []
  );

  // 获取优化建议
  const getOptimizationSuggestions = useCallback(
    (analysis: LayoutAnalysis) => {
      const suggestions = LayoutAnalyzer.getOptimizationSuggestions(analysis);
      
      // 添加性能相关的建议
      const avgRenderTime = performanceMonitor.getAverageRenderTime();
      if (avgRenderTime > performanceThreshold) {
        suggestions.push(
          `平均渲染时间 ${avgRenderTime.toFixed(2)}ms 超过阈值，考虑减少组件复杂度`
        );
      }
      
      if (analysis.totalItems > 20) {
        suggestions.push('网格项目过多，考虑实现虚拟滚动或分页');
      }
      
      return suggestions;
    },
    [performanceMonitor, performanceThreshold]
  );

  return {
    startMeasure,
    getPerformanceReport,
    analyzeLayout,
    getOptimizationSuggestions,
    currentMetrics: currentMetricsRef.current,
    hasPerformanceIssues: hasPerformanceIssuesRef.current,
    memoryUsage: memoryUsageRef.current
  };
}

// 性能调试Hook
export function useBentoGridDebug() {
  const performance = useBentoGridPerformance({
    enabled: true,
    enableLogging: true,
    performanceThreshold: 10 // 更严格的阈值用于调试
  });

  // 在控制台暴露调试方法
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__bentoGridDebug = {
        getReport: performance.getPerformanceReport,
        getCurrentMetrics: () => performance.currentMetrics,
        hasIssues: () => performance.hasPerformanceIssues,
        getMemoryUsage: () => performance.memoryUsage
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__bentoGridDebug;
      }
    };
  }, [performance]);

  return performance;
}

// 性能优化建议Hook
export function useBentoGridOptimization(tools: Tool[], decorativeCount: number) {
  const { analyzeLayout, getOptimizationSuggestions } = useBentoGridPerformance();
  
  const analysis = useMemo(
    () => analyzeLayout(tools, decorativeCount),
    [analyzeLayout, tools, decorativeCount]
  );
  
  const suggestions = useMemo(
    () => getOptimizationSuggestions(analysis),
    [getOptimizationSuggestions, analysis]
  );
  
  return {
    analysis,
    suggestions,
    isOptimal: suggestions.length === 1 && suggestions[0].includes('布局配置良好')
  };
}