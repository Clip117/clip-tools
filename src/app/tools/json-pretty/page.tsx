/**
 * JSON Formatter Tool Page
 * JSON格式化工具页面
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonPrettyPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      toast.success('JSON格式化成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON格式错误');
      setOutput('');
      toast.error('JSON格式错误');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      toast.success('JSON压缩成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON格式错误');
      setOutput('');
      toast.error('JSON格式错误');
    }
  };

  const handleProcess = () => {
    if (mode === 'format') {
      formatJson();
    } else {
      minifyJson();
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    toast.success('内容已清空');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success('已复制到剪贴板');
    }
  };

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('文件下载成功');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        toast.success('文件上传成功');
      };
      reader.readAsText(file);
    }
  };

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🔧 JSON 格式化工具
        </h1>
        <p className="text-muted-foreground">
          美化、压缩和验证JSON数据格式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              输入JSON
              <div className="flex gap-2">
                <Badge variant={validateJson(input) ? 'default' : 'destructive'}>
                  {validateJson(input) ? '有效' : '无效'}
                </Badge>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              粘贴或上传您要处理的JSON数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{ "name": "example", "value": 123 }'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            
            <div className="flex gap-2 mt-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'format' | 'minify')} className="flex-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="format">格式化</TabsTrigger>
                  <TabsTrigger value="minify">压缩</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                onClick={handleProcess}
                disabled={!input.trim()}
                className="px-6"
              >
                {mode === 'format' ? '格式化' : '压缩'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={!input && !output}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              输出结果
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!output}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {mode === 'format' ? '格式化后的JSON' : '压缩后的JSON'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="min-h-[400px] p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="text-destructive font-medium mb-2">JSON格式错误:</div>
                <div className="text-sm text-destructive/80 font-mono">{error}</div>
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder="处理后的JSON将显示在这里..."
                className="min-h-[400px] font-mono text-sm"
              />
            )}
            
            {output && (
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <div>字符数: {output.length.toLocaleString()}</div>
                <div>行数: {output.split('\n').length.toLocaleString()}</div>
                {mode === 'minify' && input && (
                  <div>压缩率: {Math.round((1 - output.length / input.length) * 100)}%</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}