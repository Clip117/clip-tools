/**
 * Tools configuration data
 * 工具配置数据
 */

import { Tool, ToolCategory, TOOL_CATEGORIES } from '@/types/tools';
import { 
  FileText, 
  Settings, 
  FileCode, 
  Search, 
  Hash, 
  BarChart3, 
  CheckSquare, 
  Tag, 
  Palette, 
  Clock, 
  Link, 
  Lock, 
  Key, 
  Smartphone, 
  Shield, 
  Fingerprint, 
  BookOpen 
} from 'lucide-react';

export const TOOLS: Tool[] = [
  // Text Processing 文本处理
  {
    id: 'word-count',
    name: 'Word Count',
    description: '实时统计文本字数',
    category: TOOL_CATEGORIES.TEXT,
    icon: FileText,
    path: '/tools/word-count',
    featured: true
  },
  {
    id: 'json-pretty',
    name: 'JSON Formatter',
    description: 'JSON 美化 / 压缩',
    category: TOOL_CATEGORIES.TEXT,
    icon: Settings,
    path: '/tools/json-pretty',
    featured: true
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Markdown实时预览工具',
    category: TOOL_CATEGORIES.TEXT,
    icon: FileCode,
    path: '/tools/markdown-preview',
    featured: true
  },
  {
    id: 'diff-viewer',
    name: 'Text Diff',
    description: '文本差异对比',
    category: TOOL_CATEGORIES.TEXT,
    icon: Search,
    path: '/tools/diff-viewer'
  },
  {
    id: 'text-counter',
    name: 'Text Counter',
    description: '文本计数工具',
    category: TOOL_CATEGORIES.TEXT,
    icon: Hash,
    path: '/tools/text-counter'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'CSV转JSON工具',
    category: TOOL_CATEGORIES.TEXT,
    icon: BarChart3,
    path: '/tools/csv-to-json'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: '正则表达式测试',
    category: TOOL_CATEGORIES.TEXT,
    icon: CheckSquare,
    path: '/tools/regex-tester',
    featured: true
  },
  {
    id: 'html-entities',
    name: 'HTML Entities',
    description: 'HTML实体编码/解码',
    category: TOOL_CATEGORIES.TEXT,
    icon: Tag,
    path: '/tools/html-entities'
  },

  // Color/Design 颜色/设计
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: '取色并复制十六进制',
    category: TOOL_CATEGORIES.COLOR,
    icon: Palette,
    path: '/tools/color-picker',
    featured: true
  },

  // Date/Time 日期/时间
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: '时间戳转换工具',
    category: TOOL_CATEGORIES.DATE,
    icon: Clock,
    path: '/tools/timestamp-converter'
  },

  // Encoding/Encryption 编码/加密
  {
    id: 'url-encode',
    name: 'URL Encode/Decode',
    description: 'URL编码解码',
    category: TOOL_CATEGORIES.ENCODING,
    icon: Link,
    path: '/tools/url-encode'
  },
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Base64编码解码',
    category: TOOL_CATEGORIES.ENCODING,
    icon: Lock,
    path: '/tools/base64'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: '密码生成器',
    category: TOOL_CATEGORIES.ENCODING,
    icon: Key,
    path: '/tools/password-generator'
  },
  {
    id: 'qr-generator',
    name: 'QR Maker',
    description: '二维码生成',
    category: TOOL_CATEGORIES.ENCODING,
    icon: Smartphone,
    path: '/tools/qr-generator',
    featured: true
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: '哈希生成工具',
    category: TOOL_CATEGORIES.ENCODING,
    icon: Shield,
    path: '/tools/hash-generator'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'UUID生成工具',
    category: TOOL_CATEGORIES.RANDOM,
    icon: Fingerprint,
    path: '/tools/uuid-generator'
  },
  // 在 TOOLS 数组中添加新工具
  {
    id: 'knowledge-cards',
    name: 'Knowledge Cards',
    description: '知识卡片管理工具',
    category: TOOL_CATEGORIES.TEXT,
    icon: BookOpen,
    path: '/tools/knowledge-cards',
    featured: true
  },
];

export const TOOL_CATEGORIES_DATA: ToolCategory[] = [
  {
    id: TOOL_CATEGORIES.TEXT,
    name: '文本处理',
    description: 'Text Processing Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.TEXT)
  },
  {
    id: TOOL_CATEGORIES.IMAGE,
    name: '图片处理',
    description: 'Image Processing Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.IMAGE)
  },
  {
    id: TOOL_CATEGORIES.COLOR,
    name: '颜色设计',
    description: 'Color & Design Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.COLOR)
  },
  {
    id: TOOL_CATEGORIES.DATE,
    name: '日期时间',
    description: 'Date & Time Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.DATE)
  },
  {
    id: TOOL_CATEGORIES.MATH,
    name: '数学计算',
    description: 'Math & Calculation Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.MATH)
  },
  {
    id: TOOL_CATEGORIES.ENCODING,
    name: '编码加密',
    description: 'Encoding & Encryption Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.ENCODING)
  },
  {
    id: TOOL_CATEGORIES.WEB,
    name: 'Web开发',
    description: 'Web Development Tools',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.WEB)
  },
  {
    id: TOOL_CATEGORIES.RANDOM,
    name: '随机生成',
    description: 'Random Generators',
    tools: TOOLS.filter(tool => tool.category === TOOL_CATEGORIES.RANDOM)
  }
];

export const getFeaturedTools = () => TOOLS.filter(tool => tool.featured);
export const getToolsByCategory = (category: string) => TOOLS.filter(tool => tool.category === category);
export const getToolById = (id: string) => TOOLS.find(tool => tool.id === id);