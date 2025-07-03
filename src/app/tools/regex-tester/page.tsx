/**
 * Regex Tester Tool
 * 正则表达式测试工具
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Copy, RotateCcw, CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [replacementText, setReplacementText] = useState('');
  const [replacedText, setReplacedText] = useState('');

  // Common regex patterns
  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Basic email validation' },
    { name: 'Phone (US)', pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})', description: 'US phone number format' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'HTTP/HTTPS URLs' },
    { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', description: 'IPv4 address' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'ISO date format' },
    { name: 'Time (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', description: '24-hour time format' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', description: 'Hexadecimal color codes' },
    { name: 'Credit Card', pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b', description: 'Credit card number format' },
    { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', description: 'Alphanumeric username 3-16 chars' },
    { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'At least 8 chars with mixed case, number, and symbol' }
  ];

  // Sample test strings
  const sampleTexts = {
    email: 'Contact us at support@example.com or sales@company.org for more information.',
    phone: 'Call us at (555) 123-4567 or 555.987.6543 for assistance.',
    url: 'Visit https://www.example.com or http://subdomain.site.org/path?param=value',
    mixed: `Here's some sample text with various patterns:
Email: john.doe@example.com
Phone: (555) 123-4567
Website: https://www.example.com
Date: 2024-01-15
Time: 14:30
Color: #FF5733
IP: 192.168.1.1`
  };

  // Build regex flags string
  const getFlagsString = (): string => {
    let flagsStr = '';
    if (flags.global) flagsStr += 'g';
    if (flags.ignoreCase) flagsStr += 'i';
    if (flags.multiline) flagsStr += 'm';
    if (flags.dotAll) flagsStr += 's';
    if (flags.unicode) flagsStr += 'u';
    if (flags.sticky) flagsStr += 'y';
    return flagsStr;
  };

  // Test regex pattern
  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setIsValid(true);
      setError('');
      setReplacedText('');
      return;
    }

    try {
      const regex = new RegExp(pattern, getFlagsString());
      setIsValid(true);
      setError('');

      // Find all matches
      const foundMatches: RegexMatch[] = [];
      let match;
      
      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Prevent infinite loop
          if (!flags.global) break;
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(foundMatches);

      // Handle replacement
      if (replacementText !== '') {
        try {
          const replaced = testString.replace(regex, replacementText);
          setReplacedText(replaced);
        } catch {
          setReplacedText('Error in replacement');
        }
      } else {
        setReplacedText('');
      }
    } catch (regexError) {
      setIsValid(false);
      setError((regexError as Error).message);
      setMatches([]);
      setReplacedText('');
    }
  }, [pattern, testString, flags, replacementText, getFlagsString]);

  const loadPattern = (patternData: typeof commonPatterns[0]) => {
    setPattern(patternData.pattern);
    toast.success(`Loaded ${patternData.name} pattern`);
  };

  const loadSampleText = (key: keyof typeof sampleTexts) => {
    setTestString(sampleTexts[key]);
    toast.success('Sample text loaded');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setReplacementText('');
    setMatches([]);
    setReplacedText('');
    toast.success('All fields cleared');
  };

  const highlightMatches = (text: string): React.ReactElement => {
    if (matches.length === 0) {
      return <span>{text}</span>;
    }

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`before-${i}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
          title={`Match ${i + 1}: "${match.match}" at position ${match.index}`}
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="after">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Regex Tester</h1>
          <p className="text-muted-foreground text-lg">
            Test and debug regular expressions with real-time matching and replacement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pattern Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Regular Expression
              </CardTitle>
              <CardDescription>
                Enter your regex pattern and configure flags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="pattern"
                    placeholder="Enter regex pattern..."
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                  />
                  <span className="text-muted-foreground">/{getFlagsString()}</span>
                </div>
                {!isValid && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <XCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                {isValid && pattern && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Valid regex pattern
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Flags</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="global"
                      checked={flags.global}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: checked }))}
                    />
                    <Label htmlFor="global" className="text-sm">Global (g)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignoreCase"
                      checked={flags.ignoreCase}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: checked }))}
                    />
                    <Label htmlFor="ignoreCase" className="text-sm">Ignore Case (i)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multiline"
                      checked={flags.multiline}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: checked }))}
                    />
                    <Label htmlFor="multiline" className="text-sm">Multiline (m)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dotAll"
                      checked={flags.dotAll}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, dotAll: checked }))}
                    />
                    <Label htmlFor="dotAll" className="text-sm">Dot All (s)</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Common Patterns</Label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {commonPatterns.map((patternData, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadPattern(patternData)}
                      className="justify-start h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">{patternData.name}</div>
                        <div className="text-xs text-muted-foreground">{patternData.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test String */}
          <Card>
            <CardHeader>
              <CardTitle>Test String</CardTitle>
              <CardDescription>
                Enter the text you want to test against your regex
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-string">Text to Test</Label>
                <Textarea
                  id="test-string"
                  placeholder="Enter text to test..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Sample Texts</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('email')}
                  >
                    Email Sample
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('phone')}
                  >
                    Phone Sample
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('url')}
                  >
                    URL Sample
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('mixed')}
                  >
                    Mixed Sample
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={clearAll} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {matches.length > 0 
                ? `Found ${matches.length} match${matches.length > 1 ? 'es' : ''}` 
                : 'No matches found'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="matches">
              <TabsList>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="highlighted">Highlighted Text</TabsTrigger>
                <TabsTrigger value="replace">Replace</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="space-y-4">
                {matches.length > 0 ? (
                  <div className="space-y-3">
                    {matches.map((match, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">Match {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(match.match, 'Match copied to clipboard')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Text:</span>
                            <span className="ml-2 font-mono bg-muted px-1 rounded">{match.match}</span>
                          </div>
                          <div>
                            <span className="font-medium">Position:</span>
                            <span className="ml-2">{match.index} - {match.index + match.match.length - 1}</span>
                          </div>
                          {match.groups.length > 0 && (
                            <div>
                              <span className="font-medium">Groups:</span>
                              <div className="ml-2 space-y-1">
                                {match.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="font-mono text-xs bg-muted px-1 rounded">
                                    Group {groupIndex + 1}: {group || '(empty)'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <p>Enter a pattern and test string to see matches</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="highlighted" className="space-y-4">
                {testString ? (
                  <div className="border rounded-lg p-4">
                    <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                      {highlightMatches(testString)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <p>Enter test string to see highlighted matches</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="replace" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="replacement">Replacement Text</Label>
                  <Input
                    id="replacement"
                    placeholder="Enter replacement text (use $1, $2 for groups)..."
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use $1, $2, etc. to reference capture groups, or $& for the entire match
                  </p>
                </div>
                
                {replacedText && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Replaced Text</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(replacedText, 'Replaced text copied to clipboard')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap bg-muted/50">
                      {replacedText}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}