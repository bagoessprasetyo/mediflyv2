'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconUpload, IconX, IconPhoto, IconExternalLink } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function FileUpload({
  value = '',
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className,
  placeholder = 'https://example.com/image.jpg'
}: FileUploadProps) {
  const [urlInput, setUrlInput] = useState(value);
  const [uploadError, setUploadError] = useState<string>('');

  // Handle file drop/selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadError('');

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // For demo purposes, we'll create a mock URL
    // In production, you would upload to your storage service
    const mockUrl = `https://storage.medifly.com/uploads/${Date.now()}-${file.name}`;
    onChange?.(mockUrl);
    setUrlInput(mockUrl);
  }, [maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles: 1,
    disabled,
  });

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange?.(url);
  };

  const handleRemove = () => {
    setUrlInput('');
    onChange?.('');
    setUploadError('');
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <IconUpload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <IconExternalLink className="h-4 w-4" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {!value ? (
            <Card>
              <CardContent className="p-6">
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive && !isDragReject && "border-primary bg-primary/5",
                    isDragReject && "border-destructive bg-destructive/5",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <IconPhoto className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {isDragActive ? 'Drop image here' : 'Drag & drop an image here'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to select from your computer
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, GIF, WebP (max {Math.round(maxSize / 1024 / 1024)}MB)
                      </p>
                    </div>
                  </div>
                </div>
                {uploadError && (
                  <p className="text-sm text-destructive mt-2">{uploadError}</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isImageUrl(value) ? (
                      <img
                        src={value}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <IconPhoto className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{value}</p>
                    <p className="text-xs text-muted-foreground">Click upload to replace</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>
          {urlInput && isImageUrl(urlInput) && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img
                    src={urlInput}
                    alt="Preview"
                    className="max-w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}