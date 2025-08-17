/**
 * Layout configuration for BentoGrid component
 * BentoGrid组件的布局配置
 */

import { LucideIcon } from 'lucide-react';
import { 
  Palette, 
  Zap, 
  Settings, 
  Lightbulb, 
  Rocket, 
  Sparkles, 
  Target, 
  Flame,
  Gem, 
  Star, 
  Tent, 
  Drama, 
  Music, 
  Clapperboard, 
  Smartphone, 
  Hexagon,
  Dice1, 
  PartyPopper, 
  Heart, 
  Gift, 
  Rainbow, 
  StarIcon, 
  Sparkle, 
  Sun
} from 'lucide-react';

export interface LayoutRule {
  condition: (index: number) => boolean;
  classes: string;
  priority: number;
}

export interface DecorativeConfig {
  enabled: boolean;
  maxCount: number;
  icons: LucideIcon[];
  fillStrategy: 'auto' | 'fixed';
}

export interface BentoGridConfig {
  layoutRules: LayoutRule[];
  decorativeConfig: DecorativeConfig;
  responsive: {
    breakpoints: Record<string, string>;
    gridCols: Record<string, number>;
  };
}

// 默认布局配置
export const DEFAULT_LAYOUT_CONFIG: BentoGridConfig = {
  layoutRules: [
    {
      condition: (index: number) => index % 8 === 0,
      classes: 'md:col-span-2',
      priority: 1
    },
    {
      condition: (index: number) => index % 5 === 0,
      classes: 'md:row-span-1',
      priority: 2
    }
  ],
  decorativeConfig: {
    enabled: true,
    maxCount: 50, // 设置一个较大的默认值，实际数量由页面逻辑动态控制
    fillStrategy: 'auto',
    icons: [
      Palette, Zap, Settings, Lightbulb, Rocket, Sparkles, Target, Flame,
      Gem, Star, Tent, Drama, Music, Clapperboard, Smartphone, Hexagon,
      Dice1, PartyPopper, Heart, Gift, Rainbow, StarIcon, Sparkle, Sun
    ]
  },
  responsive: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    gridCols: {
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4
    }
  }
};

// 生成稳定的随机图标
export const generateStableIcon = (seed: string, icons: LucideIcon[]): LucideIcon => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return icons[Math.abs(hash) % icons.length];
};



// 计算布局类名
export const calculateLayoutClasses = (
  index: number,
  isFeatured: boolean,
  rules: LayoutRule[]
): string => {
  if (isFeatured) {
    // 使用布局规则
    return rules
      .filter(rule => rule.condition(index))
      .sort((a, b) => a.priority - b.priority)
      .map(rule => rule.classes)
      .join(' ');
  }
  
  return '';
};