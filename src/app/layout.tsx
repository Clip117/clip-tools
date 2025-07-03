/**
 * Root layout for CLIP Tools
 * CLIP工具站根布局
 */

import type { Metadata } from "next";
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: "CLIP Tools - 一站式在线工具集合",
  description: "提供文本处理、图片编辑、颜色设计等20+实用工具，纯前端运行，保护隐私安全",
  keywords: "在线工具,文本处理,图片编辑,颜色设计,开发工具,前端工具",
  authors: [{ name: "CLIP Tools" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background font-sans"
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
