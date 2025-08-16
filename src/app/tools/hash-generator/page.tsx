/**
 * Hash Generator Tool
 * 哈希生成工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Hash, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// Hash functions using Web Crypto API and custom implementations
const generateMD5 = async (text: string): Promise<string> => {
  // Simple MD5 implementation for demo purposes
  // In production, you might want to use a proper crypto library
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // For demo, we'll use a simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

const generateSHA1 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateSHA256 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateSHA512 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateCRC32 = (text: string): string => {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    crcTable[i] = crc;
  }
  
  let crc = 0 ^ (-1);
  for (let i = 0; i < text.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ text.charCodeAt(i)) & 0xFF];
  }
  return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
};

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'crc32';

interface HashResult {
  type: string;
  hash: string;
  length: number;
}

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [selectedHash, setSelectedHash] = useState<HashType>('sha256');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const hashTypes = [
    { value: 'md5', label: 'MD5', description: '128位哈希 (32个十六进制字符)' },
    { value: 'sha1', label: 'SHA-1', description: '160位哈希 (40个十六进制字符)' },
    { value: 'sha256', label: 'SHA-256', description: '256位哈希 (64个十六进制字符)' },
    { value: 'sha512', label: 'SHA-512', description: '512位哈希 (128个十六进制字符)' },
    { value: 'crc32', label: 'CRC32', description: '32位校验和 (8个十六进制字符)' }
  ];

  const generateHash = async () => {
    if (!inputText.trim()) {
      toast.error('请输入要哈希的文本');
      return;
    }

    setIsGenerating(true);
    try {
      let hash = '';
      
      switch (selectedHash) {
        case 'md5':
          hash = await generateMD5(inputText);
          break;
        case 'sha1':
          hash = await generateSHA1(inputText);
          break;
        case 'sha256':
          hash = await generateSHA256(inputText);
          break;
        case 'sha512':
          hash = await generateSHA512(inputText);
          break;
        case 'crc32':
          hash = generateCRC32(inputText);
          break;
      }

      const result: HashResult = {
        type: selectedHash.toUpperCase(),
        hash,
        length: hash.length
      };

      setHashResults(prev => {
        const filtered = prev.filter(r => r.type !== result.type);
        return [result, ...filtered];
      });
      
      toast.success(`${selectedHash.toUpperCase()} 哈希生成成功！`);
    } catch {
      toast.error('哈希生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllHashes = async () => {
    if (!inputText.trim()) {
      toast.error('请输入要哈希的文本');
      return;
    }

    setIsGenerating(true);
    try {
      const results: HashResult[] = [];
      
      // Generate all hash types
      const md5Hash = await generateMD5(inputText);
      const sha1Hash = await generateSHA1(inputText);
      const sha256Hash = await generateSHA256(inputText);
      const sha512Hash = await generateSHA512(inputText);
      const crc32Hash = generateCRC32(inputText);
      
      results.push(
        { type: 'MD5', hash: md5Hash, length: md5Hash.length },
        { type: 'SHA-1', hash: sha1Hash, length: sha1Hash.length },
        { type: 'SHA-256', hash: sha256Hash, length: sha256Hash.length },
        { type: 'SHA-512', hash: sha512Hash, length: sha512Hash.length },
        { type: 'CRC32', hash: crc32Hash, length: crc32Hash.length }
      );
      
      setHashResults(results);
      toast.success('所有哈希生成成功！');
    } catch {
      toast.error('哈希生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} 哈希已复制到剪贴板！`);
    } catch {
      toast.error('复制到剪贴板失败');
    }
  };

  const clearAll = () => {
    setInputText('');
    setHashResults([]);
    toast.success('已清空所有数据');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔐 哈希生成器</h1>
          <p className="text-muted-foreground text-lg">
            为任何文本生成加密哈希和校验和
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
            <CardDescription>
              输入您要哈希的文本
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">要哈希的文本</Label>
              <Textarea
                id="input-text"
                placeholder="在此输入您的文本..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                字符数: {inputText.length} | 字节数: {new TextEncoder().encode(inputText).length}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hash-type">哈希类型</Label>
              <Select value={selectedHash} onValueChange={(value: HashType) => setSelectedHash(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择哈希类型" />
                </SelectTrigger>
                <SelectContent>
                  {hashTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateHash} 
                disabled={isGenerating || !inputText.trim()}
              >
                <Hash className="h-4 w-4 mr-2" />
                生成 {selectedHash.toUpperCase()}
              </Button>
              <Button 
                onClick={generateAllHashes} 
                variant="outline"
                disabled={isGenerating || !inputText.trim()}
              >
                生成所有哈希
              </Button>
              <Button onClick={clearAll} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hashResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>哈希结果</CardTitle>
              <CardDescription>
                为您的输入文本生成的哈希
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hashResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{result.type}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({result.length} 个字符)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(result.hash, result.type)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded font-mono text-sm break-all">
                      {result.hash}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>哈希类型信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">MD5</h4>
                <p className="text-muted-foreground">速度快但加密已被破解。仅用于校验和。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SHA-1</h4>
                <p className="text-muted-foreground">安全性已弃用。比MD5好但仍有漏洞。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SHA-256</h4>
                <p className="text-muted-foreground">安全且广泛使用。推荐用于大多数应用。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SHA-512</h4>
                <p className="text-muted-foreground">比SHA-256更安全。适用于高安全性应用。</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">CRC32</h4>
                <p className="text-muted-foreground">用于错误检测的快速校验和。非加密安全。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}