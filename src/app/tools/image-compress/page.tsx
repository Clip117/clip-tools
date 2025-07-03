/**
 * Image Compressor Tool
 * 图片压缩工具
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

import { Upload, Download, RotateCcw, Image as ImageIcon, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  preview: string;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);

  const compressImage = useCallback((file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new HTMLImageElement();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          file.type,
          quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    
    setIsProcessing(true);
    const newImages: CompressedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} 不是有效的图片文件`);
        continue;
      }
      
      try {
        const compressed = await compressImage(file, quality[0]);
        const preview = URL.createObjectURL(file);
        const compressionRatio = ((file.size - compressed.size) / file.size) * 100;
        
        newImages.push({
          original: file,
          compressed,
          originalSize: file.size,
          compressedSize: compressed.size,
          compressionRatio,
          preview
        });
      } catch {
        toast.error(`压缩 ${file.name} 时出错`);
      }
    }
    
    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
    
    if (newImages.length > 0) {
      toast.success(`成功压缩 ${newImages.length} 张图片`);
    }
  }, [compressImage, quality]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const downloadImage = useCallback((image: CompressedImage) => {
    const url = URL.createObjectURL(image.compressed);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('图片下载成功');
  }, []);

  const downloadAll = useCallback(() => {
    images.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  }, [images, downloadImage]);

  const clearAll = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    setImages([]);
    toast.success('已清空所有图片');
  }, [images]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          图片压缩工具
        </h1>
        <p className="text-muted-foreground">
          客户端图片压缩工具，支持 JPG、PNG、WebP 格式，保护您的隐私
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 上传区域 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                上传图片
              </CardTitle>
              <CardDescription>
                拖拽图片到此处或点击选择文件
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  点击选择或拖拽图片文件
                </p>
                <p className="text-xs text-muted-foreground">
                  支持 JPG、PNG、WebP 格式
                </p>
              </div>
              
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              
              <div className="space-y-2">
                <Label>压缩质量: {quality[0]}%</Label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  质量越低，文件越小，但图片质量会下降
                </p>
              </div>
              
              {images.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={downloadAll} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    下载全部
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    清空
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 结果展示 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                压缩结果
                {images.length > 0 && (
                  <Badge variant="secondary">{images.length} 张图片</Badge>
                )}
              </CardTitle>
              <CardDescription>
                查看压缩前后的对比和下载压缩后的图片
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">正在压缩图片...</p>
                </div>
              )}
              
              {!isProcessing && images.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>还没有上传图片</p>
                  <p className="text-sm">上传图片开始压缩</p>
                </div>
              )}
              
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Image
                        src={image.preview}
                        alt={image.original.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded border"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{image.original.name}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">原始大小</p>
                            <p className="font-medium">{formatFileSize(image.originalSize)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">压缩后</p>
                            <p className="font-medium text-green-600">
                              {formatFileSize(image.compressedSize)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge 
                            variant={image.compressionRatio > 0 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {image.compressionRatio > 0 ? '减少' : '增加'} {Math.abs(image.compressionRatio).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => downloadImage(image)}
                        size="sm"
                        className="shrink-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 使用说明 */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">功能特点</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 支持批量压缩多张图片</li>
                <li>• 客户端处理，保护隐私安全</li>
                <li>• 支持 JPG、PNG、WebP 格式</li>
                <li>• 可调节压缩质量</li>
                <li>• 实时预览压缩效果</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用建议</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 网页图片建议质量 70-80%</li>
                <li>• 社交媒体图片建议质量 60-70%</li>
                <li>• 打印图片建议质量 85-95%</li>
                <li>• 缩略图建议质量 50-60%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}