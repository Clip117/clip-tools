/**
 * Timestamp Converter Tool
 * 时间戳转换工具
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Copy, RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'sonner';

type TimestampUnit = 'seconds' | 'milliseconds' | 'microseconds';

export default function TimestampConverterPage() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>('milliseconds');

  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [timezone, setTimezone] = useState('local');

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize with current date and time
  useEffect(() => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().split(' ')[0].substring(0, 5));
  }, []);

  const convertTimestampToDate = (timestamp: string, unit: TimestampUnit): Date | null => {
    const num = parseFloat(timestamp);
    if (isNaN(num)) return null;

    let milliseconds: number;
    switch (unit) {
      case 'seconds':
        milliseconds = num * 1000;
        break;
      case 'milliseconds':
        milliseconds = num;
        break;
      case 'microseconds':
        milliseconds = num / 1000;
        break;
      default:
        milliseconds = num;
    }

    return new Date(milliseconds);
  };

  const convertDateToTimestamp = (date: Date, unit: TimestampUnit): number => {
    const milliseconds = date.getTime();
    switch (unit) {
      case 'seconds':
        return Math.floor(milliseconds / 1000);
      case 'milliseconds':
        return milliseconds;
      case 'microseconds':
        return milliseconds * 1000;
      default:
        return milliseconds;
    }
  };

  const getTimestampFromInput = (): number => {
    if (!inputDate || !inputTime) return Date.now();
    
    const dateTimeString = `${inputDate}T${inputTime}:00`;
    const date = new Date(dateTimeString);
    
    if (timezone === 'utc') {
      return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
    }
    
    return date.getTime();
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('复制到剪贴板失败'));
  };

  const setCurrentTimestamp = () => {
    const now = Date.now();
    const timestamp = convertDateToTimestamp(new Date(now), timestampUnit);
    setInputTimestamp(timestamp.toString());
    toast.success('当前时间戳已设置');
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().split(' ')[0].substring(0, 5));
    toast.success('当前日期和时间已设置');
  };

  // Convert timestamp to date
  const timestampDate = inputTimestamp ? convertTimestampToDate(inputTimestamp, timestampUnit) : null;
  const isValidTimestamp = timestampDate && !isNaN(timestampDate.getTime());

  // Convert date to timestamp
  const dateTimestamp = getTimestampFromInput();
  convertDateToTimestamp(new Date(dateTimestamp), timestampUnit);

  const timezones = [
    { value: 'local', label: '本地时间' },
    { value: 'utc', label: 'UTC' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">时间戳转换器</h1>
          <p className="text-muted-foreground text-lg">
            在时间戳和人类可读日期之间进行转换
          </p>
        </div>

        {/* Current Time Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              当前时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Label>Unix 时间戳 (秒)</Label>
                <div className="font-mono text-lg p-2 bg-muted rounded">
                  {Math.floor(currentTime / 1000)}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(Math.floor(currentTime / 1000).toString(), '时间戳已复制')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
              <div className="space-y-2">
                <Label>毫秒</Label>
                <div className="font-mono text-lg p-2 bg-muted rounded">
                  {currentTime}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(currentTime.toString(), '时间戳已复制')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
              <div className="space-y-2">
                <Label>人类可读格式</Label>
                <div className="text-lg p-2 bg-muted rounded">
                  {new Date(currentTime).toLocaleString('zh-CN')}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(new Date(currentTime).toLocaleString('zh-CN'), '日期已复制')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="timestamp-to-date" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timestamp-to-date">时间戳 → 日期</TabsTrigger>
            <TabsTrigger value="date-to-timestamp">日期 → 时间戳</TabsTrigger>
          </TabsList>

          {/* Timestamp to Date */}
          <TabsContent value="timestamp-to-date">
            <Card>
              <CardHeader>
                <CardTitle>将时间戳转换为日期</CardTitle>
                <CardDescription>
                  输入时间戳将其转换为人类可读的日期
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timestamp-input">时间戳</Label>
                    <div className="flex gap-2">
                      <Input
                        id="timestamp-input"
                        placeholder="输入时间戳..."
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                      />
                      <Button onClick={setCurrentTimestamp} variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timestamp-unit">单位</Label>
                    <Select value={timestampUnit} onValueChange={(value: TimestampUnit) => setTimestampUnit(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">秒</SelectItem>
                        <SelectItem value="milliseconds">毫秒</SelectItem>
                        <SelectItem value="microseconds">微秒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isValidTimestamp && timestampDate && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold">转换后的日期</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>ISO 8601</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toISOString()}
                        </div>
                      </div>
                      <div>
                        <Label>本地时间</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toLocaleString('zh-CN')}
                        </div>
                      </div>
                      <div>
                        <Label>UTC</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toUTCString()}
                        </div>
                      </div>
                      <div>
                        <Label>相对时间</Label>
                        <div className="text-sm p-2 bg-background border rounded">
                          {new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' }).format(
                            Math.round((timestampDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                            'day'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Date to Timestamp */}
          <TabsContent value="date-to-timestamp">
            <Card>
              <CardHeader>
                <CardTitle>将日期转换为时间戳</CardTitle>
                <CardDescription>
                  选择日期和时间将其转换为时间戳
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-input">日期</Label>
                    <div className="flex gap-2">
                      <Input
                        id="date-input"
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-input">时间</Label>
                    <div className="flex gap-2">
                      <Input
                        id="time-input"
                        type="time"
                        value={inputTime}
                        onChange={(e) => setInputTime(e.target.value)}
                      />
                      <Button onClick={setCurrentDateTime} variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone-select">时区</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">生成的时间戳</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>秒</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{Math.floor(dateTimestamp / 1000)}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(Math.floor(dateTimestamp / 1000).toString(), '时间戳已复制')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>毫秒</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{dateTimestamp}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(dateTimestamp.toString(), '时间戳已复制')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>微秒</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{dateTimestamp * 1000}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard((dateTimestamp * 1000).toString(), '时间戳已复制')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              时间戳信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Unix 时间戳</h4>
                <p className="text-muted-foreground">
                  自 1970 年 1 月 1 日 UTC 以来的秒数。最常用的格式。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">毫秒</h4>
                <p className="text-muted-foreground">
                  JavaScript 和许多 API 使用自 Unix 纪元以来的毫秒数以获得更高精度。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">微秒</h4>
                <p className="text-muted-foreground">
                  用于高精度应用程序和某些数据库系统。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}