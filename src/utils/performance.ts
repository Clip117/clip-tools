/**
 * Performance monitoring utilities
 * 性能监控工具
 */

import { PerformanceMetrics, LayoutAnalysis, LayoutRule } from '@/types/layout';
import { Tool } from '@/types/tools';

/** 性能监控类 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100; // 最多保存100条记录

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /** 开始性能测量 */
  startMeasure(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.addMetric({
        renderTime,
        componentCount: 0, // 将在组件中设置
        timestamp: Date.now()
      });
      
      // 开发环境下输出性能信息
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name} 渲染时间: ${renderTime.toFixed(2)}ms`);
      }
    };
  }

  /** 添加性能指标 */
  addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // 保持数组大小在限制内
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /** 获取平均渲染时间 */
  getAverageRenderTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const total = this.metrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return total / this.metrics.length;
  }

  /** 获取最近的性能指标 */
  getRecentMetrics(count = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }

  /** 清除所有指标 */
  clearMetrics(): void {
    this.metrics = [];
  }

  /** 获取性能报告 */
  getPerformanceReport(): {
    averageRenderTime: number;
    totalMeasurements: number;
    recentMetrics: PerformanceMetrics[];
  } {
    return {
      averageRenderTime: this.getAverageRenderTime(),
      totalMeasurements: this.metrics.length,
      recentMetrics: this.getRecentMetrics(5)
    };
  }
}

/** 布局分析器 */
export class LayoutAnalyzer {
  /** 分析布局配置 */
  static analyzeLayout(
    tools: Tool[], 
    decorativeCount: number,
    layoutRules: LayoutRule[]
  ): LayoutAnalysis {
    let largeCards = 0;
    let tallCards = 0;
    
    tools.forEach((tool, index) => {
      layoutRules.forEach(rule => {
        if (rule.condition(index, tool.featured || false)) {
          if (rule.classes.includes('col-span-2')) largeCards++;
          if (rule.classes.includes('row-span-2')) tallCards++;
        }
      });
    });
    
    const totalItems = tools.length + decorativeCount;
    const gridSize = 8; // 假设基础网格大小
    const gridUtilization = (totalItems / gridSize) * 100;
    
    return {
      totalItems,
      toolCards: tools.length,
      decorativeCards: decorativeCount,
      largeCards,
      tallCards,
      gridUtilization: Math.min(gridUtilization, 100)
    };
  }

  /** 优化建议 */
  static getOptimizationSuggestions(analysis: LayoutAnalysis): string[] {
    const suggestions: string[] = [];
    
    if (analysis.gridUtilization < 50) {
      suggestions.push('网格利用率较低，考虑增加更多工具或减少装饰卡片');
    }
    
    if (analysis.largeCards > analysis.toolCards * 0.3) {
      suggestions.push('大尺寸卡片过多，可能影响布局平衡');
    }
    
    if (analysis.decorativeCards > analysis.toolCards * 0.5) {
      suggestions.push('装饰卡片过多，建议减少数量以突出工具内容');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('布局配置良好，无需优化');
    }
    
    return suggestions;
  }
}

/** 内存使用监控 */
export class MemoryMonitor {
  /** 获取内存使用情况 */
  static getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      // @ts-expect-error - performance.memory 在某些浏览器中可用
      return performance.memory?.usedJSHeapSize;
    }
    return undefined;
  }

  /** 监控内存泄漏 */
  static detectMemoryLeaks(): boolean {
    const usage = this.getMemoryUsage();
    if (!usage) return false;
    
    // 简单的内存泄漏检测逻辑
    const threshold = 50 * 1024 * 1024; // 50MB
    return usage > threshold;
  }
}

/** 防抖函数 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/** 节流函数 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/** 性能优化的 Hook 工厂 */
export function createPerformanceHook(componentName: string) {
  return function usePerformanceMonitoring() {
    const monitor = PerformanceMonitor.getInstance();
    
    const startMeasure = () => monitor.startMeasure(componentName);
    const getReport = () => monitor.getPerformanceReport();
    
    return { startMeasure, getReport };
  };
}