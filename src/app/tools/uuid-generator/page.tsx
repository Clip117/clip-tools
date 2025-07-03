/**
 * UUID Generator Tool
 * UUID生成工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Copy, RefreshCw, Download, Hash, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

type UUIDVersion = 'v1' | 'v4' | 'v7';

interface GeneratedUUID {
  id: string;
  uuid: string;
  version: string;
  timestamp: string;
}

export default function UuidGeneratorPage() {
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [removeDashes, setRemoveDashes] = useState(false);
  const [generatedUuids, setGeneratedUuids] = useState<GeneratedUUID[]>([]);

  // Simple UUID v4 generator
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Simple UUID v1 generator (timestamp-based)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 15);
    const clockSeq = Math.random().toString(16).substring(2, 6);
    
    // This is a simplified v1 UUID for demo purposes
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (0x1000 | ((timestamp >> 48) & 0x0fff)).toString(16);
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${random}`;
  };

  // Simple UUID v7 generator (timestamp-based, newer standard)
  const generateUUIDv7 = (): string => {
    const timestamp = Date.now();
    const randomA = Math.random().toString(16).substring(2, 6);
    const randomB = Math.random().toString(16).substring(2, 14);
    
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    const timeLow = timestampHex.substring(0, 8);
    const timeMid = timestampHex.substring(8, 12);
    
    return `${timeLow}-${timeMid}-7${randomA.substring(1)}-${randomA.substring(0, 1)}${randomB.substring(0, 3)}-${randomB.substring(3)}`;
  };

  const generateUUID = (ver: UUIDVersion): string => {
    switch (ver) {
      case 'v1':
        return generateUUIDv1();
      case 'v4':
        return generateUUIDv4();
      case 'v7':
        return generateUUIDv7();
      default:
        return generateUUIDv4();
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
        timestamp: new Date().toLocaleString()
      });
    }
    
    setGeneratedUuids(prev => [...newUuids, ...prev]);
    toast.success(`Generated ${quantity} UUID${quantity > 1 ? 's' : ''}`);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const copyAllUuids = () => {
    const allUuids = generatedUuids.map(item => item.uuid).join('\n');
    copyToClipboard(allUuids, 'All UUIDs copied to clipboard');
  };

  const downloadUuids = () => {
    if (generatedUuids.length === 0) {
      toast.error('No UUIDs to download');
      return;
    }
    
    const content = generatedUuids.map(item => 
      `${item.uuid} (${item.version} - ${item.timestamp})`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('UUIDs downloaded successfully');
  };

  const clearAll = () => {
    setGeneratedUuids([]);
    toast.success('All UUIDs cleared');
  };

  const versionDescriptions = {
    v1: 'Timestamp and MAC address based (not recommended for security)',
    v4: 'Random or pseudo-random (most commonly used)',
    v7: 'Timestamp-based with improved entropy (newest standard)'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">UUID Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generate universally unique identifiers (UUIDs) in various formats
          </p>
        </div>

        {/* Generator Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Generator Settings
            </CardTitle>
            <CardDescription>
              Configure your UUID generation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="version">UUID Version</Label>
                <Select value={version} onValueChange={(value: UUIDVersion) => setVersion(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select UUID version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">
                      <div>
                        <div className="font-medium">UUID v1</div>
                        <div className="text-xs text-muted-foreground">Timestamp + MAC</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v4">
                      <div>
                        <div className="font-medium">UUID v4</div>
                        <div className="text-xs text-muted-foreground">Random (Recommended)</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v7">
                      <div>
                        <div className="font-medium">UUID v7</div>
                        <div className="text-xs text-muted-foreground">Timestamp + Random (New)</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {versionDescriptions[version]}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  Generate 1-100 UUIDs at once
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Formatting Options</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                  <Label htmlFor="uppercase">Uppercase</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-dashes"
                    checked={removeDashes}
                    onCheckedChange={setRemoveDashes}
                  />
                  <Label htmlFor="remove-dashes">Remove dashes</Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate UUID{quantity > 1 ? 's' : ''}
              </Button>
              {generatedUuids.length > 0 && (
                <>
                  <Button onClick={copyAllUuids} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button onClick={downloadUuids} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
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
              <CardTitle>Generated UUIDs</CardTitle>
              <CardDescription>
                {generatedUuids.length} UUID{generatedUuids.length > 1 ? 's' : ''} generated
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
                      onClick={() => copyToClipboard(item.uuid, 'UUID copied to clipboard')}
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
            <CardTitle>UUID Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">UUID v1</h4>
                <p className="text-muted-foreground">
                  Based on timestamp and MAC address. Predictable and may leak information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UUID v4</h4>
                <p className="text-muted-foreground">
                  Randomly generated. Most widely used and recommended for general purposes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UUID v7</h4>
                <p className="text-muted-foreground">
                  Timestamp-based with improved randomness. Good for database performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}