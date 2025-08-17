/**
 * Password Generator Tool Page
 * 密码生成器工具页面
 */

'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Shield, Eye, EyeOff, Key } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface GeneratedPassword {
  password: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  entropy: number;
}

export default function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const [generatedPasswords, setGeneratedPasswords] = useState<GeneratedPassword[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [customChars, setCustomChars] = useState('');

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()|\/\\"\'"`~,;.<>'
  };

  // Calculate password strength
  const calculateStrength = useCallback((password: string): { strength: 'weak' | 'medium' | 'strong' | 'very-strong', entropy: number } => {
    let charsetSize = 0;
    
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
    
    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (entropy < 30) strength = 'weak';
    else if (entropy < 60) strength = 'medium';
    else if (entropy < 90) strength = 'strong';
    else strength = 'very-strong';
    
    return { strength, entropy: Math.round(entropy) };
  }, []);

  // Generate character set based on options
  const getCharacterSet = useCallback(() => {
    let charset = '';
    
    if (customChars) {
      charset = customChars;
    } else {
      if (options.includeUppercase) charset += charSets.uppercase;
      if (options.includeLowercase) charset += charSets.lowercase;
      if (options.includeNumbers) charset += charSets.numbers;
      if (options.includeSymbols) charset += charSets.symbols;
    }
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !charSets.similar.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }
    
    return charset;
  }, [
    options, 
    customChars, 
    charSets.ambiguous, 
    charSets.lowercase, 
    charSets.numbers, 
    charSets.similar, 
    charSets.symbols, 
    charSets.uppercase
  ]);

  // Generate single password
  const generatePassword = useCallback(() => {
    const charset = getCharacterSet();
    
    if (!charset) {
      toast.error('请至少选择一种字符类型');
      return null;
    }
    
    let password = '';
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    // Ensure at least one character from each selected type
    if (!customChars) {
      const requiredChars = [];
      if (options.includeUppercase) requiredChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
      if (options.includeLowercase) requiredChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
      if (options.includeNumbers) requiredChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
      if (options.includeSymbols) requiredChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
      
      // Replace random positions with required characters
      const passwordArray = password.split('');
      requiredChars.forEach((char, index) => {
        if (index < passwordArray.length) {
          passwordArray[index] = char;
        }
      });
      
      // Shuffle the array
      for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
      }
      
      password = passwordArray.join('');
    }
    
    const { strength, entropy } = calculateStrength(password);
    return { password, strength, entropy };
  }, [
    options, 
    customChars, 
    getCharacterSet, 
    calculateStrength,
    charSets.lowercase,
    charSets.numbers, 
    charSets.symbols, 
    charSets.uppercase
  ]);

  // Generate multiple passwords
  const generateMultiplePasswords = (count: number = 5) => {
    const passwords: GeneratedPassword[] = [];
    
    for (let i = 0; i < count; i++) {
      const result = generatePassword();
      if (result) {
        passwords.push(result);
      }
    }
    
    setGeneratedPasswords(passwords);
    toast.success(`已生成 ${passwords.length} 个密码`);
  };

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success('密码已复制到剪贴板');
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'very-strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'weak': return '弱';
      case 'medium': return '中等';
      case 'strong': return '强';
      case 'very-strong': return '很强';
      default: return '未知';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Key className="w-10 h-10 text-primary" />
          密码生成器
        </h1>
        <p className="text-muted-foreground">
          生成安全的随机密码，支持多种自定义选项
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>密码设置</CardTitle>
              <CardDescription>
                自定义密码生成选项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">密码长度</label>
                  <Badge variant="secondary">{options.length}</Badge>
                </div>
                <Slider
                  value={[options.length]}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
                  min={4}
                  max={128}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Character Types */}
              <div className="space-y-4">
                <label className="text-sm font-medium">字符类型</label>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">大写字母 (A-Z)</span>
                  <Switch
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeUppercase: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">小写字母 (a-z)</span>
                  <Switch
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeLowercase: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">数字 (0-9)</span>
                  <Switch
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeNumbers: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">特殊符号</span>
                  <Switch
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeSymbols: checked }))}
                  />
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <label className="text-sm font-medium">高级选项</label>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">排除相似字符</span>
                  <Switch
                    checked={options.excludeSimilar}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, excludeSimilar: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">排除易混淆字符</span>
                  <Switch
                    checked={options.excludeAmbiguous}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, excludeAmbiguous: checked }))}
                  />
                </div>
              </div>

              {/* Custom Characters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">自定义字符集</label>
                <Input
                  value={customChars}
                  onChange={(e) => setCustomChars(e.target.value)}
                  placeholder="输入自定义字符（可选）"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  如果设置了自定义字符集，将忽略上述字符类型选项
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                密码生成器
                <Button
                  variant="outline"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
              <CardDescription>
                点击生成按钮创建安全密码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generate Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => generateMultiplePasswords(1)}
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  生成密码
                </Button>
                <Button
                  variant="outline"
                  onClick={() => generateMultiplePasswords(5)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  生成5个
                </Button>
              </div>

              {/* Generated Passwords */}
              {generatedPasswords.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">生成的密码</label>
                  {generatedPasswords.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm break-all">
                          {showPasswords ? item.password : '•'.repeat(item.password.length)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-white ${getStrengthColor(item.strength)}`}
                          >
                            {getStrengthText(item.strength)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            熵值: {item.entropy} bits
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.password)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <CardTitle>安全建议</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-1">✅ 推荐做法</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 使用至少12位字符</li>
                    <li>• 包含多种字符类型</li>
                    <li>• 为每个账户使用不同密码</li>
                    <li>• 使用密码管理器</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">❌ 避免做法</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 使用个人信息</li>
                    <li>• 使用常见密码</li>
                    <li>• 在多个地方重复使用</li>
                    <li>• 明文保存密码</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}