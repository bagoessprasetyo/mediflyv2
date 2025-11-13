'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface IncludesItem {
  item: string;
  description?: string;
}

interface IncludesEditorProps {
  value: IncludesItem[];
  onChange: (value: IncludesItem[]) => void;
}

export function IncludesEditor({ value, onChange }: IncludesEditorProps) {
  const [items, setItems] = useState<IncludesItem[]>(value || []);

  const addItem = () => {
    const newItems = [...items, { item: '', description: '' }];
    setItems(newItems);
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (index: number, field: 'item' | 'description', valueStr: string) => {
    const newItems = items.map((it, i) => (i === index ? { ...it, [field]: valueStr } : it));
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>What's Included in this Package</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No items added yet. Click "Add Item" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}`}>Item Name *</Label>
                      <Input
                        id={`item-${index}`}
                        value={item.item}
                        onChange={(e) => updateItem(index, 'item', e.target.value)}
                        placeholder="e.g., ECG Test, Blood Work"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Brief description of this item"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="mt-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
