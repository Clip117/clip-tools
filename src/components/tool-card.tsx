/**
 * Tool card component for BentoGrid layout
 * 工具卡片组件，用于BentoGrid布局
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShinyText from '@/components/ShinyText';
import { Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  className?: string;
  featured?: boolean;
}

export function ToolCard({ tool, className, featured = false }: ToolCardProps) {
  const IconComponent = tool.icon;
  
  return (
    <Link href={tool.path} className="block group">
      <Card 
        className={cn(
          "h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-muted",
          "group-hover:border-primary/20",
          featured && "border-primary/30 bg-gradient-to-br from-background to-muted/20",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl mb-2">
              <IconComponent 
                className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" 
              />
            </div>
            {tool.featured && (
              <div className="px-2 py-1 bg-secondary rounded-md flex items-center justify-center">
                <ShinyText 
                  text="推荐" 
                  disabled={false} 
                  speed={3} 
                  className="text-xs font-medium"
                />
              </div>
            )}
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {tool.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}