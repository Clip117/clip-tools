/**
 * URL Encode/Decode Tool Page
 * URL编码解码工具页面
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, ArrowUpDown, Link } from 'lucide-react';
import { toast } from 'sonner';

export default function URLEncodePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encodeURL = (text: string) => {
    try {
      return encodeURIComponent(text);
    } catch {
      toast.error('编码失败，请检查输入内容');
      return '';
    }
  };

  const decodeURL = (text: string) => {
    try {
      return decodeURIComponent(text);
    } catch {
      toast.error('解码失败，请检查输入内容');
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
      result = encodeURL(inputText);
    } else {
      result = decodeURL(inputText);
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
        result = encodeURL(value);
      } else {
        result = decodeURL(value);
      }
      setOutputText(result);
    } else {
      setOutputText('');
    }
  };

  // Example data
  const examples = {
    encode: [
      {
        name: '中文字符',
        input: '你好世界',
        output: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
      },
      {
        name: '特殊字符',
        input: 'hello world!@#$%^&*()',
        output: 'hello%20world!%40%23%24%25%5E%26*()'
      },
      {
        name: 'URL参数',
        input: 'name=张三&age=25&city=北京',
        output: 'name%3D%E5%BC%A0%E4%B8%89%26age%3D25%26city%3D%E5%8C%97%E4%BA%AC'
      }
    ],
    decode: [
      {
        name: '编码的中文',
        input: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C',
        output: '你好世界'
      },
      {
        name: '编码的特殊字符',
        input: 'hello%20world!%40%23%24%25%5E%26*()',
        output: 'hello world!@#$%^&*()'
      },
      {
        name: '编码的URL参数',
        input: 'name%3D%E5%BC%A0%E4%B8%89%26age%3D25%26city%3D%E5%8C%97%E4%BA%AC',
        output: 'name=张三&age=25&city=北京'
      }
    ]
  };

  const loadExample = (example: { input: string; output: string }) => {
    setInputText(example.input);
    setOutputText(example.output);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Link className="w-10 h-10 text-primary" />
          URL编码解码
        </h1>
        <p className="text-muted-foreground">
          对URL进行编码和解码处理，支持中文字符和特殊字符
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
                    {mode === 'encode' ? '🔒 URL编码' : '🔓 URL解码'}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'encode' 
                      ? '将文本转换为URL安全的编码格式' 
                      : '将URL编码转换回原始文本'
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
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {mode === 'encode' ? '原始文本' : '编码文本'}
                  </label>
                  <Badge variant="secondary">
                    {inputText.length} 字符
                  </Badge>
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={mode === 'encode' 
                    ? '输入要编码的文本...' 
                    : '输入要解码的URL编码文本...'
                  }
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {mode === 'encode' ? '编码结果' : '解码结果'}
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
                  className="min-h-[120px] font-mono text-sm bg-muted"
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
                <div className="font-medium mb-1">URL编码</div>
                <div className="text-muted-foreground">
                  将特殊字符转换为%XX格式，确保URL传输安全
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">URL解码</div>
                <div className="text-muted-foreground">
                  将%XX格式的编码转换回原始字符
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">常见用途</div>
                <div className="text-muted-foreground">
                  • URL参数传递<br/>
                  • 表单数据提交<br/>
                  • API接口调用
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}