/**
 * CSV to JSON Converter Tool
 * CSV转JSON转换工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Copy, RotateCcw, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [trimValues, setTrimValues] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample CSV data
  const sampleCsv = `id,name,email,age,active
1,John Doe,john@example.com,32,true
2,Jane Smith,jane@example.com,28,true
3,Bob Johnson,bob@example.com,45,false
4,Alice Williams,alice@example.com,36,true`;

  const parseCsv = () => {
    if (!csvInput.trim()) {
      toast.error('Please enter CSV data');
      return;
    }

    setIsProcessing(true);

    try {
      // Split the CSV into lines
      const lines = csvInput.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        toast.error('No valid CSV data found');
        setIsProcessing(false);
        return;
      }

      // Parse headers
      let headers: string[] = [];
      let startIndex = 0;

      if (hasHeader) {
        headers = lines[0].split(delimiter).map(header => 
          trimValues ? header.trim() : header
        );
        startIndex = 1;
      }

      // Parse rows
      const jsonArray = [];

      for (let i = startIndex; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(value => 
          trimValues ? value.trim() : value
        );
        
        if (hasHeader) {
          // Create object with headers as keys
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            // Handle case where values might be fewer than headers
            if (index < values.length) {
              obj[header] = values[index];
            } else {
              obj[header] = '';
            }
          });
          jsonArray.push(obj);
        } else {
          // Without headers, just use array of values
          jsonArray.push(values);
        }
      }

      // Convert to formatted JSON string
      const jsonString = JSON.stringify(jsonArray, null, 2);
      setJsonOutput(jsonString);
      toast.success('CSV converted to JSON successfully!');
    } catch (error) {
      toast.error('Failed to convert CSV to JSON');
      console.error('CSV parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvInput(content);
      toast.success('CSV file loaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read the file');
    };
    reader.readAsText(file);
  };

  const downloadJson = () => {
    if (!jsonOutput) {
      toast.error('No JSON data to download');
      return;
    }

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded successfully!');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const clearAll = () => {
    setCsvInput('');
    setJsonOutput('');
    toast.success('All data cleared');
  };

  const loadSampleData = () => {
    setCsvInput(sampleCsv);
    toast.success('Sample CSV data loaded');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">CSV to JSON Converter</h1>
          <p className="text-muted-foreground text-lg">
            Convert CSV data to JSON format with customizable options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                CSV Input
              </CardTitle>
              <CardDescription>
                Enter or upload your CSV data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your CSV data here..."
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={loadSampleData} variant="outline">
                  Load Sample
                </Button>
                <Button onClick={clearAll} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Conversion Options</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="delimiter">Delimiter</Label>
                  <Input
                    id="delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder="Enter delimiter"
                    className="max-w-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Common delimiters: comma (,), semicolon (;), tab (\t), pipe (|)
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-header"
                    checked={hasHeader}
                    onCheckedChange={setHasHeader}
                  />
                  <Label htmlFor="has-header">First row contains headers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trim-values"
                    checked={trimValues}
                    onCheckedChange={setTrimValues}
                  />
                  <Label htmlFor="trim-values">Trim whitespace from values</Label>
                </div>
                
                <Button 
                  onClick={parseCsv} 
                  disabled={isProcessing || !csvInput.trim()}
                  className="w-full"
                >
                  Convert to JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                JSON Output
              </CardTitle>
              <CardDescription>
                Generated JSON data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="pretty" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="compact">Compact</TabsTrigger>
                </TabsList>
                <TabsContent value="pretty" className="pt-4">
                  <Textarea
                    value={jsonOutput}
                    readOnly
                    placeholder="JSON output will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="compact" className="pt-4">
                  <Textarea
                    value={jsonOutput ? JSON.stringify(JSON.parse(jsonOutput)) : ''}
                    readOnly
                    placeholder="JSON output will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={downloadJson}
                  disabled={!jsonOutput}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
                <Button
                  onClick={() => copyToClipboard(jsonOutput, 'JSON copied to clipboard')}
                  disabled={!jsonOutput}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Customizable Delimiters</h4>
                <p className="text-muted-foreground">
                  Support for comma, semicolon, tab, and custom delimiters
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Header Row Options</h4>
                <p className="text-muted-foreground">
                  Convert with or without header rows for flexible output formats
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Cleaning</h4>
                <p className="text-muted-foreground">
                  Option to trim whitespace from values for cleaner JSON output
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}