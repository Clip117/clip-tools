/**
 * Image Resize Tool
 * 图像缩放工具
 */

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageResizePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(e.target?.result as string);
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setResizedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      const resizedDataUrl = canvas.toDataURL('image/png', 0.9);
      setResizedImage(resizedDataUrl);
      toast.success('Image resized successfully!');
    };
    img.src = originalImage;
  };

  const downloadResizedImage = () => {
    if (!resizedImage) return;
    
    const link = document.createElement('a');
    link.download = `resized-image-${width}x${height}.png`;
    link.href = resizedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  };

  const resetToOriginal = () => {
    if (originalDimensions) {
      setWidth(originalDimensions.width);
      setHeight(originalDimensions.height);
      setResizedImage(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Image Resize</h1>
          <p className="text-muted-foreground text-lg">
            Resize images while maintaining quality and aspect ratio
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Select an image file to resize (JPG, PNG, WebP supported)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {originalDimensions && (
                <span className="text-sm text-muted-foreground">
                  Original: {originalDimensions.width} × {originalDimensions.height}px
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {originalImage && (
          <>
            {/* Resize Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resize Settings</CardTitle>
                <CardDescription>
                  Adjust the dimensions for your resized image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min="1"
                      max="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min="1"
                      max="5000"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onCheckedChange={setMaintainAspectRatio}
                  />
                  <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={resizeImage}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Resize Image
                  </Button>
                  <Button onClick={resetToOriginal} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Original
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                  <CardDescription>
                    {originalDimensions && `${originalDimensions.width} × ${originalDimensions.height}px`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resized Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Resized Image</CardTitle>
                  <CardDescription>
                    {resizedImage ? `${width} × ${height}px` : 'Click "Resize Image" to preview'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resizedImage ? (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={resizedImage}
                          alt="Resized"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                      <Button onClick={downloadResizedImage} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Resized Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-96 flex items-center justify-center">
                      <p className="text-muted-foreground">Resized image will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Aspect Ratio</h4>
                <p className="text-muted-foreground">Maintain original proportions automatically</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">High Quality</h4>
                <p className="text-muted-foreground">Canvas-based resizing for best results</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Multiple Formats</h4>
                <p className="text-muted-foreground">Support for JPG, PNG, and WebP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}