/**
 * Knowledge Cards Tool
 * 知识卡片工具
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { KnowledgeCard, KnowledgeCardCategory, DEFAULT_CATEGORIES } from '@/types/knowledge-card';
import { KnowledgeCardComponent } from '@/components/knowledge-card';
import { Plus, Search, BookOpen, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function KnowledgeCardsPage() {
  const [cards, setCards] = useState<KnowledgeCard[]>([]);
  const [categories, setCategories] = useState<KnowledgeCardCategory[]>(DEFAULT_CATEGORIES);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newCard, setNewCard] = useState({
    title: '',
    content: '',
    tags: '',
    category: DEFAULT_CATEGORIES[0].id
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#6b7280',
    description: ''
  });

  // 从localStorage加载数据
  useEffect(() => {
    const savedCards = localStorage.getItem('knowledge-cards');
    const savedCategories = localStorage.getItem('knowledge-categories');
    
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards).map((card: KnowledgeCard) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt)
        }));
        setCards(parsedCards);
      } catch {
        console.error('Failed to load knowledge cards');
      }
    }
    
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch {
        console.error('Failed to load categories');
        setCategories(DEFAULT_CATEGORIES);
      }
    }
  }, []);

  // 保存到localStorage
  const saveCards = (updatedCards: KnowledgeCard[]) => {
    localStorage.setItem('knowledge-cards', JSON.stringify(updatedCards));
    setCards(updatedCards);
  };

  const saveCategories = (updatedCategories: KnowledgeCardCategory[]) => {
    localStorage.setItem('knowledge-categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  // 创建新分类
  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('请填写分类名称');
      return;
    }

    const categoryId = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    const category: KnowledgeCardCategory = {
      id: categoryId,
      name: newCategory.name,
      color: newCategory.color,
      description: newCategory.description
    };

    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);
    setNewCategory({ name: '', color: '#6b7280', description: '' });
    setIsCreatingCategory(false);
    toast.success('分类已创建');
  };

  // 创建新卡片
  const handleCreateCard = () => {
    if (!newCard.title.trim() || !newCard.content.trim()) {
      toast.error('请填写标题和内容');
      return;
    }

    const card: KnowledgeCard = {
      id: Date.now().toString(),
      title: newCard.title,
      content: newCard.content,
      tags: newCard.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: newCard.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false
    };

    const updatedCards = [card, ...cards];
    saveCards(updatedCards);
    setNewCard({ title: '', content: '', tags: '', category: categories[0]?.id || DEFAULT_CATEGORIES[0].id });
    setIsCreating(false);
    toast.success('知识卡片已创建');
  };

  // 编辑卡片
  const handleEditCard = (updatedCard: KnowledgeCard) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    saveCards(updatedCards);
  };

  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    saveCards(updatedCards);
  };

  // 在 handleTogglePin 函数后面添加这两个函数
  const handleTogglePin = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, pinned: !card.pinned } : card
    );
    saveCards(updatedCards);
  };

  // 保存到本地文件
  const saveToLocalFile = () => {
    const data = {
      cards,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `知识卡片备份-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('数据已保存到本地文件');
  };

  // 从本地文件加载
  const loadFromLocalFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.cards && data.categories) {
          const importedCards = data.cards.map((card: KnowledgeCard) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            updatedAt: new Date(card.updatedAt)
          }));
          
          setCards(importedCards);
          setCategories(data.categories);
          
          // 同时保存到 localStorage
          localStorage.setItem('knowledge-cards', JSON.stringify(importedCards));
          localStorage.setItem('knowledge-categories', JSON.stringify(data.categories));
          
          toast.success(`成功加载 ${importedCards.length} 张卡片`);
        }
      } catch {
        toast.error('文件格式错误');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // 过滤卡片
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 排序：置顶的在前面，然后按更新时间排序
  const sortedCards = filteredCards.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const categoryStats = [
    { id: 'all', name: '全部', count: cards.length },
    ...categories.map(category => ({
      id: category.id,
      name: category.name,
      count: cards.filter(c => c.category === category.id).length
    }))
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8" />
            知识卡片
          </h1>
          <p className="text-muted-foreground text-lg">
            记录和管理你的知识片段，灵活组织你的想法和学习内容
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索卡片标题、内容或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>       
            
            <div className="flex gap-2">
              {/* 添加文件操作按钮 */}
              <Button variant="outline" onClick={saveToLocalFile} className="shrink-0">
                💾 备份数据
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={loadFromLocalFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-input"
                />
                <Button variant="outline" className="shrink-0">
                  📁 恢复数据
                </Button>
              </div>
              
              <Dialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <FolderPlus className="h-4 w-4" />
                    新建分类
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新分类</DialogTitle>
                    <DialogDescription>
                      为你的知识卡片创建一个新的分类标签
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">分类名称</Label>
                      <Input
                        id="category-name"
                        placeholder="输入分类名称"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-color">分类颜色</Label>
                      <Input
                        id="category-color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="h-10 w-20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-description">描述（可选）</Label>
                      <Input
                        id="category-description"
                        placeholder="输入分类描述"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateCategory}>
                        创建分类
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingCategory(false)}>
                        取消
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => setIsCreating(true)} className="shrink-0">
                <Plus className="h-4 w-4" />
                新建卡片
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categoryStats.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Create Card Form */}
        {isCreating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>创建新的知识卡片</CardTitle>
              <CardDescription>记录你的想法、学习笔记或重要信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="卡片标题"
                value={newCard.title}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
              />
              <Textarea
                placeholder="卡片内容"
                value={newCard.content}
                onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                rows={4}
              />
              <Input
                placeholder="标签（用逗号分隔）"
                value={newCard.tags}
                onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })}
              />
              <div>
                <Label htmlFor="card-category">选择分类</Label>
                <Select value={newCard.category} onValueChange={(value) => setNewCard({ ...newCard, category: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择一个分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCard}>
                  创建卡片
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards Grid */}
        {sortedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCards.map(card => (
              <KnowledgeCardComponent
                key={card.id}
                card={card}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">还没有知识卡片</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? '没有找到匹配的卡片，试试调整搜索条件' 
                : '开始创建你的第一张知识卡片吧'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建第一张卡片
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}