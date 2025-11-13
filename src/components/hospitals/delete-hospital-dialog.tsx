'use client';

import { useRouter } from 'next/navigation';
import { Hospital } from '@/types/database.types';
import { useDeleteHospital } from '@/lib/queries/hospitals';

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

interface DeleteHospitalDialogProps {
  hospital: Hospital;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteHospitalDialog({
  hospital,
  open,
  onOpenChange,
}: DeleteHospitalDialogProps) {
  const router = useRouter();
  const deleteHospital = useDeleteHospital();

  const handleDelete = async () => {
    await deleteHospital.mutateAsync(hospital.id);
    onOpenChange(false);
    router.push('/cms/hospitals');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{hospital.name}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteHospital.isPending}
          >
            {deleteHospital.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}