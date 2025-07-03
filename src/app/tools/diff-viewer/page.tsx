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
  const [text1, setText1] = useState('This is the original text.\nIt has multiple lines.\nSome lines will be changed.\nOthers will remain the same.');
  const [text2, setText2] = useState('This is the modified text.\nIt has multiple lines.\nThis line has been changed.\nOthers will remain the same.\nAnd this is a new line.');
  
  const diff = computeDiff(text1, text2);
  
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Diff result copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
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
    toast.success('Diff result downloaded!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Text Diff Viewer</h1>
          <p className="text-muted-foreground text-lg">
            Compare two texts and highlight the differences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Original Text */}
          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
              <CardDescription>
                Enter the original text here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter original text..."
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Modified Text */}
          <Card>
            <CardHeader>
              <CardTitle>Modified Text</CardTitle>
              <CardDescription>
                Enter the modified text here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter modified text..."
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
              Diff Result
            </CardTitle>
            <CardDescription>
              Lines highlighted in red were removed, green were added, and unchanged lines are shown normally
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
                Copy Diff
              </Button>
              <Button
                onClick={downloadDiff}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Diff
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Diff Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span>Added lines</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
                <span>Removed lines</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background border rounded"></div>
                <span>Unchanged lines</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}