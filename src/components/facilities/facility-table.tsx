'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDeleteFacility } from '@/lib/queries/facilities';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteFacilityDialog } from './delete-facility-dialog';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Building2,
  Activity,
  Zap,
  Microscope,
  ShieldCheck,
  Users,
  Stethoscope,
  Car,
  CheckCircle,
  XCircle,
  MapPin,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FacilityTableProps {
  facilities: any[];
  showHospital?: boolean;
  isLoading?: boolean;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    EMERGENCY: Zap,
    DIAGNOSTIC: Activity,
    LABORATORY: Microscope,
    INTENSIVE_CARE: Users,
    OPERATING_ROOM: Stethoscope,
    PATIENT_ROOM: Building2,
    PHARMACY: ShieldCheck,
    PARKING: Car,
    CAFETERIA: Building2,
    ACCESSIBILITY: Users,
    OTHER: Building2,
  };
  return icons[category] || Building2;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    EMERGENCY: 'bg-red-100 text-red-800 border-red-200',
    DIAGNOSTIC: 'bg-blue-100 text-blue-800 border-blue-200',
    LABORATORY: 'bg-purple-100 text-purple-800 border-purple-200',
    INTENSIVE_CARE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    OPERATING_ROOM: 'bg-green-100 text-green-800 border-green-200',
    PATIENT_ROOM: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    PHARMACY: 'bg-pink-100 text-pink-800 border-pink-200',
    PARKING: 'bg-gray-100 text-gray-800 border-gray-200',
    CAFETERIA: 'bg-orange-100 text-orange-800 border-orange-200',
    ACCESSIBILITY: 'bg-teal-100 text-teal-800 border-teal-200',
    OTHER: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return colors[category] || colors.OTHER;
};

export function FacilityTable({ facilities, showHospital = true, isLoading = false }: FacilityTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  const handleDelete = (facility: any) => {
    setSelectedFacility(facility);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Facilities
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {facilities.length} {facilities.length === 1 ? 'facility' : 'facilities'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Category</TableHead>
                  {showHospital && <TableHead>Hospital</TableHead>}
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showHospital ? 6 : 5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Activity className="h-12 w-12" />
                        <p className="text-sm">No facilities found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  facilities.map((facility) => {
                    const CategoryIcon = getCategoryIcon(facility.category);
                    const categoryColor = getCategoryColor(facility.category);
                    
                    return (
                      <TableRow key={facility.id} className="group hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                              <CategoryIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">{facility.name}</div>
                              {facility.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {facility.description}
                                </p>
                              )}
                            </div>
                            {facility.icon && (
                              <span className="text-lg">{facility.icon}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn('font-medium', categoryColor)}
                          >
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {facility.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        {showHospital && (
                          <TableCell>
                            <div className="space-y-2">
                              {facility.primary_hospital ? (
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-1">
                                      {facility.primary_hospital.name}
                                      <Star className="h-3 w-3 text-yellow-500" />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {facility.primary_hospital.city}, {facility.primary_hospital.state}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">No primary hospital</span>
                                </div>
                              )}
                              
                              {facility.hospitals && facility.hospitals.length > 1 && (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="text-xs">
                                    +{facility.hospitals.length - 1} more
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">hospitals</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {facility.capacity ? (
                              <span className="font-medium">
                                {facility.capacity} 
                                <span className="text-muted-foreground ml-1">units</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not specified</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {facility.is_available ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Available
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <Badge variant="destructive">
                                  Unavailable
                                </Badge>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/cms/facilities/${facility.hospital_id}/${facility.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem asChild>
                                  <Link href={`/cms/facilities/${facility.hospital_id}/${facility.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/cms/facilities/${facility.hospital_id}/${facility.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Facility
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(facility)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedFacility && (
        <DeleteFacilityDialog
          facility={selectedFacility}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  );
}
