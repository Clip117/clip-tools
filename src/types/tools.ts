/**
 * Tool types and interfaces for CLIP Tools
 * 工具类型和接口定义
 */

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  featured?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES = {
  TEXT: 'text',
  IMAGE: 'image', 
  COLOR: 'color',
  DATE: 'date',
  MATH: 'math',
  ENCODING: 'encoding',
  WEB: 'web',
  RANDOM: 'random'
} as const;

export type ToolCategoryType = typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];