/**
 * Word Count Tool Page
 * 字数统计工具页面
 */

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function WordCountPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    
    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences
    };
  }, [text]);

  const handleClear = () => {
    setText('');
    toast.success('文本已清空');
  };

  const handleCopyStats = () => {
    const statsText = `字符数: ${stats.characters}\n字符数(不含空格): ${stats.charactersNoSpaces}\n单词数: ${stats.words}\n行数: ${stats.lines}\n段落数: ${stats.paragraphs}\n句子数: ${stats.sentences}`;
    navigator.clipboard.writeText(statsText);
    toast.success('统计信息已复制到剪贴板');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          字数统计工具
        </h1>
        <p className="text-muted-foreground">
          实时统计文本的字符数、单词数、行数等信息
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>输入文本</CardTitle>
              <CardDescription>
                在下方输入或粘贴您要统计的文本
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="请输入或粘贴您的文本..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[400px] resize-none"
              />
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  清空
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyStats}
                  disabled={!text}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制统计
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>统计信息</CardTitle>
              <CardDescription>
                实时文本统计结果
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats.characters.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">字符数</div>
                </div>
                
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats.charactersNoSpaces.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">字符数(无空格)</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">单词数</span>
                  <Badge variant="secondary">{stats.words.toLocaleString()}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">行数</span>
                  <Badge variant="secondary">{stats.lines.toLocaleString()}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">段落数</span>
                  <Badge variant="secondary">{stats.paragraphs.toLocaleString()}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">句子数</span>
                  <Badge variant="secondary">{stats.sentences.toLocaleString()}</Badge>
                </div>
              </div>

              {text && (
                <>
                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>平均每行字符数: {stats.lines > 0 ? Math.round(stats.characters / stats.lines) : 0}</div>
                    <div>平均每段字符数: {stats.paragraphs > 0 ? Math.round(stats.characters / stats.paragraphs) : 0}</div>
                    <div>平均每句字符数: {stats.sentences > 0 ? Math.round(stats.characters / stats.sentences) : 0}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}