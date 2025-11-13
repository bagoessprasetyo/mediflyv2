'use client';

import { useRouter } from 'next/navigation';
import { useDeleteDoctor } from '@/lib/queries/doctors';

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

interface DeleteDoctorDialogProps {
  doctor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteDoctorDialog({ doctor, open, onOpenChange }: DeleteDoctorDialogProps) {
  const router = useRouter();
  const deleteDoctor = useDeleteDoctor();

  const handleDelete = async () => {
    await deleteDoctor.mutateAsync(doctor.id);
    onOpenChange(false);
    router.push('/cms/doctors');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{doctor.first_name} {doctor.last_name}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteDoctor.isPending}
          >
            {deleteDoctor.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDoctorDialog;
