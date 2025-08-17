/**
 * Tool Page Layout Component with Particle Background
 * 工具页面布局组件，包含粒子背景效果
 */

'use client';

import { ReactNode } from 'react';
import DotGrid from './DotGrid';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface ToolPageLayoutProps {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export default function ToolPageLayout({ 
  children, 
  className = '', 
  showBackButton = true 
}: ToolPageLayoutProps) {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Global DotGrid Background for Tool Pages */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1 
      }}>
        <DotGrid
          dotSize={3}
          gap={25}
          baseColor="#000000"
          activeColor="#ffffff"
          baseOpacity={0.15}
          activeOpacity={0.4}
          proximity={150}
          shockRadius={300}
          shockStrength={8}
          resistance={500}
          returnDuration={1.5}
        />
      </div>

      {/* Top gradient overlay for smooth transition */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-background via-background/80 to-transparent z-30 pointer-events-none" />
      
      {/* Bottom gradient overlay for smooth transition */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent z-30 pointer-events-none" />

      {/* Content with proper z-index */}
      <div className="relative z-40">
        {/* Back Button */}
        {showBackButton && (
          <div className="container mx-auto px-4 pt-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="mb-4 text-muted-foreground hover:text-foreground"
                style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
