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
import { RotateCcw, Copy, FileText, AlignJustify, Type } from 'lucide-react';
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
  const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

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

    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Count sentences (simple approximation)
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;

    // Count paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;

    // Count lines
    const lines = text.split('\n').length;

    // Calculate reading time (average reading speed: 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Calculate speaking time (average speaking speed: 150 words per minute)
    const speakingTime = Math.max(1, Math.ceil(words / 150));

    // Find most frequent words
    const wordFrequency: Record<string, number> = {};
    const wordArray = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    
    // Common words to exclude
    const commonWords = new Set([
      'the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'that', 'for',
      'on', 'with', 'as', 'be', 'at', 'this', 'by', 'an', 'are', 'or',
      'was', 'but', 'not', 'from', 'have', 'had', 'has', 'i', 'you', 'he',
      'she', 'they', 'we', 'it', 'its', 'their', 'my', 'your', 'his', 'her'
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
    toast.success('Text cleared');
  };

  const handleLoadSample = () => {
    setText(sampleText);
    toast.success('Sample text loaded');
  };

  const copyToClipboard = (content: string, message: string) => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const copyStats = () => {
    const statsText = `Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Reading time: ${stats.readingTime} min
- Speaking time: ${stats.speakingTime} min`;
    
    copyToClipboard(statsText, 'Statistics copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Text Counter</h1>
          <p className="text-muted-foreground text-lg">
            Count characters, words, sentences, and more in your text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter or paste your text below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleClear} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={handleLoadSample} variant="outline">
                    Load Sample Text
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(text, 'Text copied to clipboard')}
                    variant="outline"
                    disabled={!text}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
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
                  Text Statistics
                </CardTitle>
                <CardDescription>
                  Detailed analysis of your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Characters</span>
                        <span className="font-mono font-semibold">{stats.characters}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Characters (no spaces)</span>
                        <span className="font-mono font-semibold">{stats.charactersNoSpaces}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Words</span>
                        <span className="font-mono font-semibold">{stats.words}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Sentences</span>
                        <span className="font-mono font-semibold">{stats.sentences}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Paragraphs</span>
                        <span className="font-mono font-semibold">{stats.paragraphs}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span>Lines</span>
                        <span className="font-mono font-semibold">{stats.lines}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Reading Time</span>
                        <span className="font-mono font-semibold">{stats.readingTime} min</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Speaking Time</span>
                        <span className="font-mono font-semibold">{stats.speakingTime} min</span>
                      </div>
                      
                      {stats.mostFrequentWords.length > 0 && (
                        <div className="pt-2">
                          <h4 className="font-semibold mb-2">Most Frequent Words</h4>
                          <div className="space-y-1">
                            {stats.mostFrequentWords.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-mono">{item.word}</span>
                                <span className="text-muted-foreground">{item.count} times</span>
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
                  Copy Statistics
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
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Basic Counting</h4>
                <p className="text-muted-foreground">
                  Count characters, words, sentences, paragraphs, and lines in your text.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reading Metrics</h4>
                <p className="text-muted-foreground">
                  Estimate reading and speaking time based on average speeds.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Word Frequency</h4>
                <p className="text-muted-foreground">
                  Identify the most frequently used words in your text, excluding common words.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}