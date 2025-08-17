/**
 * Text Counter Tool
 * 文本计数工具
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Copy, FileText, AlignJustify, Type, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  mostFrequentWords: Array<{ word: string; count: number }>;
}

export default function TextCounterPage() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
    mostFrequentWords: [],
  });

  // Sample text for demonstration
  const sampleText = `这是一个示例文本，用于演示文本计数工具的功能。您可以在这里输入任何文本，工具会自动计算字符数、单词数、句子数等统计信息。

文本计数工具可以帮助您分析文档的长度，这对于写作、编辑和内容创作非常有用。无论您是在写博客文章、学术论文还是社交媒体内容，了解文本的统计信息都能帮助您更好地控制内容的长度。

此外，工具还提供阅读时间和朗读时间的估算，这些信息对于演讲准备和内容规划特别有价值。`;

  // Calculate text statistics
  useEffect(() => {
    if (text.trim() === '') {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        speakingTime: 0,
        mostFrequentWords: [],
      });
      return;
    }

    // Count characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Count words (improved for Chinese text)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Count sentences (simple approximation)
    const sentences = text.split(/[.!?。！？]+/).filter(sentence => sentence.trim().length > 0).length;

    // Count paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;

    // Count lines
    const lines = text.split('\n').length;

    // Calculate reading time (average reading speed: 200 words per minute for English, 300 characters per minute for Chinese)
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Calculate speaking time (average speaking speed: 150 words per minute)
    const speakingTime = Math.max(1, Math.ceil(words / 150));

    // Find most frequent words
    const wordFrequency: Record<string, number> = {};
    const wordArray = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    
    // Common words to exclude (English and Chinese)
    const commonWords = new Set([
      'the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'that', 'for',
      'on', 'with', 'as', 'be', 'at', 'this', 'by', 'an', 'are', 'or',
      'was', 'but', 'not', 'from', 'have', 'had', 'has', 'i', 'you', 'he',
      'she', 'they', 'we', 'it', 'its', 'their', 'my', 'your', 'his', 'her',
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
      '一个', '没有', '我们', '你们', '他们', '这个', '那个', '可以', '这样'
    ]);
    
    wordArray.forEach(word => {
      if (word.length > 1 && !commonWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    const mostFrequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      mostFrequentWords,
    });
  }, [text]);

  const handleClear = () => {
    setText('');
    toast.success('文本已清空');
  };

  const handleLoadSample = () => {
    setText(sampleText);
    toast.success('示例文本已加载');
  };

  const copyToClipboard = (content: string, message: string) => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success(message))
      .catch(() => toast.error('复制到剪贴板失败'));
  };

  const copyStats = () => {
    const statsText = `文本统计信息:
- 字符数: ${stats.characters}
- 字符数 (不含空格): ${stats.charactersNoSpaces}
- 单词数: ${stats.words}
- 句子数: ${stats.sentences}
- 段落数: ${stats.paragraphs}
- 行数: ${stats.lines}
- 阅读时间: ${stats.readingTime} 分钟
- 朗读时间: ${stats.speakingTime} 分钟`;
    
    copyToClipboard(statsText, '统计信息已复制到剪贴板');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Hash className="w-10 h-10 text-primary" />
            文本计数器
          </h1>
          <p className="text-muted-foreground text-lg">
            统计文本中的字符、单词、句子等信息
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  文本输入
                </CardTitle>
                <CardDescription>
                  在下方输入或粘贴您的文本
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="在此输入或粘贴您的文本..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleClear} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    清空
                  </Button>
                  <Button onClick={handleLoadSample} variant="outline">
                    加载示例文本
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(text, '文本已复制到剪贴板')}
                    variant="outline"
                    disabled={!text}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    复制文本
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlignJustify className="h-5 w-5" />
                  文本统计
                </CardTitle>
                <CardDescription>
                  详细的文本分析信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">基础</TabsTrigger>
                    <TabsTrigger value="advanced">高级</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>字符数</span>
                        <span className="font-mono font-semibold">{stats.characters}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>字符数 (不含空格)</span>
                        <span className="font-mono font-semibold">{stats.charactersNoSpaces}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>单词数</span>
                        <span className="font-mono font-semibold">{stats.words}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>句子数</span>
                        <span className="font-mono font-semibold">{stats.sentences}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>段落数</span>
                        <span className="font-mono font-semibold">{stats.paragraphs}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span>行数</span>
                        <span className="font-mono font-semibold">{stats.lines}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>阅读时间</span>
                        <span className="font-mono font-semibold">{stats.readingTime} 分钟</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>朗读时间</span>
                        <span className="font-mono font-semibold">{stats.speakingTime} 分钟</span>
                      </div>
                      
                      {stats.mostFrequentWords.length > 0 && (
                        <div className="pt-2">
                          <h4 className="font-semibold mb-2">高频词汇</h4>
                          <div className="space-y-1">
                            {stats.mostFrequentWords.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-mono">{item.word}</span>
                                <span className="text-muted-foreground">{item.count} 次</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  onClick={copyStats} 
                  className="w-full mt-4"
                  disabled={!text}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制统计信息
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              功能特性
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">基础计数</h4>
                <p className="text-muted-foreground">
                  统计文本中的字符、单词、句子、段落和行数。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">阅读指标</h4>
                <p className="text-muted-foreground">
                  基于平均速度估算阅读时间和朗读时间。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">词频分析</h4>
                <p className="text-muted-foreground">
                  识别文本中最常用的词汇，排除常见停用词。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}