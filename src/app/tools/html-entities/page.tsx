/**
 * HTML Entities Encoder/Decoder Tool
 * HTML实体编码/解码工具
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RotateCcw, Code, FileText, ArrowRightLeft, Tag } from 'lucide-react';
import { toast } from 'sonner';

type EncodingType = 'named' | 'numeric' | 'hex';

export default function HtmlEntitiesPage() {
  const [inputText, setInputText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [encodingType, setEncodingType] = useState<EncodingType>('named');

  // HTML entity mappings
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;',
    '¡': '&iexcl;',
    '¢': '&cent;',
    '£': '&pound;',
    '¤': '&curren;',
    '¥': '&yen;',
    '¦': '&brvbar;',
    '§': '&sect;',
    '¨': '&uml;',
    '©': '&copy;',
    'ª': '&ordf;',
    '«': '&laquo;',
    '¬': '&not;',
    '®': '&reg;',
    '¯': '&macr;',
    '°': '&deg;',
    '±': '&plusmn;',
    '²': '&sup2;',
    '³': '&sup3;',
    '´': '&acute;',
    'µ': '&micro;',
    '¶': '&para;',
    '·': '&middot;',
    '¸': '&cedil;',
    '¹': '&sup1;',
    'º': '&ordm;',
    '»': '&raquo;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '¿': '&iquest;',
    'À': '&Agrave;',
    'Á': '&Aacute;',
    'Â': '&Acirc;',
    'Ã': '&Atilde;',
    'Ä': '&Auml;',
    'Å': '&Aring;',
    'Æ': '&AElig;',
    'Ç': '&Ccedil;',
    'È': '&Egrave;',
    'É': '&Eacute;',
    'Ê': '&Ecirc;',
    'Ë': '&Euml;',
    'Ì': '&Igrave;',
    'Í': '&Iacute;',
    'Î': '&Icirc;',
    'Ï': '&Iuml;',
    'Ð': '&ETH;',
    'Ñ': '&Ntilde;',
    'Ò': '&Ograve;',
    'Ó': '&Oacute;',
    'Ô': '&Ocirc;',
    'Õ': '&Otilde;',
    'Ö': '&Ouml;',
    '×': '&times;',
    'Ø': '&Oslash;',
    'Ù': '&Ugrave;',
    'Ú': '&Uacute;',
    'Û': '&Ucirc;',
    'Ü': '&Uuml;',
    'Ý': '&Yacute;',
    'Þ': '&THORN;',
    'ß': '&szlig;',
    'à': '&agrave;',
    'á': '&aacute;',
    'â': '&acirc;',
    'ã': '&atilde;',
    'ä': '&auml;',
    'å': '&aring;',
    'æ': '&aelig;',
    'ç': '&ccedil;',
    'è': '&egrave;',
    'é': '&eacute;',
    'ê': '&ecirc;',
    'ë': '&euml;',
    'ì': '&igrave;',
    'í': '&iacute;',
    'î': '&icirc;',
    'ï': '&iuml;',
    'ð': '&eth;',
    'ñ': '&ntilde;',
    'ò': '&ograve;',
    'ó': '&oacute;',
    'ô': '&ocirc;',
    'õ': '&otilde;',
    'ö': '&ouml;',
    '÷': '&divide;',
    'ø': '&oslash;',
    'ù': '&ugrave;',
    'ú': '&uacute;',
    'û': '&ucirc;',
    'ü': '&uuml;',
    'ý': '&yacute;',
    'þ': '&thorn;',
    'ÿ': '&yuml;'
  };

  // Reverse mapping for decoding
  const reverseEntities: Record<string, string> = {};
  Object.entries(htmlEntities).forEach(([char, entity]) => {
    reverseEntities[entity] = char;
  });

  const encodeHtmlEntities = (text: string, type: EncodingType): string => {
    return text.replace(/[&<>"'\u00A0-\u9999]/g, (match) => {
      switch (type) {
        case 'named':
          return htmlEntities[match] || match;
        case 'numeric':
          return `&#${match.charCodeAt(0)};`;
        case 'hex':
          return `&#x${match.charCodeAt(0).toString(16).toUpperCase()};`;
        default:
          return match;
      }
    });
  };

  const decodeHtmlEntities = (text: string): string => {
    // Decode named entities
    let decoded = text.replace(/&[a-zA-Z][a-zA-Z0-9]*;/g, (match) => {
      return reverseEntities[match] || match;
    });
    
    // Decode numeric entities
    decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
      return String.fromCharCode(parseInt(num, 10));
    });
    
    // Decode hex entities
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    return decoded;
  };

  const handleEncode = () => {
    if (!inputText.trim()) {
      toast.error('请输入要编码的文本');
      return;
    }
    
    const encoded = encodeHtmlEntities(inputText, encodingType);
    setEncodedText(encoded);
    toast.success('文本编码成功！');
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      toast.error('请输入要解码的文本');
      return;
    }
    
    const decoded = decodeHtmlEntities(inputText);
    setDecodedText(decoded);
    toast.success('文本解码成功！');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('复制到剪贴板失败'));
  };

  const clearAll = () => {
    setInputText('');
    setEncodedText('');
    setDecodedText('');
    toast.success('已清空所有字段');
  };

  const swapTexts = () => {
    if (encodedText) {
      setInputText(encodedText);
      setEncodedText('');
      setDecodedText('');
      toast.success('编码文本已移至输入框');
    } else if (decodedText) {
      setInputText(decodedText);
      setEncodedText('');
      setDecodedText('');
      toast.success('解码文本已移至输入框');
    }
  };

  // Sample texts
  const sampleTexts = {
    basic: 'Hello & welcome to <HTML> "encoding" test!',
    advanced: 'Special chars: © ® ™ € £ ¥ § ¶ • … « » ‹ ›'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Tag className="w-10 h-10 text-primary" />
          HTML实体编码/解码
        </h1>
        <p className="text-muted-foreground">
          将特殊字符转换为HTML实体或反向解码
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                输入文本
              </CardTitle>
              <CardDescription>
                输入需要编码或解码的文本
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">文本内容</Label>
                <Textarea
                  id="input-text"
                  placeholder="输入要处理的文本..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(sampleTexts.basic)}
                >
                  基础示例
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(sampleTexts.advanced)}
                >
                  特殊字符
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="ml-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Encoding Options */}
          <Card>
            <CardHeader>
              <CardTitle>编码选项</CardTitle>
              <CardDescription>
                选择HTML实体编码类型
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="encoding-type">编码类型</Label>
                <Select value={encodingType} onValueChange={(value: EncodingType) => setEncodingType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="named">命名实体 (&amp;, &lt;, &gt;)</SelectItem>
                    <SelectItem value="numeric">数字实体 (&#38;, &#60;, &#62;)</SelectItem>
                    <SelectItem value="hex">十六进制实体 (&#x26;, &#x3C;, &#x3E;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                编码
              </TabsTrigger>
              <TabsTrigger value="decode" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                解码
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="encode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>编码结果</CardTitle>
                  <CardDescription>
                    HTML实体编码后的文本
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="编码结果将显示在这里..."
                    value={encodedText}
                    readOnly
                    className="min-h-[120px] resize-none font-mono text-sm"
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={handleEncode} className="flex-1">
                      <Code className="w-4 h-4 mr-2" />
                      编码
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(encodedText, '编码结果已复制到剪贴板')}
                      disabled={!encodedText}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={swapTexts}
                      disabled={!encodedText}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="decode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>解码结果</CardTitle>
                  <CardDescription>
                    HTML实体解码后的文本
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="解码结果将显示在这里..."
                    value={decodedText}
                    readOnly
                    className="min-h-[120px] resize-none"
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={handleDecode} className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      解码
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(decodedText, '解码结果已复制到剪贴板')}
                      disabled={!decodedText}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={swapTexts}
                      disabled={!decodedText}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>常用HTML实体参考</CardTitle>
          <CardDescription>
            常见字符的HTML实体编码对照表
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">基础字符</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>&amp; → &amp;amp;</div>
                <div>&lt; → &amp;lt;</div>
                <div>&gt; → &amp;gt;</div>
                <div>&quot; → &amp;quot;</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">版权符号</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>© → &amp;copy;</div>
                <div>® → &amp;reg;</div>
                <div>™ → &amp;trade;</div>
                <div>§ → &amp;sect;</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">货币符号</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>€ → &amp;euro;</div>
                <div>£ → &amp;pound;</div>
                <div>¥ → &amp;yen;</div>
                <div>¢ → &amp;cent;</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">数学符号</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>± → &amp;plusmn;</div>
                <div>× → &amp;times;</div>
                <div>÷ → &amp;divide;</div>
                <div>° → &amp;deg;</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}