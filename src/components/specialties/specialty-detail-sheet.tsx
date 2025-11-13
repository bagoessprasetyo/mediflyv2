'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Edit, Circle, Clock, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface SpecialtyDetailSheetProps {
  specialty: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpecialtyDetailSheet({ specialty, open, onOpenChange }: SpecialtyDetailSheetProps) {
  if (!specialty) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MEDICAL: 'bg-blue-100 text-blue-800',
      SURGICAL: 'bg-red-100 text-red-800',
      DIAGNOSTIC: 'bg-purple-100 text-purple-800',
      THERAPEUTIC: 'bg-green-100 text-green-800',
      EMERGENCY: 'bg-orange-100 text-orange-800',
      PREVENTIVE: 'bg-cyan-100 text-cyan-800',
      REHABILITATION: 'bg-indigo-100 text-indigo-800',
      MENTAL_HEALTH: 'bg-pink-100 text-pink-800',
      PEDIATRIC: 'bg-yellow-100 text-yellow-800',
      GERIATRIC: 'bg-gray-100 text-gray-800',
      OTHER: 'bg-slate-100 text-slate-800',
    };
    return colors[category] || colors.OTHER;
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {specialty.color_code && (
                <Circle 
                  className="h-6 w-6 flex-shrink-0" 
                  style={{ color: specialty.color_code, fill: specialty.color_code }} 
                />
              )}
              <div>
                <SheetTitle className="text-xl">{specialty.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  {specialty.code && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {specialty.code}
                    </Badge>
                  )}
                  <Badge variant="secondary" className={getCategoryColor(specialty.category)}>
                    {formatCategory(specialty.category)}
                  </Badge>
                </SheetDescription>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/cms/specialties/${specialty.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {specialty.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-sm leading-relaxed">{specialty.description}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Status
                </h4>
                <Badge variant={specialty.is_active ? "default" : "secondary"}>
                  {specialty.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {specialty.avg_consultation_duration_minutes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg. Consultation Duration
                  </h4>
                  <p className="text-sm">{specialty.avg_consultation_duration_minutes} minutes</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {specialty.requires_certification && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certification Required
                  </h4>
                  <Badge variant="outline">Required</Badge>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Sort Order</h4>
                <p className="text-sm">{specialty.sort_order || 0}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <h4 className="font-medium mb-1">Created</h4>
              <p>{specialty.created_at ? formatDate(specialty.created_at) : 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p>{specialty.updated_at ? formatDate(specialty.updated_at) : 'N/A'}</p>
            </div>
          </div>

          {specialty.icon && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Icon</h4>
                <Badge variant="outline" className="font-mono">
                  {specialty.icon}
                </Badge>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}