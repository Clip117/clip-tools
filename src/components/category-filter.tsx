/**
 * Category filter component
 * 分类过滤组件
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TOOL_CATEGORIES_DATA } from '@/data/tools';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="h-8"
      >
        全部工具
      </Button>
      
      {TOOL_CATEGORIES_DATA.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="h-8"
        >
          {category.name}
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center",
              selectedCategory === category.id ? "bg-primary-foreground text-primary" : ""
            )}
          >
            {category.tools.length}
          </Badge>
        </Button>
      ))}
    </div>
  );
}