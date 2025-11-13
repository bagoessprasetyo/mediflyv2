'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { specialtySchema, SpecialtyFormData, specialtyCategories } from '@/lib/validations/specialty';
import { useCreateSpecialty, useUpdateSpecialty } from '@/lib/queries/specialties';
import { SpecialtyFormSkeleton } from '@/components/specialties/specialty-skeleton';
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
} from '@/components/ui/form';
import { Loader2, Save, X } from 'lucide-react';

interface SpecialtyFormProps {
  specialty?: any;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function SpecialtyForm({ specialty, isEditing = false, onCancel }: SpecialtyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const createSpecialty = useCreateSpecialty();
  const updateSpecialty = useUpdateSpecialty(specialty?.id);

  const form = useForm<SpecialtyFormData>({
    resolver: zodResolver(specialtySchema) as any,
    defaultValues: {
      name: specialty?.name || '',
      code: specialty?.code || '',
      description: specialty?.description || '',
      category: specialty?.category || 'MEDICAL',
      color_code: specialty?.color_code || '',
      icon: specialty?.icon || '',
      is_active: specialty?.is_active ?? true,
      requires_certification: specialty?.requires_certification ?? false,
      avg_consultation_duration_minutes: specialty?.avg_consultation_duration_minutes || undefined,
      sort_order: specialty?.sort_order || 0,
    },
  });

  const onSubmit = async (data: SpecialtyFormData) => {
    try {
      setIsLoading(true);
      
      if (isEditing) {
        await updateSpecialty.mutateAsync(data);
      } else {
        await createSpecialty.mutateAsync(data);
      }
      
      router.push('/cms/specialties');
    } catch (error) {
      console.error('Error submitting form:', error);
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

  const isPending = createSpecialty.isPending || updateSpecialty.isPending || isLoading;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter specialty name (e.g., Cardiology)" 
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter code (e.g., CARD)" 
                      {...field} 
                      value={field.value || ''}
                      disabled={isPending}
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialtyCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter a brief description of this medical specialty..." 
                    {...field} 
                    disabled={isPending}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="color_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Code</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        {...field} 
                        value={field.value || '#3b82f6'}
                        disabled={isPending}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        placeholder="Enter hex color (e.g., #3b82f6)" 
                        {...field}
                        value={field.value || ''}
                        disabled={isPending}
                        className="font-mono"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avg_consultation_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avg. Consultation Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter duration (e.g., 30)" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter icon name (e.g., heart)" 
                      {...field}
                      value={field.value || ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter sort order (e.g., 0)" 
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this specialty for use in the system
                    </div>
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
              name="requires_certification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Requires Certification</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Indicates if doctors need special certification for this specialty
                    </div>
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update' : 'Create'} Specialty
                </>
              )}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}