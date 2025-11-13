'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { 
  inspiredContentSchema, 
  InspiredContentFormData, 
  contentTypes, 
  targetCountries,
  generateSlug 
} from '@/lib/validations/inspired-content';
import { 
  useCreateInspiredContent, 
  useUpdateInspiredContent, 
  useInspiredCategories 
} from '@/lib/queries/inspired-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileUpload } from '@/components/ui/file-upload';
import { InlineHospitalSelector } from '@/components/ui/inline-hospital-selector';
import { IconLoader2, IconDeviceFloppy, IconX, IconWand } from '@tabler/icons-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InspiredContentFormProps {
  content?: any;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function InspiredContentForm({ content, isEditing = false, onCancel }: InspiredContentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const createContent = useCreateInspiredContent();
  const updateContent = useUpdateInspiredContent(content?.id);
  const { data: categories } = useInspiredCategories();

  const form = useForm<InspiredContentFormData>({
    resolver: zodResolver(inspiredContentSchema) as any,
    defaultValues: {
      title: content?.title || '',
      subtitle: content?.subtitle || '',
      content_type: content?.content_type || 'hospital_list',
      category_id: content?.category_id || null,
      slug: content?.slug || '',
      meta_description: content?.meta_description || '',
      featured_image_url: content?.featured_image_url || '',
      excerpt: content?.excerpt || '',
      content: content?.content || '',
      target_country: content?.target_country || null,
      target_city: content?.target_city || '',
      target_specialty: content?.target_specialty || '',
      is_published: content?.is_published ?? false,
      is_featured: content?.is_featured ?? false,
      published_at: content?.published_at ? new Date(content.published_at) : null,
      sort_order: content?.sort_order || 0,
      selected_hospitals: [],
    },
  });

  const watchTitle = form.watch('title');
  const watchSlug = form.watch('slug');
  const watchContentType = form.watch('content_type');
  const watchSelectedHospitals = form.watch('selected_hospitals');

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchTitle && (!isEditing || !watchSlug)) {
      const newSlug = generateSlug(watchTitle);
      form.setValue('slug', newSlug);
    }
  }, [watchTitle, isEditing, watchSlug, form]);

  const onSubmit = async (data: InspiredContentFormData) => {
    try {
      setIsLoading(true);
      
      // Set published_at if publishing for the first time
      if (data.is_published && !data.published_at) {
        data.published_at = new Date();
      }
      
      // Remove selected_hospitals from the data as it's not persisted directly
      const { selected_hospitals, ...contentDataBase } = data;
      const contentData = { ...contentDataBase, selected_hospitals: [] };
      
      if (isEditing) {
        await updateContent.mutateAsync(contentData);
        toast.success('Content updated successfully!');
      } else {
        const newContent = await createContent.mutateAsync(contentData);
        toast.success('Content created successfully!');
        
        // TODO: Handle hospital assignments here if selected_hospitals has items
        if (selected_hospitals && selected_hospitals.length > 0) {
          // This would require additional API calls to manage hospital relationships
          console.log('TODO: Assign hospitals:', selected_hospitals);
        }
        
        router.push(`/cms/inspired-content/${newContent.id}/edit`);
        return;
      }
      
      router.push('/cms/inspired-content');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const generateSlugFromTitle = () => {
    if (watchTitle) {
      const newSlug = generateSlug(watchTitle);
      form.setValue('slug', newSlug);
    }
  };

  const isPending = createContent.isPending || updateContent.isPending || isLoading;
  
  // Show hospital selector only for hospital_list content type
  const showHospitalSelector = watchContentType === 'hospital_list';

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Top 10 Beauty Hospitals in Thailand" 
                        {...field} 
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the content" 
                        {...field} 
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} defaultValue={field.value || 'none'} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO & Content */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="url-friendly-slug" 
                          {...field} 
                          disabled={isPending}
                          className="font-mono"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={generateSlugFromTitle}
                          disabled={isPending || !watchTitle}
                          title="Generate slug from title"
                        >
                          <IconWand className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL: /inspired/{form.watch('slug') || 'your-slug'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a compelling summary that will appear in content cards..." 
                        {...field} 
                        disabled={isPending}
                        rows={4}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>Shown in content cards, listings, and preview sections</span>
                      <span className={cn(
                        "font-mono text-xs",
                        (field.value?.length || 0) > 500 && "text-destructive",
                        (field.value?.length || 0) > 450 && (field.value?.length || 0) <= 500 && "text-orange-500"
                      )}>
                        {field.value?.length || 0}/500 characters
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a compelling description for search engines..." 
                        {...field} 
                        disabled={isPending}
                        rows={3}
                        maxLength={160}
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>Used by search engines and social media platforms</span>
                      <span className={cn(
                        "font-mono",
                        (field.value?.length || 0) > 160 && "text-destructive",
                        (field.value?.length || 0) > 140 && (field.value?.length || 0) <= 160 && "text-orange-500"
                      )}>
                        {field.value?.length || 0}/160 characters
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isPending}
                        placeholder="https://example.com/image.jpg"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image or provide a URL for the featured image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Write rich content describing the inspiration..."
                        disabled={isPending}
                        error={!!form.formState.errors.content}
                      />
                    </FormControl>
                    <FormDescription>
                      Rich text content with formatting options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Hospital Selection - Only for Hospital List content type */}
          {showHospitalSelector && (
            <Card>
              <CardHeader>
                <CardTitle>Hospital Selection</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select hospitals to feature in this content. You can reorder them later.
                </p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="selected_hospitals"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InlineHospitalSelector
                          value={field.value || []}
                          onChange={field.onChange}
                          disabled={isPending}
                          maxSelection={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Targeting */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic & Specialty Targeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Country</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} defaultValue={field.value || 'none'} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          {targetCountries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Bangkok, Kuala Lumpur" 
                          {...field} 
                          value={field.value || ''}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="target_specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Specialty</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Cosmetic Surgery, Cardiology" 
                        {...field} 
                        value={field.value || ''}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>
                          Make this content visible to the public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Show this content in featured sections
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={isPending} size="lg" className="flex-1 sm:flex-initial">
                  {isPending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy className="mr-2 h-4 w-4" />
                      {isEditing ? 'Update' : 'Create'} Content
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isPending} 
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>All changes are automatically validated</span>
                  {isEditing && (
                    <span>Content ID: <code className="font-mono text-xs">{content?.id?.substring(0, 8)}...</code></span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}