'use client';

import { useRouter } from 'next/navigation';
import { useDeleteFacility } from '@/lib/queries/facilities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2,
  AlertTriangle,
  Building2,
  Trash2
} from 'lucide-react';

interface DeleteFacilityDialogProps {
  facility: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFacilityDialog({
  facility,
  open,
  onOpenChange,
}: DeleteFacilityDialogProps) {
  const router = useRouter();
  const deleteFacility = useDeleteFacility();

  const handleDelete = async () => {
    try {
      await deleteFacility.mutateAsync(facility.id);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation's onError callback with toast
      console.error('Failed to delete facility:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={!deleteFacility.isPending ? onOpenChange : undefined}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">Delete Facility</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{facility.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {facility.category?.replace('_', ' ') || 'Unknown'}
                </Badge>
                {facility.hospital?.name && (
                  <span className="text-sm text-muted-foreground">
                    at {facility.hospital.name}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm">
              This action will permanently delete this facility and all associated data. 
              This cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={deleteFacility.isPending} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            disabled={deleteFacility.isPending}
          >
            {deleteFacility.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Facility
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
