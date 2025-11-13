'use client';

import React, { useCallback, useState } from 'react';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  accept?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  className,
  accept = 'image/*',
  placeholder
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const currentFiles = multiple 
    ? Array.isArray(value) ? value : value ? [value] : []
    : value ? [value] : [];

  const handleFileChange = useCallback((files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    
    // Simulate file upload - in real app, this would upload to storage service
    const newUrls: string[] = [];
    Array.from(files).forEach((file, index) => {
      // Create a mock URL - replace with actual upload logic
      const mockUrl = `https://example.com/uploads/${file.name}-${Date.now()}-${index}`;
      newUrls.push(mockUrl);
    });

    setTimeout(() => {
      if (multiple) {
        const existingFiles = Array.isArray(value) ? value : value ? [value] : [];
        const combined = [...existingFiles, ...newUrls].slice(0, maxFiles);
        onChange(combined);
      } else {
        onChange(newUrls[0]);
      }
      setIsUploading(false);
    }, 1000);
  }, [value, onChange, multiple, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (currentFiles.length >= maxFiles) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const remainingSlots = maxFiles - currentFiles.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const fileList = new FileList();
      // Can't directly create FileList, so we'll handle the files array
      handleFileChange(files);
    }
  }, [currentFiles.length, maxFiles, handleFileChange]);

  const handleRemove = useCallback((index: number) => {
    if (multiple) {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onChange(newFiles as string[]);
    } else {
      onChange('');
    }
  }, [currentFiles, multiple, onChange]);

  const canAddMore = currentFiles.length < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {canAddMore && (
        <Card
          className={cn(
            'border-2 border-dashed transition-colors cursor-pointer',
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (isUploading) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.multiple = multiple && canAddMore;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                handleFileChange(target.files);
              }
            };
            input.click();
          }}
        >
          <div className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                {isUploading ? (
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <IconUpload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isUploading 
                    ? 'Uploading...' 
                    : placeholder || (multiple ? 'Upload images' : 'Upload image')
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to select files
                  {multiple && ` (${currentFiles.length}/${maxFiles})`}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Preview uploaded images */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {multiple ? `Uploaded Images (${currentFiles.length})` : 'Uploaded Image'}
          </p>
          <div className={cn(
            'grid gap-4',
            multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {currentFiles.map((url, index) => {
              const urlString = Array.isArray(url) ? url[0] : url;
              return (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {urlString && urlString.startsWith('http') ? (
                    <img 
                      src={urlString} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for mock URLs
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <IconPhoto className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <IconX className="h-3 w-3" />
                </Button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                  <p className="text-xs truncate">
                    {urlString?.split('/').pop() || `Image ${index + 1}`}
                  </p>
                </div>
              </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}