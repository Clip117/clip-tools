'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Hash, RefreshCw, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

type UUIDVersion = 'v1' | 'v4' | 'v7';

interface GeneratedUUID {
  id: string;
  uuid: string;
  version: string;
  timestamp: string;
}

// UUID v7 implementation (simplified)
function uuidv7(): string {
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16).padStart(12, '0');
  const randomHex = Array.from({ length: 18 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  const uuid = [
    timestampHex.slice(0, 8),
    timestampHex.slice(8, 12),
    '7' + randomHex.slice(0, 3),
    ((parseInt(randomHex.slice(3, 4), 16) & 0x3) | 0x8).toString(16) + randomHex.slice(4, 7),
    randomHex.slice(7, 19)
  ].join('-');
  
  return uuid;
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [removeDashes, setRemoveDashes] = useState(false);
  const [generatedUuids, setGeneratedUuids] = useState<GeneratedUUID[]>([]);

  const generateUUID = (version: UUIDVersion): string => {
    switch (version) {
      case 'v1':
        return uuidv1();
      case 'v4':
        return uuidv4();
      case 'v7':
        return uuidv7();
      default:
        return uuidv4();
    }
  };

  const formatUUID = (uuid: string): string => {
    let formatted = uuid;
    if (removeDashes) {
      formatted = formatted.replace(/-/g, '');
    }
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    return formatted;
  };

  const handleGenerate = () => {
    const newUuids: GeneratedUUID[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const rawUuid = generateUUID(version);
      const formattedUuid = formatUUID(rawUuid);
      
      newUuids.push({
        id: `${Date.now()}-${i}`,
        uuid: formattedUuid,
        version: version.toUpperCase(),
        timestamp: new Date().toLocaleString('zh-CN')
      });
    }
    
    setGeneratedUuids(newUuids);
    toast.success(`成功生成 ${quantity} 个 UUID`);
  };

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error('复制失败');
    }
  };

  const copyAllUuids = () => {
    const allUuids = generatedUuids.map(item => item.uuid).join('\n');
    copyToClipboard(allUuids, '所有 UUID 已复制到剪贴板');
  };

  const downloadUuids = () => {
    const content = generatedUuids.map(item => 
      `${item.uuid} (${item.version}, ${item.timestamp})`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('UUID 文件下载成功');
  };

  const clearAll = () => {
    setGeneratedUuids([]);
    toast.success('所有 UUID 已清除');
  };

  const versionDescriptions = {
    v1: '基于时间戳和 MAC 地址（不推荐用于安全场景）',
    v4: '随机或伪随机生成（最常用）',
    v7: '基于时间戳的改进版本（最新标准）'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">UUID 生成器</h1>
          <p className="text-muted-foreground text-lg">
            生成各种格式的通用唯一标识符 (UUID)
          </p>
        </div>

        {/* Generator Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              生成器设置
            </CardTitle>
            <CardDescription>
              配置您的 UUID 生成偏好
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="version">UUID 版本</Label>
                <Select value={version} onValueChange={(value: UUIDVersion) => setVersion(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择 UUID 版本" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">
                      <div>
                        <div className="font-medium">UUID v1</div>
                        <div className="text-xs text-muted-foreground">时间戳 + MAC</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v4">
                      <div>
                        <div className="font-medium">UUID v4</div>
                        <div className="text-xs text-muted-foreground">随机（推荐）</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v7">
                      <div>
                        <div className="font-medium">UUID v7</div>
                        <div className="text-xs text-muted-foreground">时间戳 + 随机（新版）</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {versionDescriptions[version]}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">数量</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  一次生成 1-100 个 UUID
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">格式选项</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                  <Label htmlFor="uppercase">大写</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-dashes"
                    checked={removeDashes}
                    onCheckedChange={setRemoveDashes}
                  />
                  <Label htmlFor="remove-dashes">移除连字符</Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                生成 UUID{quantity > 1 ? 's' : ''}
              </Button>
              {generatedUuids.length > 0 && (
                <>
                  <Button onClick={copyAllUuids} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    复制全部
                  </Button>
                  <Button onClick={downloadUuids} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    清除
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated UUIDs */}
        {generatedUuids.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>生成的 UUID</CardTitle>
              <CardDescription>
                已生成 {generatedUuids.length} 个 UUID{generatedUuids.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {generatedUuids.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm break-all">{item.uuid}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.version} • {item.timestamp}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(item.uuid, 'UUID 已复制到剪贴板')}
                      className="ml-2 flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>UUID 信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">UUID v1</h4>
                <p className="text-muted-foreground">
                  基于时间戳和 MAC 地址。可预测且可能泄露信息。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UUID v4</h4>
                <p className="text-muted-foreground">
                  随机生成。使用最广泛，推荐用于一般用途。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UUID v7</h4>
                <p className="text-muted-foreground">
                  基于时间戳的改进随机性。有利于数据库性能。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}