'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDeleteSpecialty } from '@/lib/queries/specialties';

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
import { MoreHorizontal, Eye, Edit, Trash2, Circle } from 'lucide-react';

interface SpecialtyTableProps {
  specialties: any[];
  onViewSpecialty?: (specialty: any) => void;
}

export function SpecialtyTable({ specialties, onViewSpecialty }: SpecialtyTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);

  const handleDelete = (specialty: any) => {
    setSelectedSpecialty(specialty);
    setDeleteDialogOpen(true);
  };

  const handleView = (specialty: any) => {
    if (onViewSpecialty) {
      onViewSpecialty(specialty);
    }
  };

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No specialties found</TableCell>
              </TableRow>
            ) : (
              specialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {specialty.color_code && (
                        <Circle className="h-3 w-3" style={{ color: specialty.color_code, fill: specialty.color_code }} />
                      )}
                      <div>
                        <p>{specialty.name}</p>
                        {specialty.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{specialty.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {specialty.code ? (
                      <Badge variant="outline" className="font-mono text-xs">{specialty.code}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No code</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoryColor(specialty.category)}>
                      {formatCategory(specialty.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {specialty.avg_consultation_duration_minutes ? (
                      <span className="text-sm">{specialty.avg_consultation_duration_minutes} min</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={specialty.is_active ? "default" : "secondary"}>
                        {specialty.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {specialty.requires_certification && (
                        <Badge variant="outline" className="text-xs">Certified</Badge>
                      )}
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
                        <DropdownMenuItem onClick={() => handleView(specialty)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/specialties/${specialty.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDelete(specialty)}
                        >
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

      {selectedSpecialty && (
        <DeleteSpecialtyDialog 
          specialty={selectedSpecialty} 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen} 
        />
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

function DeleteSpecialtyDialog({ specialty, open, onOpenChange }: { specialty: any; open: boolean; onOpenChange: (b: boolean) => void }) {
  const router = useRouter();
  const deleteSpecialty = useDeleteSpecialty();

  const handleDelete = async () => {
    await (deleteSpecialty as any).mutateAsync(specialty.id);
    onOpenChange(false);
    router.push('/cms/specialties');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{specialty.name}</strong> specialty. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
            disabled={(deleteSpecialty as any).isPending}
          >
            {(deleteSpecialty as any).isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}