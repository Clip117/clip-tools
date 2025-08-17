/**
 * Search box component for tools
 * 工具搜索框组件
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tool } from '@/types/tools';
import { TOOLS } from '@/data/tools';
import Link from 'next/link';

interface SearchBoxProps {
  onSearchResults?: (results: Tool[]) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
}

export function SearchBox({ 
  onSearchResults, 
  placeholder = "搜索工具...", 
  className,
  showResults = true 
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 搜索逻辑
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.category.toLowerCase().includes(searchTerm)
    ).slice(0, 8); // 限制显示8个结果
  }, [query]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    if (onSearchResults) {
      const results = value.trim() ? searchResults : TOOLS;
      onSearchResults(results);
    }
  };

  // 清空搜索
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    if (onSearchResults) {
      onSearchResults(TOOLS);
    }
  };

  // 选择工具
  const selectTool = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {showResults && isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              找到 {searchResults.length} 个工具
            </div>
            {searchResults.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                onClick={selectTool}
                className="block p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <tool.icon className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{tool.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {showResults && isOpen && query && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-4 text-center text-muted-foreground text-sm">
            未找到相关工具
          </div>
        </div>
      )}
    </div>
  );
}