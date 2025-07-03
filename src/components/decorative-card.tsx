/**
 * Decorative Card Component
 * 装饰性卡片组件
 */

'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { generateStableIcon, type DecorativeConfig } from '@/config/layout';

interface DecorativeCardProps {
  className?: string;
  config: DecorativeConfig;
  seed: string;
  index: number;
}

export function DecorativeCard({ 
  className, 
  config, 
  seed, 
  index 
}: DecorativeCardProps) {
  // 使用稳定的随机图标生成
  const stableIcon = useMemo(() => {
    return generateStableIcon(`${seed}-${index}`, config.icons);
  }, [seed, index, config.icons]);

  const message = useMemo(() => {
    // 预定义的提示文案
    const messages = [
      '更多工具即将到来',
      '敬请期待新功能',
      '工具箱持续扩展中',
      '更多惊喜等待发现'
    ];
    return messages[index % messages.length];
  }, [index]);

  return (
    <Card 
      className={cn(
        "h-full bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-muted-foreground/20 flex items-center justify-center group hover:from-muted/40 hover:to-muted/20 transition-all duration-300 cursor-default",
        className
      )}
      role="presentation"
      aria-label={`装饰性卡片，${message}`}
      tabIndex={-1}
    >
      <div className="text-center opacity-60 group-hover:opacity-80 transition-opacity">
        <div 
          className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200"
          role="img"
          aria-label={`装饰图标 ${stableIcon}`}
        >
          {stableIcon}
        </div>
        <p className="text-xs text-muted-foreground font-medium px-2">
          {message}
        </p>
      </div>
    </Card>
  );
}

// 高阶组件：带有错误边界的装饰卡片
export function SafeDecorativeCard(props: DecorativeCardProps) {
  try {
    return <DecorativeCard {...props} />;
  } catch (error) {
    console.warn('DecorativeCard render error:', error);
    return (
      <Card className={cn(
        "h-full bg-muted/20 border-dashed border-muted-foreground/10 flex items-center justify-center",
        props.className
      )}>
        <div className="text-center opacity-40">
          <div className="text-2xl mb-1">📦</div>
          <p className="text-xs text-muted-foreground">加载中...</p>
        </div>
      </Card>
    );
  }
}