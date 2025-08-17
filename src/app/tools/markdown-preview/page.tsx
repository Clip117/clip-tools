/**
 * Markdown Preview Tool
 * Markdown预览工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye, FileText, FileCode } from 'lucide-react';
import { toast } from 'sonner';

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br>');
};

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(`# Markdown 预览

这是一个 **粗体** 文本，这是 *斜体* 文本。

## 功能特性

- 实时预览
- 基础 Markdown 支持
- 复制和下载功能

### 代码示例

\`console.log('Hello World!')\`

[访问 GitHub](https://github.com)`);

  const htmlOutput = parseMarkdown(markdown);

  const copyToClipboard = async (content: string, type: 'markdown' | 'html') => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type === 'markdown' ? 'Markdown' : 'HTML'} 已复制到剪贴板！`);
    } catch {
      toast.error('复制到剪贴板失败');
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`文件已下载: ${filename}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <FileCode className="w-10 h-10 text-primary" />
            Markdown 预览器
          </h1>
          <p className="text-muted-foreground text-lg">
            实时 Markdown 转 HTML 预览，支持复制和下载功能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Markdown 输入
              </CardTitle>
              <CardDescription>
                在此输入您的 Markdown 内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在此输入您的 Markdown 内容..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(markdown, 'markdown')}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制 Markdown
                </Button>
                <Button
                  onClick={() => downloadFile(markdown, 'document.md')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载 .md
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                HTML 预览
              </CardTitle>
              <CardDescription>
                Markdown 的实时预览
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="min-h-[400px] p-4 border rounded-md bg-background prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(htmlOutput, 'html')}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制 HTML
                </Button>
                <Button
                  onClick={() => downloadFile(htmlOutput, 'document.html')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载 .html
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>支持的 Markdown 功能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">标题</h4>
                <code># H1, ## H2, ### H3</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">强调</h4>
                <code>**粗体**, *斜体*</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">代码</h4>
                <code>`行内代码`</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">链接</h4>
                <code>[文本](链接)</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">换行</h4>
                <code>自动转换</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}