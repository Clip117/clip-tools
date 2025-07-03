/**
 * Tool card component for BentoGrid layout
 * 工具卡片组件，用于BentoGrid布局
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  className?: string;
  featured?: boolean;
}

export function ToolCard({ tool, className, featured = false }: ToolCardProps) {
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
            <div className="text-2xl mb-2">{tool.icon}</div>
            {tool.featured && (
              <Badge variant="secondary" className="text-xs">
                推荐
              </Badge>
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