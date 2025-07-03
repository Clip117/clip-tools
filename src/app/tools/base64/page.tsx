/**
 * Base64 Encode/Decode Tool Page
 * Base64编码解码工具页面
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Copy, RotateCcw, ArrowUpDown, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Base64Page() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [fileMode, setFileMode] = useState(false);

  const encodeBase64 = (text: string) => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      toast.error('编码失败，请检查输入内容');
      return '';
    }
  };

  const decodeBase64 = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      toast.error('解码失败，请检查Base64格式');
      return '';
    }
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      toast.error('请输入要处理的内容');
      return;
    }

    let result = '';
    if (mode === 'encode') {
      result = encodeBase64(inputText);
    } else {
      result = decodeBase64(inputText);
    }
    
    setOutputText(result);
    if (result) {
      toast.success(`${mode === 'encode' ? '编码' : '解码'}完成`);
    }
  };

  const handleSwapMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) {
      toast.error('没有内容可复制');
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    toast.success('已清空所有内容');
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    // Auto process for real-time feedback
    if (value.trim()) {
      let result = '';
      if (mode === 'encode') {
        result = encodeBase64(value);
      } else {
        result = decodeBase64(value);
      }
      setOutputText(result);
    } else {
      setOutputText('');
    }
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        if (mode === 'encode') {
          // For text files, encode the content
          setInputText(result);
          setOutputText(encodeBase64(result));
        } else {
          // For decode mode, assume file contains base64
          setInputText(result);
          setOutputText(decodeBase64(result));
        }
      } else if (result instanceof ArrayBuffer) {
        // For binary files, convert to base64
        const bytes = new Uint8Array(result);
        const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        const base64 = btoa(binary);
        setInputText(`[Binary File: ${file.name}]`);
        setOutputText(base64);
      }
    };

    if (mode === 'encode' && file.type.startsWith('text/')) {
      reader.readAsText(file);
    } else if (mode === 'encode') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }

    toast.success('文件已加载');
  };

  const downloadResult = () => {
    if (!outputText) {
      toast.error('没有内容可下载');
      return;
    }

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('文件已下载');
  };

  // Example data
  const examples = {
    encode: [
      {
        name: '简单文本',
        input: 'Hello World!',
        output: 'SGVsbG8gV29ybGQh'
      },
      {
        name: '中文文本',
        input: '你好，世界！',
        output: '5L2g5aW977yM5LiW55WM77yB'
      },
      {
        name: 'JSON数据',
        input: '{"name":"张三","age":25}',
        output: 'eyJuYW1lIjoi5byg5LiJIiwiYWdlIjoyNX0='
      }
    ],
    decode: [
      {
        name: '编码的文本',
        input: 'SGVsbG8gV29ybGQh',
        output: 'Hello World!'
      },
      {
        name: '编码的中文',
        input: '5L2g5aW977yM5LiW55WM77yB',
        output: '你好，世界！'
      },
      {
        name: '编码的JSON',
        input: 'eyJuYW1lIjoi5byg5LiJIiwiYWdlIjoyNX0=',
        output: '{"name":"张三","age":25}'
      }
    ]
  };

  const loadExample = (example: { input: string; output: string }) => {
    setInputText(example.input);
    setOutputText(example.output);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🔐 Base64编码解码
        </h1>
        <p className="text-muted-foreground">
          Base64编码解码工具，支持文本和文件处理
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tool Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {mode === 'encode' ? '🔒 Base64编码' : '🔓 Base64解码'}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'encode' 
                      ? '将文本或文件转换为Base64编码' 
                      : '将Base64编码转换回原始内容'
                    }
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSwapMode}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  切换模式
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="flex-1"
                  accept={mode === 'decode' ? '.txt' : '*'}
                />
                <Button
                  variant="outline"
                  onClick={downloadResult}
                  disabled={!outputText}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {mode === 'encode' ? '原始内容' : 'Base64编码'}
                  </label>
                  <Badge variant="secondary">
                    {inputText.length} 字符
                  </Badge>
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={mode === 'encode' 
                    ? '输入要编码的文本内容...' 
                    : '输入要解码的Base64编码...'
                  }
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {mode === 'encode' ? 'Base64编码' : '解码结果'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {outputText.length} 字符
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder={`${mode === 'encode' ? '编码' : '解码'}结果将显示在这里...`}
                  className="min-h-[120px] font-mono text-sm bg-muted break-all"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleProcess}
                  disabled={!inputText.trim()}
                  className="flex-1"
                >
                  {mode === 'encode' ? '编码' : '解码'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Examples Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>示例</CardTitle>
              <CardDescription>
                点击示例快速测试
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encode">编码示例</TabsTrigger>
                  <TabsTrigger value="decode">解码示例</TabsTrigger>
                </TabsList>
                
                <TabsContent value="encode" className="space-y-3 mt-4">
                  {examples.encode.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => loadExample(example)}
                    >
                      <div className="font-medium text-sm mb-1">{example.name}</div>
                      <div className="text-xs text-muted-foreground font-mono break-all">
                        {example.input}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="decode" className="space-y-3 mt-4">
                  {examples.decode.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => loadExample(example)}
                    >
                      <div className="font-medium text-sm mb-1">{example.name}</div>
                      <div className="text-xs text-muted-foreground font-mono break-all">
                        {example.input}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium mb-1">Base64编码</div>
                <div className="text-muted-foreground">
                  将任意数据转换为ASCII字符串格式
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">文件支持</div>
                <div className="text-muted-foreground">
                  支持文本文件和二进制文件的编码
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">常见用途</div>
                <div className="text-muted-foreground">
                  • 邮件附件编码<br/>
                  • 图片数据传输<br/>
                  • API数据交换
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}