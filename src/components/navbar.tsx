/**
 * Navigation bar component
 * 导航栏组件
 */

'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Home, Github, Search } from 'lucide-react';
import { SearchBox } from './search-box';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              CLIP Tools
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              {!isHomePage && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* 桌面端搜索框 */}
            {!isHomePage && (
              <div className="hidden md:block w-full max-w-sm mx-auto md:mx-0">
                <SearchBox showResults={true} />
              </div>
            )}
          </div>
          
          <nav className="flex items-center space-x-1">
            <Link
              href="https://github.com/Clip117/clip-tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
      
      {/* 移动端搜索框 */}
      {!isHomePage && showMobileSearch && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="px-4 py-3">
            <SearchBox 
              showResults={true} 
              placeholder="搜索工具..."
            />
          </div>
        </div>
      )}
    </nav>
  );
}