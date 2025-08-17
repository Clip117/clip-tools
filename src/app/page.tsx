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
import { DEFAULT_LAYOUT_CONFIG, calculateLayoutClasses } from '@/config/layout';
import { SearchBox } from '@/components/search-box';
import { Tool } from '@/types/tools';
import { ToolCard } from '@/components/tool-card';
import InfiniteScroll from '@/components/infinite-scroll';
import DotGrid from '@/components/DotGrid';
import TextType from '@/components/TextType';
import { Star, BookOpen, Search, Heart } from 'lucide-react';

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
  }, [displayTools]);
  
  // 错误处理
  const handleBentoGridError = (error: Error) => {
    console.error('BentoGrid 渲染错误:', error);
    // 可以在这里添加错误上报逻辑
  };

  // 准备InfiniteScroll的工具卡片数据 - 始终显示所有工具，不受搜索影响
  const infiniteScrollItems = useMemo(() => {
    return TOOLS.map(tool => ({
      content: <ToolCard tool={tool} className="w-full" />
    }));
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Global DotGrid Background */}
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

      {/* Full Screen Landing Page Hero Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden z-40">
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Side - Welcome Text */}
            <div className="space-y-8 flex flex-col justify-center">
              {/* 小屏幕居中，大屏幕左对齐 */}
              <div className="space-y-6 text-center lg:text-left">
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight select-none"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                  onDoubleClick={(e) => e.preventDefault()}
                >
                  <span 
                    className="block drop-shadow-lg" 
                    style={{
                      textShadow: '0 0 20px hsl(var(--background)), 0 0 40px hsl(var(--background)), 0 2px 4px rgba(0,0,0,0.1)',
                      userSelect: 'none'
                    }}
                  >
                    <TextType 
                      text="Welcome to"
                      as="span"
                      typingSpeed={100}
                      showCursor={false}
                      loop={false}
                      startOnVisible={true}
                      className="bg-gradient-to-r from-foreground/80 via-muted-foreground to-foreground/60 bg-clip-text text-transparent"
                    />
                  </span>
                  <span 
                    className="block drop-shadow-lg" 
                    style={{
                      textShadow: '0 0 20px hsl(var(--background)), 0 0 40px hsl(var(--background))',
                      userSelect: 'none'
                    }}
                  >
                    <TextType 
                      text="CLIP Tools"
                      as="span"
                      typingSpeed={120}
                      initialDelay={1200}
                      showCursor={false}
                      cursorCharacter="|"
                      cursorClassName="text-primary"
                      loop={false}
                      startOnVisible={true}
                      className="bg-gradient-to-r from-foreground/50 via-foreground/70 to-foreground/90 bg-clip-text text-transparent"
                    />
                  </span>
                </h1>
              </div>
              
              {/* 搜索框 - 小屏幕居中，大屏幕左对齐 */}
              <div className="flex justify-center lg:justify-start">
                <div className="max-w-md w-full">
                  <SearchBox 
                    onSearchResults={handleSearchResults}
                    placeholder="搜索工具名称、描述或分类..."
                    className="mb-4"
                  />
                </div>
              </div>
              
              {/* Search Results Info - 小屏幕居中，大屏幕左对齐 */}
              {isSearching && (
                <div className="space-y-2 text-center lg:text-left">
                  <h3 className="text-lg font-semibold text-foreground flex items-center justify-center lg:justify-start gap-2" style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}>
                    <Search className="w-5 h-5 text-primary" />
                    搜索结果
                  </h3>
                  <p className="text-muted-foreground" style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}>
                    找到 {displayTools.length} 个相关工具
                  </p>
                </div>
              )}
            </div>            {/* Right Side - Infinite Scroll Tools - 小屏幕时隐藏 */}
            <div className="hidden lg:flex justify-center items-center">
              <div style={{height: '85vh', width: '600px', position: 'relative'}}>
                <InfiniteScroll
                  items={infiniteScrollItems}
                  maxHeight="85vh"
                  width="600px"
                  itemMinHeight={120}
                  isTilted={true}
                  tiltDirection="left"
                  autoplay={true}
                  autoplaySpeed={0.8}
                  autoplayDirection="up"
                  pauseOnHover={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tools Section */}
      {!selectedCategory && !isSearching && (
        <div className="container mx-auto px-4 py-8 relative z-40">
          <div className="mb-4 relative">
            <div className="relative p-6">
              <h2 className="text-3xl md:text-3xl font-semibold mb-6 flex items-center gap-2 text-center text-foreground/80" style={{textShadow: '0 0 20px hsl(var(--background)), 0 0 40px hsl(var(--background))'}}>
                <Star className="w-8 h-8 text-primary" />
                推荐工具
              </h2>
              <BentoGrid 
                tools={featuredTools} 
                showDecorative={true}
                enablePerformanceMonitoring={true}
                onError={handleBentoGridError}
              />
            </div>
          </div>
        </div>
      )}

      {/* All Tools Grid */}
      <div className="container mx-auto px-4 py-2 relative z-40">
        <div className="relative p-6">
          {/* Category Filter */}
          {!isSearching && (
            <div className="mb-8 space-y-4">
              <h3 className="text-3xl font-semibold text-foreground/80 flex items-center gap-2" style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}>
                <BookOpen className="w-8 h-8 text-primary" />
                {selectedCategory ? '分类工具' : '浏览分类'}
              </h3>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          )}
          
          <BentoGrid 
            tools={displayTools}
            showDecorative={true}
            enablePerformanceMonitoring={true}
            onError={handleBentoGridError}
          />
        </div>
      </div>
      
      {/* Development Tools */}
      <div className="relative z-40">
        <DevTools 
          tools={displayTools} 
          decorativeCount={decorativeCount}
        />
      </div>
      
      {/* Simple Performance Warning */}
      <div className="relative z-40">
        <SimpleDevTools 
          tools={displayTools} 
          decorativeCount={decorativeCount}
        />
      </div>

      {/* Footer */}
      <footer className="mt-4 pb-4 relative z-40">
        <div className="relative border-t pt-4 text-center text-muted-foreground">
          <div className="container mx-auto px-4 py-2 relative">
            <p className="mb-1 flex items-center justify-center gap-2" style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}>
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for developers and creators
            </p>
            <p className="text-sm pb-2" style={{textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))'}}>
              所有工具均在浏览器本地运行，保护您的隐私安全
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
