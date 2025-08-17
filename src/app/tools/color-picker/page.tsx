/**
 * Color Picker Tool Page
 * 颜色选择器工具页面
 */

'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Copy, Palette, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ColorFormat {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState<string[]>(['#3b82f6']);

  // Convert hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  // Convert RGB to HSL
  const rgbToHsl = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  // Convert RGB to HSV
  const rgbToHsv = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  }, []);

  // Get all color formats
  const getColorFormats = useCallback((hex: string): ColorFormat => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { hex, rgb: '', hsl: '', hsv: '' };

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
    };
  }, [hexToRgb, rgbToHsl, rgbToHsv]);

  const colorFormats = getColorFormats(selectedColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 11)]);
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${format} 已复制到剪贴板`);
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleColorChange(randomColor);
  };

  const clearHistory = () => {
    setColorHistory([selectedColor]);
    toast.success('历史记录已清空');
  };

  // Predefined color palette
  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Palette className="w-10 h-10 text-primary" />
          颜色选择器
        </h1>
        <p className="text-muted-foreground">
          选择颜色并获取多种格式的颜色代码
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>颜色选择</CardTitle>
              <CardDescription>
                使用颜色选择器或输入颜色值
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Preview */}
              <div 
                className="w-full h-32 rounded-lg border-2 border-muted transition-all duration-200"
                style={{ backgroundColor: selectedColor }}
              />
              
              {/* Color Input */}
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={generateRandomColor}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Predefined Colors */}
          <Card>
            <CardHeader>
              <CardTitle>预设颜色</CardTitle>
              <CardDescription>
                点击选择常用颜色
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className="w-12 h-12 rounded-lg border-2 border-muted hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Information Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>颜色格式</CardTitle>
              <CardDescription>
                不同格式的颜色代码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* HEX */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">HEX</div>
                  <div className="font-mono text-sm">{colorFormats.hex}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(colorFormats.hex, 'HEX')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">RGB</div>
                  <div className="font-mono text-sm">{colorFormats.rgb}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(colorFormats.rgb, 'RGB')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">HSL</div>
                  <div className="font-mono text-sm">{colorFormats.hsl}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(colorFormats.hsl, 'HSL')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* HSV */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">HSV</div>
                  <div className="font-mono text-sm">{colorFormats.hsv}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(colorFormats.hsv, 'HSV')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                颜色历史
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  disabled={colorHistory.length <= 1}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                最近使用的颜色
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {colorHistory.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className="w-10 h-10 rounded border-2 border-muted hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}