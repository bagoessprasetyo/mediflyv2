'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDeleteTreatment } from '@/lib/queries/treatments';

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
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

interface TreatmentTableProps {
  treatments: any[];
}

export function TreatmentTable({ treatments }: TreatmentTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);

  const handleDelete = (treatment: any) => {
    setSelectedTreatment(treatment);
    setDeleteDialogOpen(true);
  };

  const formatPrice = (treatment: any) => {
    if (treatment.price) return `$${treatment.price.toFixed(2)}`;
    if (treatment.price_range_min && treatment.price_range_max) return `$${treatment.price_range_min.toFixed(2)} - $${treatment.price_range_max.toFixed(2)}`;
    return 'N/A';
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">No treatments found</TableCell>
              </TableRow>
            ) : (
              treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{treatment.name}</p>
                      <p className="text-sm text-muted-foreground">{treatment.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{treatment.category}</Badge></TableCell>
                  <TableCell>
                    {treatment.hospital?.name || 'N/A'}
                    <p className="text-sm text-muted-foreground">{treatment.hospital?.city}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatPrice(treatment)}</span>
                    {treatment.sessions_required > 1 && <p className="text-xs text-muted-foreground">{treatment.sessions_required} sessions</p>}
                  </TableCell>
                  <TableCell>
                    {treatment.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{treatment.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({treatment.review_count})</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {treatment.is_available && <Badge variant="default">Available</Badge>}
                      {treatment.is_featured && <Badge variant="secondary">Featured</Badge>}
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
                          <Link href={`/cms/treatments/${treatment.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/treatments/${treatment.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(treatment)}>
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

      {selectedTreatment && (
        <DeleteTreatmentDialog treatment={selectedTreatment} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      )}
    </>
  );
}

// Inline delete dialog to keep module self-contained
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

function DeleteTreatmentDialog({ treatment, open, onOpenChange }: { treatment: any; open: boolean; onOpenChange: (b: boolean) => void }) {
  const router = useRouter();
  const deleteTreatment = useDeleteTreatment();

  const handleDelete = async () => {
    await (deleteTreatment as any).mutateAsync(treatment.id);
    onOpenChange(false);
    router.push('/cms/treatments');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{treatment.name}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={(deleteTreatment as any).isPending}>
            {(deleteTreatment as any).isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
