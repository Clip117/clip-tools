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
type DateFormat = 'iso' | 'local' | 'utc' | 'custom';

export default function TimestampConverterPage() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>('milliseconds');
  const [dateFormat, setDateFormat] = useState<DateFormat>('iso');
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss');
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

  const formatDate = (date: Date, format: DateFormat): string => {
    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'local':
        return date.toLocaleString();
      case 'utc':
        return date.toUTCString();
      case 'custom':
        // Simple custom format implementation
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return customFormat
          .replace('YYYY', year.toString())
          .replace('MM', month)
          .replace('DD', day)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds);
      default:
        return date.toISOString();
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
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const setCurrentTimestamp = () => {
    const now = Date.now();
    const timestamp = convertDateToTimestamp(new Date(now), timestampUnit);
    setInputTimestamp(timestamp.toString());
    toast.success('Current timestamp set');
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().split(' ')[0].substring(0, 5));
    toast.success('Current date and time set');
  };

  // Convert timestamp to date
  const timestampDate = inputTimestamp ? convertTimestampToDate(inputTimestamp, timestampUnit) : null;
  const isValidTimestamp = timestampDate && !isNaN(timestampDate.getTime());

  // Convert date to timestamp
  const dateTimestamp = getTimestampFromInput();
  const convertedTimestamp = convertDateToTimestamp(new Date(dateTimestamp), timestampUnit);

  const timezones = [
    { value: 'local', label: 'Local Time' },
    { value: 'utc', label: 'UTC' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Timestamp Converter</h1>
          <p className="text-muted-foreground text-lg">
            Convert between timestamps and human-readable dates
          </p>
        </div>

        {/* Current Time Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Label>Unix Timestamp (seconds)</Label>
                <div className="font-mono text-lg p-2 bg-muted rounded">
                  {Math.floor(currentTime / 1000)}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(Math.floor(currentTime / 1000).toString(), 'Timestamp copied')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Milliseconds</Label>
                <div className="font-mono text-lg p-2 bg-muted rounded">
                  {currentTime}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(currentTime.toString(), 'Timestamp copied')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Human Readable</Label>
                <div className="text-lg p-2 bg-muted rounded">
                  {new Date(currentTime).toLocaleString()}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(new Date(currentTime).toLocaleString(), 'Date copied')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="timestamp-to-date" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timestamp-to-date">Timestamp → Date</TabsTrigger>
            <TabsTrigger value="date-to-timestamp">Date → Timestamp</TabsTrigger>
          </TabsList>

          {/* Timestamp to Date */}
          <TabsContent value="timestamp-to-date">
            <Card>
              <CardHeader>
                <CardTitle>Convert Timestamp to Date</CardTitle>
                <CardDescription>
                  Enter a timestamp to convert it to a human-readable date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timestamp-input">Timestamp</Label>
                    <div className="flex gap-2">
                      <Input
                        id="timestamp-input"
                        placeholder="Enter timestamp..."
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                      />
                      <Button onClick={setCurrentTimestamp} variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timestamp-unit">Unit</Label>
                    <Select value={timestampUnit} onValueChange={(value: TimestampUnit) => setTimestampUnit(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="milliseconds">Milliseconds</SelectItem>
                        <SelectItem value="microseconds">Microseconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isValidTimestamp && timestampDate && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold">Converted Date</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>ISO 8601</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toISOString()}
                        </div>
                      </div>
                      <div>
                        <Label>Local Time</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label>UTC</Label>
                        <div className="font-mono text-sm p-2 bg-background border rounded">
                          {timestampDate.toUTCString()}
                        </div>
                      </div>
                      <div>
                        <Label>Relative Time</Label>
                        <div className="text-sm p-2 bg-background border rounded">
                          {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
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
                <CardTitle>Convert Date to Timestamp</CardTitle>
                <CardDescription>
                  Select a date and time to convert it to a timestamp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-input">Date</Label>
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
                    <Label htmlFor="time-input">Time</Label>
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
                    <Label htmlFor="timezone-select">Timezone</Label>
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
                  <h3 className="font-semibold">Generated Timestamps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Seconds</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{Math.floor(dateTimestamp / 1000)}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(Math.floor(dateTimestamp / 1000).toString(), 'Timestamp copied')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Milliseconds</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{dateTimestamp}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(dateTimestamp.toString(), 'Timestamp copied')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Microseconds</Label>
                      <div className="font-mono text-sm p-2 bg-background border rounded flex items-center justify-between">
                        <span>{dateTimestamp * 1000}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard((dateTimestamp * 1000).toString(), 'Timestamp copied')}
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
              Timestamp Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Unix Timestamp</h4>
                <p className="text-muted-foreground">
                  Number of seconds since January 1, 1970 UTC. Most commonly used format.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Milliseconds</h4>
                <p className="text-muted-foreground">
                  JavaScript and many APIs use milliseconds since Unix epoch for higher precision.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Microseconds</h4>
                <p className="text-muted-foreground">
                  Used in high-precision applications and some database systems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}