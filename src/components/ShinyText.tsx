/**
 * ShinyText component with shimmer effect
 * 带闪烁效果的文字组件
 */

'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({ 
  text, 
  disabled = false, 
  speed = 3, 
  className 
}: ShinyTextProps) {
  useEffect(() => {
    // 添加动画样式到head
    if (!document.getElementById('shimmer-keyframes')) {
      const style = document.createElement('style');
      style.id = 'shimmer-keyframes';
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-primary via-primary/60 to-primary bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        animation: `shimmer ${speed}s ease-in-out infinite`,
      }}
    >
      {text}
    </span>
  );
}
