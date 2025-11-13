'use client';

import { useState } from 'react';
import Link from 'next/link';
// Doctor type intentionally kept loose to avoid tight coupling with DB types here
import { useDeleteDoctor } from '@/lib/queries/doctors';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Inline delete dialog to avoid module resolution issues in this workspace
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

interface DoctorTableProps {
  doctors: any[];
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const handleDelete = (doctor: any) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>
                        {doctor.first_name} {doctor.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {doctor.hospital ? `${doctor.hospital.name} — ${doctor.hospital.city}` : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {doctor.doctor_specialties?.map((ds: any) => (
                        <Badge key={ds.specialty.id} variant={ds.is_primary ? 'default' : 'outline'}>
                          {ds.specialty.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {doctor.is_active && <Badge variant="default">Active</Badge>}
                      {doctor.is_verified && <Badge variant="secondary">Verified</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/doctors/${doctor.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/doctors/${doctor.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doctor)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDoctor && (
        <DeleteDoctorDialog doctor={selectedDoctor} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      )}
    </>
  );
}

import { useRouter } from 'next/navigation';
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

function DeleteDoctorDialog({ doctor, open, onOpenChange }: { doctor: any; open: boolean; onOpenChange: (b: boolean) => void }) {
  const router = useRouter();
  const deleteDoctor = useDeleteDoctor();

  const handleDelete = async () => {
    await (deleteDoctor as any).mutateAsync(doctor.id);
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
            disabled={(deleteDoctor as any).isPending}
          >
            {(deleteDoctor as any).isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
