/**
 * CLIP Tools Homepage
 * CLIP工具站首页
 */

'use client';

import { useState, useMemo } from 'react';
import { BentoGrid } from '@/components/bento-grid';
import { CategoryFilter } from '@/components/category-filter';
import { DevTools, SimpleDevTools } from '@/components/dev-tools';
import { TOOLS, getFeaturedTools, getToolsByCategory } from '@/data/tools';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_LAYOUT_CONFIG, calculateLayoutClasses } from '@/config/layout';
import { SearchBox } from '@/components/search-box';
import { Tool } from '@/types/tools';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 使用 useMemo 优化工具数据计算
  const featuredTools = useMemo(() => getFeaturedTools(), []);
  const displayTools = useMemo(() => {
    if (isSearching) return searchResults;
    return selectedCategory 
      ? getToolsByCategory(selectedCategory)
      : TOOLS;
  }, [selectedCategory, searchResults, isSearching]);
  
  // 处理搜索结果
  const handleSearchResults = (results: Tool[]) => {
    setSearchResults(results);
    const isNewSearching = results.length !== TOOLS.length;
    setIsSearching(isNewSearching);
    
    // 如果开始搜索，清空分类选择
    if (isNewSearching && selectedCategory) {
      setSelectedCategory(null);
    }
  };
  
  // 计算装饰卡片数量
  const decorativeCount = useMemo(() => {
    const { decorativeConfig } = DEFAULT_LAYOUT_CONFIG;
    if (!decorativeConfig.enabled) return 0;
    
    if (decorativeConfig.fillStrategy === 'auto') {
      // 智能计算装饰卡片数量，基于当前行剩余空间
      const gridCols = 4; // 默认4列网格
      let occupiedCols = 0;
      
      // 计算所有工具卡片占用的总列数
      displayTools.forEach((tool, index) => {
        const layoutClasses = calculateLayoutClasses(
          index,
          tool.featured || false,
          DEFAULT_LAYOUT_CONFIG.layoutRules
        );
        // 检查是否有col-span-2类
         if (layoutClasses.includes('col-span-2')) {
           occupiedCols += 2;
         } else {
           occupiedCols += 1;
         }
      });
      
      // 计算当前行已占用的列数
      const currentRowOccupied = occupiedCols % gridCols;
      // 计算剩余列数
      const remainingCols = currentRowOccupied === 0 ? 0 : gridCols - currentRowOccupied;
      
      // 装饰卡片数量不超过剩余空间，且不超过工具数量的1/4
      const maxDecorativeByTools = Math.ceil(displayTools.length / 4);
      return Math.min(decorativeConfig.maxCount, remainingCols, maxDecorativeByTools);
    }
    // 基于工具数量动态计算装饰卡片数量，约为工具数量的1/4
    const dynamicMaxCount = Math.ceil(displayTools.length / 4);
    return Math.min(decorativeConfig.maxCount, dynamicMaxCount);
  }, [displayTools.length]);
  
  // 错误处理
  const handleBentoGridError = (error: Error) => {
    console.error('BentoGrid 渲染错误:', error);
    // 可以在这里添加错误上报逻辑
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          CLIP Tools
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          一站式在线工具集合，提供文本处理、图片编辑、颜色设计等20+实用工具
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          <Badge variant="secondary">纯前端</Badge>
          <Badge variant="secondary">无需注册</Badge>
          <Badge variant="secondary">开源免费</Badge>
          <Badge variant="secondary">响应式设计</Badge>
        </div>
        
        {/* 搜索框 */}
        <div className="max-w-md mx-auto">
          <SearchBox 
            onSearchResults={handleSearchResults} 
            placeholder="搜索工具名称、描述或分类..."
            className="mb-2"
          />
        </div>
      </div>

      {/* Featured Tools Section */}
      {!selectedCategory && !isSearching && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              ⭐ 推荐工具
            </h2>
            <BentoGrid 
              tools={featuredTools} 
              className="mb-8"
              showDecorative={true}
              enablePerformanceMonitoring={true}
              onError={handleBentoGridError}
            />
          </div>
          
          {/* <Separator className="my-8" /> */}
        </>
      )}

      {/* Category Filter */}
      {!isSearching && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedCategory ? '分类工具' : '全部工具'}
          </h2>
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      )}
      
      {/* Search Results Header */}
      {isSearching && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            🔍 搜索结果
          </h2>
          <p className="text-muted-foreground">
            找到 {displayTools.length} 个相关工具
          </p>
        </div>
      )}

      {/* All Tools Grid */}
      <BentoGrid 
        tools={displayTools}
        showDecorative={true}
        enablePerformanceMonitoring={true}
        onError={handleBentoGridError}
      />
      
      {/* Development Tools */}
      <DevTools 
        tools={displayTools} 
        decorativeCount={decorativeCount}
      />
      
      {/* Simple Performance Warning */}
      <SimpleDevTools 
        tools={displayTools} 
        decorativeCount={decorativeCount}
      />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p className="mb-2">
          Made with ❤️ for developers and creators
        </p>
        <p className="text-sm">
          所有工具均在浏览器本地运行，保护您的隐私安全
        </p>
      </footer>
    </div>
  );
}
