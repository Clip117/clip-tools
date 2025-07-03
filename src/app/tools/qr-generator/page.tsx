/**
 * QR Code Generator Tool Page
 * QR码生成器工具页面
 */

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, QrCode, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface QROptions {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  margin: number;
}

export default function QRGeneratorPage() {
  const [options, setOptions] = useState<QROptions>({
    text: '',
    size: 256,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    margin: 4
  });

  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code using qrcode library
  const generateQRCode = async () => {
    if (!options.text.trim()) {
      toast.error('请输入要生成QR码的内容');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate QR code using the qrcode library
      await QRCode.toCanvas(canvas, options.text, {
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor
        },
        errorCorrectionLevel: options.errorCorrectionLevel
      });

      const dataURL = canvas.toDataURL('image/png');
      setQrDataURL(dataURL);
      toast.success('QR码生成成功！现在可以正常扫描了');
    } catch (error) {
      console.error('QR Code generation error:', error);
      toast.error('生成QR码时出错');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataURL) {
      toast.error('请先生成QR码');
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR码已下载');
  };

  const clearAll = () => {
    setOptions(prev => ({ ...prev, text: '' }));
    setQrDataURL('');
    toast.success('已清空内容');
  };

  // Predefined templates
  const templates = {
    url: {
      name: '网址链接',
      placeholder: 'https://example.com',
      example: 'https://www.google.com'
    },
    text: {
      name: '纯文本',
      placeholder: '输入任意文本...',
      example: '这是一段示例文本'
    },
    email: {
      name: '邮箱地址',
      placeholder: 'mailto:example@email.com',
      example: 'mailto:contact@example.com?subject=Hello&body=Hi there!'
    },
    phone: {
      name: '电话号码',
      placeholder: 'tel:+1234567890',
      example: 'tel:+8613800138000'
    },
    wifi: {
      name: 'WiFi信息',
      placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
      example: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
    },
    vcard: {
      name: '联系人信息',
      placeholder: 'BEGIN:VCARD\nVERSION:3.0\nFN:姓名\nTEL:电话\nEMAIL:邮箱\nEND:VCARD',
      example: 'BEGIN:VCARD\nVERSION:3.0\nFN:张三\nTEL:+8613800138000\nEMAIL:zhangsan@example.com\nEND:VCARD'
    }
  };

  const loadTemplate = (template: keyof typeof templates) => {
    setOptions(prev => ({ ...prev, text: templates[template].example }));
  };

  const errorLevels = {
    'L': '低 (~7%)',
    'M': '中 (~15%)',
    'Q': '高 (~25%)',
    'H': '最高 (~30%)'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📱 QR码生成器
        </h1>
        <p className="text-muted-foreground">
          生成自定义QR码，支持多种内容类型和样式设置
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>内容设置</CardTitle>
              <CardDescription>
                输入要生成QR码的内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">内容</label>
                  <Badge variant="secondary">
                    {options.text.length} 字符
                  </Badge>
                </div>
                <Textarea
                  value={options.text}
                  onChange={(e) => setOptions(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="输入要生成QR码的内容..."
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>

              {/* Templates */}
              <div className="space-y-2">
                <label className="text-sm font-medium">快速模板</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(templates).map(([key, template]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(key as keyof typeof templates)}
                      className="text-xs"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>样式设置</CardTitle>
              <CardDescription>
                自定义QR码外观
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">尺寸</label>
                <Select
                  value={options.size.toString()}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, size: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128x128</SelectItem>
                    <SelectItem value="256">256x256</SelectItem>
                    <SelectItem value="512">512x512</SelectItem>
                    <SelectItem value="1024">1024x1024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error Correction Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">容错级别</label>
                <Select
                  value={options.errorCorrectionLevel}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(errorLevels).map(([level, description]) => (
                      <SelectItem key={level} value={level}>
                        {description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">前景色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={options.foregroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">背景色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={options.backgroundColor}
                      onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2">
                <label className="text-sm font-medium">边距</label>
                <Select
                  value={options.margin.toString()}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, margin: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">无边距</SelectItem>
                    <SelectItem value="2">小边距</SelectItem>
                    <SelectItem value="4">中等边距</SelectItem>
                    <SelectItem value="8">大边距</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR码预览</CardTitle>
              <CardDescription>
                生成的QR码将显示在这里
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={generateQRCode}
                  disabled={!options.text.trim() || isGenerating}
                  className="flex-1"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {isGenerating ? '生成中...' : '生成QR码'}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadQRCode}
                  disabled={!qrDataURL}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center">
                {qrDataURL ? (
                  <div className="border rounded-lg p-4 bg-white">
                    <img
                      src={qrDataURL}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
                    <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>QR码将显示在这里</p>
                    <p className="text-sm">输入内容并点击生成按钮</p>
                  </div>
                )}
              </div>

              {/* Hidden Canvas */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </CardContent>
          </Card>

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-1">📱 扫描建议</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 确保足够的对比度</li>
                    <li>• 保持适当的尺寸</li>
                    <li>• 避免过于复杂的内容</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">🎨 设计建议</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 使用高对比度颜色</li>
                    <li>• 保留足够的边距</li>
                    <li>• 选择合适的容错级别</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}