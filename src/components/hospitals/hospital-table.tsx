'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hospital } from '@/types/database.types';
import { useDeleteHospital } from '@/lib/queries/hospitals';

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
import { DeleteHospitalDialog } from './delete-hospital-dialog';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

interface HospitalTableProps {
  hospitals: Hospital[];
}

export function HospitalTable({ hospitals }: HospitalTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const handleDelete = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hospitals found
                </TableCell>
              </TableRow>
            ) : (
              hospitals.map((hospital) => (
                <TableRow key={hospital.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{hospital.name}</p>
                      <p className="text-sm text-muted-foreground">{hospital.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{hospital.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {hospital.city}, {hospital.state}
                  </TableCell>
                  <TableCell>
                    {hospital.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{hospital.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({hospital.review_count})
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {hospital.is_active && <Badge variant="default">Active</Badge>}
                      {hospital.is_verified && <Badge variant="secondary">Verified</Badge>}
                      {hospital.is_featured && <Badge variant="outline">Featured</Badge>}
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
                          <Link href={`/cms/hospitals/${hospital.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/hospitals/${hospital.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(hospital)}
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

      {selectedHospital && (
        <DeleteHospitalDialog
          hospital={selectedHospital}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  );
}