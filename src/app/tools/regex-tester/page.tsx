/**
 * Regex Tester Tool
 * 正则表达式测试工具
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // 常用正则表达式模式
  const commonPatterns = [
    { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: '基本邮箱验证' },
    { name: '手机号码', pattern: '1[3-9]\\d{9}', description: '中国手机号码格式' },
    { name: '网址', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'HTTP/HTTPS 网址' },
    { name: 'IPv4地址', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', description: 'IPv4 地址' },
    { name: '日期 (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'ISO 日期格式' },
    { name: '时间 (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', description: '24小时时间格式' },
    { name: '十六进制颜色', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', description: '十六进制颜色代码' },
    { name: '身份证号', pattern: '[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]', description: '中国身份证号码' },
    { name: '用户名', pattern: '^[a-zA-Z0-9_]{3,16}$', description: '字母数字下划线，3-16位' },
    { name: '强密码', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: '至少8位，包含大小写字母、数字和特殊字符' }
  ];

  // 示例测试文本
  const sampleTexts = {
    email: '请联系我们：support@example.com 或 sales@company.org 获取更多信息。',
    phone: '请拨打 13812345678 或 15987654321 联系我们。',
    url: '访问 https://www.example.com 或 http://subdomain.site.org/path?param=value',
    mixed: `这里是包含各种模式的示例文本：
邮箱：john.doe@example.com
手机：13812345678
网站：https://www.example.com
日期：2024-01-15
时间：14:30
颜色：#FF5733
IP：192.168.1.1
身份证：110101199001011234`
  };

  // 构建正则表达式标志字符串
  const getFlagsString = useCallback((): string => {
    let flagsStr = '';
    if (flags.global) flagsStr += 'g';
    if (flags.ignoreCase) flagsStr += 'i';
    if (flags.multiline) flagsStr += 'm';
    if (flags.dotAll) flagsStr += 's';
    if (flags.unicode) flagsStr += 'u';
    if (flags.sticky) flagsStr += 'y';
    return flagsStr;
  }, [flags]);

  // 测试正则表达式模式
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

      // 查找所有匹配项
      const foundMatches: RegexMatch[] = [];
      let match;
      
      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // 防止无限循环
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

      // 处理替换
      if (replacementText !== '') {
        try {
          const replaced = testString.replace(regex, replacementText);
          setReplacedText(replaced);
        } catch {
          setReplacedText('替换时出错');
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
    toast.success(`已加载 ${patternData.name} 模式`);
  };

  const loadSampleText = (key: keyof typeof sampleTexts) => {
    setTestString(sampleTexts[key]);
    toast.success('示例文本已加载');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('复制到剪贴板失败'));
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setReplacementText('');
    setMatches([]);
    setReplacedText('');
    toast.success('所有字段已清空');
  };

  const highlightMatches = (text: string): React.ReactElement => {
    if (matches.length === 0) {
      return <span>{text}</span>;
    }

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={`before-${i}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // 添加高亮的匹配项
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
          title={`匹配 ${i + 1}: "${match.match}" 位置 ${match.index}`}
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // 添加剩余文本
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
          <h1 className="text-4xl font-bold mb-4">正则表达式测试器</h1>
          <p className="text-muted-foreground text-lg">
            实时测试和调试正则表达式，支持匹配和替换功能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 模式输入 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                正则表达式
              </CardTitle>
              <CardDescription>
                输入您的正则表达式模式并配置标志
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern">模式</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="pattern"
                    placeholder="输入正则表达式模式..."
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
                    有效的正则表达式模式
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>标志</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="global"
                      checked={flags.global}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: checked }))}
                    />
                    <Label htmlFor="global" className="text-sm">全局 (g)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignoreCase"
                      checked={flags.ignoreCase}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: checked }))}
                    />
                    <Label htmlFor="ignoreCase" className="text-sm">忽略大小写 (i)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multiline"
                      checked={flags.multiline}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: checked }))}
                    />
                    <Label htmlFor="multiline" className="text-sm">多行 (m)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dotAll"
                      checked={flags.dotAll}
                      onCheckedChange={(checked) => setFlags(prev => ({ ...prev, dotAll: checked }))}
                    />
                    <Label htmlFor="dotAll" className="text-sm">点匹配所有 (s)</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>常用模式</Label>
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

          {/* 测试字符串 */}
          <Card>
            <CardHeader>
              <CardTitle>测试字符串</CardTitle>
              <CardDescription>
                输入要测试正则表达式的文本
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-string">测试文本</Label>
                <Textarea
                  id="test-string"
                  placeholder="输入要测试的文本..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>示例文本</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('email')}
                  >
                    邮箱示例
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('phone')}
                  >
                    手机示例
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('url')}
                  >
                    网址示例
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadSampleText('mixed')}
                  >
                    混合示例
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={clearAll} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  清空所有
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 结果 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>结果</CardTitle>
            <CardDescription>
              {matches.length > 0 
                ? `找到 ${matches.length} 个匹配项` 
                : '未找到匹配项'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="matches">
              <TabsList>
                <TabsTrigger value="matches">匹配项</TabsTrigger>
                <TabsTrigger value="highlighted">高亮文本</TabsTrigger>
                <TabsTrigger value="replace">替换</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="space-y-4">
                {matches.length > 0 ? (
                  <div className="space-y-3">
                    {matches.map((match, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">匹配 {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(match.match, '匹配项已复制到剪贴板')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            复制
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">文本：</span>
                            <span className="ml-2 font-mono bg-muted px-1 rounded">{match.match}</span>
                          </div>
                          <div>
                            <span className="font-medium">位置：</span>
                            <span className="ml-2">{match.index} - {match.index + match.match.length - 1}</span>
                          </div>
                          {match.groups.length > 0 && (
                            <div>
                              <span className="font-medium">分组：</span>
                              <div className="ml-2 space-y-1">
                                {match.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="font-mono text-xs bg-muted px-1 rounded">
                                    分组 {groupIndex + 1}: {group || '(空)'}
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
                    <p>输入模式和测试字符串以查看匹配项</p>
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
                    <p>输入测试字符串以查看高亮匹配项</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="replace" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="replacement">替换文本</Label>
                  <Input
                    id="replacement"
                    placeholder="输入替换文本（使用 $1, $2 引用分组）..."
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    使用 $1, $2 等引用捕获分组，或使用 $& 引用整个匹配项
                  </p>
                </div>
                
                {replacedText && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>替换后的文本</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(replacedText, '替换后的文本已复制到剪贴板')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        复制
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