/**
 * Layout configuration types
 * 布局配置类型定义
 */

export interface LayoutRule {
  /** 条件函数 - 决定是否应用此规则 */
  condition: (index: number, featured: boolean) => boolean;
  /** 应用的CSS类名 */
  classes: string;
  /** 规则描述 */
  description?: string;
}

export interface ResponsiveConfig {
  /** 不同断点下的网格列数 */
  gridCols: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** 断点值 */
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface DecorativeConfig {
  /** 是否启用装饰卡片 */
  enabled: boolean;
  /** 最大装饰卡片数量 */
  maxCount: number;
  /** 填充策略 */
  fillStrategy: 'auto' | 'fixed';
  /** 可用图标列表 */
  icons: string[];
  /** 提示文案列表 */
  messages: string[];
  /** 动画配置 */
  animation: {
    enabled: boolean;
    duration: string;
    easing: string;
  };
}

export interface BentoGridConfig {
  /** 布局规则 */
  layoutRules: LayoutRule[];
  /** 响应式配置 */
  responsive: ResponsiveConfig;
  /** 装饰卡片配置 */
  decorativeConfig: DecorativeConfig;
}

/** 装饰卡片属性 */
export interface DecorativeCardProps {
  /** 配置对象 */
  config: DecorativeConfig;
  /** 随机种子 */
  seed: string;
  /** 索引 */
  index: number;
  /** 额外的CSS类名 */
  className?: string;
}

/** 性能监控数据 */
export interface PerformanceMetrics {
  /** 渲染时间 */
  renderTime: number;
  /** 组件数量 */
  componentCount: number;
  /** 内存使用 */
  memoryUsage?: number;
  /** 时间戳 */
  timestamp: number;
}

/** 布局分析结果 */
export interface LayoutAnalysis {
  /** 总网格项目数 */
  totalItems: number;
  /** 工具卡片数 */
  toolCards: number;
  /** 装饰卡片数 */
  decorativeCards: number;
  /** 大尺寸卡片数 */
  largeCards: number;
  /** 高尺寸卡片数 */
  tallCards: number;
  /** 网格利用率 */
  gridUtilization: number;
}