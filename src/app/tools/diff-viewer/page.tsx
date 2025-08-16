/**
 * Text Diff Viewer Tool
 * 文本差异对比工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Download, Diff } from 'lucide-react';
import { toast } from 'sonner';

// Simple diff algorithm to find differences between two texts
const computeDiff = (text1: string, text2: string) => {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const result: Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }> = [];

  // Very simple line-by-line diff
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = i < lines1.length ? lines1[i] : null;
    const line2 = i < lines2.length ? lines2[i] : null;
    
    if (line1 === null) {
      result.push({ type: 'added', text: line2 || '' });
    } else if (line2 === null) {
      result.push({ type: 'removed', text: line1 });
    } else if (line1 === line2) {
      result.push({ type: 'unchanged', text: line1 });
    } else {
      result.push({ type: 'removed', text: line1 });
      result.push({ type: 'added', text: line2 });
    }
  }
  
  return result;
};

export default function DiffViewerPage() {
  const [text1, setText1] = useState('这是原始文本。\n它有多行内容。\n有些行会被修改。\n其他行保持不变。');
  const [text2, setText2] = useState('这是修改后的文本。\n它有多行内容。\n这一行已经被修改了。\n其他行保持不变。\n这是新增的一行。');
  
  const diff = computeDiff(text1, text2);
  
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('差异结果已复制到剪贴板！');
    } catch {
      toast.error('复制到剪贴板失败');
    }
  };

  const downloadDiff = () => {
    const diffText = diff.map(line => {
      const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
      return prefix + line.text;
    }).join('\n');
    
    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diff-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('差异结果已下载！');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📝 文本差异对比工具</h1>
          <p className="text-muted-foreground text-lg">
            比较两个文本并高亮显示差异
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Original Text */}
          <Card>
            <CardHeader>
              <CardTitle>原始文本</CardTitle>
              <CardDescription>
                在此输入原始文本
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="输入原始文本..."
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Modified Text */}
          <Card>
            <CardHeader>
              <CardTitle>修改后文本</CardTitle>
              <CardDescription>
                在此输入修改后的文本
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="输入修改后的文本..."
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Diff Result */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Diff className="h-5 w-5" />
              差异结果
            </CardTitle>
            <CardDescription>
              红色高亮显示删除的行，绿色高亮显示新增的行，未修改的行正常显示
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 bg-background font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {diff.map((line, index) => (
                  <div 
                    key={index} 
                    className={`py-1 ${line.type === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                      line.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : ''}`}
                  >
                    <span className="inline-block w-6 text-muted-foreground">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.text}
                  </div>
                ))}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(diff.map(line => {
                  const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
                  return prefix + line.text;
                }).join('\n'))}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                复制差异
              </Button>
              <Button
                onClick={downloadDiff}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                下载差异
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>差异图例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span>新增行</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
                <span>删除行</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background border rounded"></div>
                <span>未修改行</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}