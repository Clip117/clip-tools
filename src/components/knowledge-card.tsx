/**
 * Knowledge Card Component
 * 知识卡片组件
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { KnowledgeCard } from '@/types/knowledge-card';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Pin, PinOff, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeCardProps {
  card: KnowledgeCard;
  onEdit: (card: KnowledgeCard) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  className?: string;
}

export function KnowledgeCardComponent({ 
  card, 
  onEdit, 
  onDelete, 
  onTogglePin, 
  className 
}: KnowledgeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editContent, setEditContent] = useState(card.content);
  const [editTags, setEditTags] = useState(card.tags.join(', '));

  const handleSave = () => {
    const updatedCard: KnowledgeCard = {
      ...card,
      title: editTitle,
      content: editContent,
      tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date()
    };
    onEdit(updatedCard);
    setIsEditing(false);
    toast.success('知识卡片已更新');
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditContent(card.content);
    setEditTags(card.tags.join(', '));
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card 
      className={cn(
        "h-full transition-all duration-200 hover:shadow-md border-muted group flex flex-col",
        card.pinned && "border-yellow-300 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-950/20",
        card.color && `border-l-4 border-l-${card.color}-500`,
        className
      )}
    >
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0 group-hover:overflow-hidden">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-semibold"
                placeholder="卡片标题"
              />
            ) : (
              <CardTitle className="text-lg leading-tight transition-colors whitespace-nowrap group-hover:overflow-hidden group-hover:truncate">
                {card.title}
              </CardTitle>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onTogglePin(card.id)}
            >
              {card.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              onClick={() => {
                if (confirm('确定要删除这张知识卡片吗？')) {
                  onDelete(card.id);
                  toast.success('知识卡片已删除');
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col flex-1 min-h-0">
        {isEditing ? (
          <div className="space-y-3 flex-1">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="卡片内容"
              rows={4}
              className="resize-none"
            />
            <Input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="标签（用逗号分隔）"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* 内容区域 - 自动填充剩余空间 */}
            <div className="flex-1 min-h-0 mb-4">
              <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">
                {card.content}
              </CardDescription>
            </div>
            
            {/* 底部固定区域 */}
            <div className="flex-shrink-0 mt-auto">
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                <span>• 创建于 {formatDate(card.createdAt)}</span>
                {card.updatedAt.getTime() !== card.createdAt.getTime() && (
                  <span className="ml-2">• 更新于 {formatDate(card.updatedAt)}</span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}