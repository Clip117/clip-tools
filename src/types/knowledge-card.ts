/**
 * Knowledge Card types and interfaces
 * 知识卡片类型和接口定义
 */

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  pinned?: boolean;
}

export interface KnowledgeCardCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// 默认分类常量
export const KNOWLEDGE_CATEGORIES = {
  GENERAL: 'general',
  TECH: 'tech',
  DESIGN: 'design',
  BUSINESS: 'business',
  PERSONAL: 'personal',
  LEARNING: 'learning'
} as const;

export type KnowledgeCategoryType = typeof KNOWLEDGE_CATEGORIES[keyof typeof KNOWLEDGE_CATEGORIES];

// 默认分类配置
export const DEFAULT_CATEGORIES: KnowledgeCardCategory[] = [
  { id: KNOWLEDGE_CATEGORIES.GENERAL, name: '通用', color: '#6b7280', description: '通用知识和信息' },
  { id: KNOWLEDGE_CATEGORIES.TECH, name: '技术', color: '#3b82f6', description: '技术相关内容' },
  { id: KNOWLEDGE_CATEGORIES.DESIGN, name: '设计', color: '#8b5cf6', description: '设计相关内容' },
  { id: KNOWLEDGE_CATEGORIES.BUSINESS, name: '商业', color: '#10b981', description: '商业和管理相关' },
  { id: KNOWLEDGE_CATEGORIES.PERSONAL, name: '个人', color: '#f59e0b', description: '个人笔记和想法' },
  { id: KNOWLEDGE_CATEGORIES.LEARNING, name: '学习', color: '#ef4444', description: '学习笔记和资料' }
];