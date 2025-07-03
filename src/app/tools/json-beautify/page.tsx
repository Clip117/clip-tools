/**
 * JSON Beautifier Tool
 * JSON美化工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Copy, RotateCcw, Download, FileText, Wand2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FormatType = 'beautify' | 'minify' | 'validate';

export default function JsonBeautifyPage() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [formatType, setFormatType] = useState<FormatType>('beautify');
  const [indentSize, setIndentSize] = useState([2]);
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateJson = (jsonString: string): { isValid: boolean; error?: string; parsed?: unknown } => {
    if (!jsonString.trim()) {
      return { isValid: false, error: 'JSON string is empty' };
    }

    try {
      const parsed = JSON.parse(jsonString);
      return { isValid: true, parsed };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      return { isValid: false, error: errorMessage };
    }
  };

  const sortObjectKeys = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sortedObj: Record<string, unknown> = {};
      const objRecord = obj as Record<string, unknown>;
      Object.keys(objRecord)
        .sort()
        .forEach(key => {
          sortedObj[key] = sortObjectKeys(objRecord[key]);
        });
      return sortedObj;
    }
    return obj;
  };

  const escapeUnicodeChars = (str: string): string => {
    return str.replace(/[\u0080-\uFFFF]/g, (match) => {
      return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).substr(-4);
    });
  };

  const beautifyJson = (jsonString: string): string => {
    const validation = validateJson(jsonString);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    let processedData = validation.parsed;
    if (sortKeys) {
      processedData = sortObjectKeys(processedData);
    }

    let result = JSON.stringify(processedData, null, indentSize[0]);
    
    if (escapeUnicode) {
      result = escapeUnicodeChars(result);
    }

    return result;
  };

  const minifyJson = (jsonString: string): string => {
    const validation = validateJson(jsonString);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    let processedData = validation.parsed;
    if (sortKeys) {
      processedData = sortObjectKeys(processedData);
    }

    let result = JSON.stringify(processedData);
    
    if (escapeUnicode) {
      result = escapeUnicodeChars(result);
    }

    return result;
  };

  const handleFormat = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter some JSON to format');
      return;
    }

    try {
      let result = '';
      
      switch (formatType) {
        case 'beautify':
          result = beautifyJson(inputJson);
          break;
        case 'minify':
          result = minifyJson(inputJson);
          break;
        case 'validate':
          const validation = validateJson(inputJson);
          if (validation.isValid) {
            result = 'JSON is valid ✓';
            setIsValid(true);
            setValidationError('');
          } else {
            setIsValid(false);
            setValidationError(validation.error || 'Invalid JSON');
            result = '';
          }
          break;
      }
      
      setOutputJson(result);
      
      if (formatType !== 'validate') {
        setIsValid(true);
        setValidationError('');
        toast.success(`JSON ${formatType === 'beautify' ? 'beautified' : 'minified'} successfully!`);
      } else if (isValid) {
        toast.success('JSON is valid!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to format JSON';
      setValidationError(errorMessage);
      setIsValid(false);
      setOutputJson('');
      toast.error(errorMessage);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const downloadJson = () => {
    if (!outputJson) {
      toast.error('No formatted JSON to download');
      return;
    }

    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${formatType}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded!');
  };

  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setValidationError('');
    setIsValid(null);
    toast.success('All fields cleared');
  };

  const loadSample = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001",
        "country": "USA"
      },
      "isActive": true,
      "balance": 1234.56,
      "metadata": {
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T12:30:00Z",
        "version": "1.0.0"
      }
    };
    
    setInputJson(JSON.stringify(sampleJson, null, 2));
    toast.success('Sample JSON loaded');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON Beautifier</h1>
        <p className="text-muted-foreground">
          Format, validate, and beautify JSON data with customizable options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input JSON
            </CardTitle>
            <CardDescription>
              Paste your JSON data here to format or validate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-json">JSON Data</Label>
              <Textarea
                id="input-json"
                placeholder="Paste your JSON here..."
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={loadSample} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Load Sample
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Formatted JSON
            </CardTitle>
            <CardDescription>
              The formatted result will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            {isValid === true && formatType === 'validate' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-green-600">
                  JSON is valid ✓
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="output-json">Formatted Result</Label>
              <Textarea
                id="output-json"
                value={outputJson}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Formatted JSON will appear here..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => copyToClipboard(outputJson, 'Formatted JSON copied to clipboard!')}
                disabled={!outputJson}
                variant="outline" 
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Result
              </Button>
              <Button 
                onClick={downloadJson}
                disabled={!outputJson || formatType === 'validate'}
                variant="outline" 
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Formatting Options</CardTitle>
          <CardDescription>
            Customize how your JSON is formatted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Format Type */}
            <div className="space-y-2">
              <Label>Format Type</Label>
              <Select value={formatType} onValueChange={(value: FormatType) => setFormatType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beautify">Beautify</SelectItem>
                  <SelectItem value="minify">Minify</SelectItem>
                  <SelectItem value="validate">Validate Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indent Size */}
            {formatType === 'beautify' && (
              <div className="space-y-2">
                <Label>Indent Size: {indentSize[0]} spaces</Label>
                <Slider
                  value={indentSize}
                  onValueChange={setIndentSize}
                  max={8}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Sort Keys */}
            <div className="space-y-2">
              <Label>Sort Keys</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sortKeys}
                  onCheckedChange={setSortKeys}
                />
                <span className="text-sm text-muted-foreground">
                  {sortKeys ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Escape Unicode */}
            <div className="space-y-2">
              <Label>Escape Unicode</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={escapeUnicode}
                  onCheckedChange={setEscapeUnicode}
                />
                <span className="text-sm text-muted-foreground">
                  {escapeUnicode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleFormat} className="w-full md:w-auto">
              <Wand2 className="h-4 w-4 mr-2" />
              {formatType === 'beautify' ? 'Beautify JSON' : 
               formatType === 'minify' ? 'Minify JSON' : 'Validate JSON'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About JSON Formatting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Beautify</h4>
              <p className="text-muted-foreground">
                Formats JSON with proper indentation and line breaks for better readability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Minify</h4>
              <p className="text-muted-foreground">
                Removes all unnecessary whitespace to reduce file size.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Validate</h4>
              <p className="text-muted-foreground">
                Checks if the JSON syntax is valid without formatting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}