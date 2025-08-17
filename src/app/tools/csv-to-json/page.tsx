/**
 * CSV to JSON Converter Tool
 * CSV转JSON转换工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Copy, RotateCcw, FileJson, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [trimValues, setTrimValues] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample CSV data
  const sampleCsv = `id,name,email,age,active
1,张三,zhangsan@example.com,32,true
2,李四,lisi@example.com,28,true
3,王五,wangwu@example.com,45,false
4,赵六,zhaoliu@example.com,36,true`;

  const parseCsv = () => {
    if (!csvInput.trim()) {
      toast.error('请输入CSV数据');
      return;
    }

    setIsProcessing(true);

    try {
      // Split the CSV into lines
      const lines = csvInput.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        toast.error('未找到有效的CSV数据');
        setIsProcessing(false);
        return;
      }

      // Parse headers
      let headers: string[] = [];
      let startIndex = 0;

      if (hasHeader) {
        headers = lines[0].split(delimiter).map(header => 
          trimValues ? header.trim() : header
        );
        startIndex = 1;
      }

      // Parse rows
      const jsonArray = [];

      for (let i = startIndex; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(value => 
          trimValues ? value.trim() : value
        );
        
        if (hasHeader) {
          // Create object with headers as keys
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            // Handle case where values might be fewer than headers
            if (index < values.length) {
              obj[header] = values[index];
            } else {
              obj[header] = '';
            }
          });
          jsonArray.push(obj);
        } else {
          // Without headers, just use array of values
          jsonArray.push(values);
        }
      }

      // Convert to formatted JSON string
      const jsonString = JSON.stringify(jsonArray, null, 2);
      setJsonOutput(jsonString);
      toast.success('CSV转换为JSON成功！');
    } catch (error) {
      toast.error('CSV转JSON失败');
      console.error('CSV parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      toast.error('请选择CSV文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvInput(content);
      toast.success('CSV文件加载成功！');
    };
    reader.onerror = () => {
      toast.error('文件读取失败');
    };
    reader.readAsText(file);
  };

  const downloadJson = () => {
    if (!jsonOutput) {
      toast.error('没有JSON数据可下载');
      return;
    }

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('JSON文件下载成功！');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('复制到剪贴板失败'));
  };

  const clearAll = () => {
    setCsvInput('');
    setJsonOutput('');
    toast.success('已清空所有数据');
  };

  const loadSampleData = () => {
    setCsvInput(sampleCsv);
    toast.success('示例CSV数据已加载');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            CSV转JSON转换器
          </h1>
          <p className="text-muted-foreground text-lg">
            将CSV数据转换为JSON格式，支持自定义选项
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                CSV输入
              </CardTitle>
              <CardDescription>
                输入或上传您的CSV数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="在此粘贴您的CSV数据..."
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  上传CSV
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={loadSampleData} variant="outline">
                  加载示例
                </Button>
                <Button onClick={clearAll} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  清空
                </Button>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">转换选项</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="delimiter">分隔符</Label>
                  <Input
                    id="delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder="输入分隔符"
                    className="max-w-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    常用分隔符：逗号 (,)、分号 (;)、制表符 (\t)、竖线 (|)
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-header"
                    checked={hasHeader}
                    onCheckedChange={setHasHeader}
                  />
                  <Label htmlFor="has-header">第一行包含标题</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trim-values"
                    checked={trimValues}
                    onCheckedChange={setTrimValues}
                  />
                  <Label htmlFor="trim-values">去除值的空白字符</Label>
                </div>
                
                <Button 
                  onClick={parseCsv} 
                  disabled={isProcessing || !csvInput.trim()}
                  className="w-full"
                >
                  转换为JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                JSON输出
              </CardTitle>
              <CardDescription>
                生成的JSON数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="pretty" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pretty">格式化</TabsTrigger>
                  <TabsTrigger value="compact">紧凑</TabsTrigger>
                </TabsList>
                <TabsContent value="pretty" className="pt-4">
                  <Textarea
                    value={jsonOutput}
                    readOnly
                    placeholder="JSON输出将在此显示..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="compact" className="pt-4">
                  <Textarea
                    value={jsonOutput ? JSON.stringify(JSON.parse(jsonOutput)) : ''}
                    readOnly
                    placeholder="JSON输出将在此显示..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={downloadJson}
                  disabled={!jsonOutput}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载JSON
                </Button>
                <Button
                  onClick={() => copyToClipboard(jsonOutput, 'JSON已复制到剪贴板')}
                  disabled={!jsonOutput}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>功能特性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">自定义分隔符</h4>
                <p className="text-muted-foreground">
                  支持逗号、分号、制表符和自定义分隔符
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">标题行选项</h4>
                <p className="text-muted-foreground">
                  支持有无标题行的转换，输出格式灵活
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">数据清理</h4>
                <p className="text-muted-foreground">
                  可选择去除值的空白字符，获得更清洁的JSON输出
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}