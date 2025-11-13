'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useHospital } from '@/lib/queries/hospitals';
import { useHospitalFacilities } from '@/lib/queries/facilities';
import { FacilityTable } from '@/components/facilities/facility-table';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

export default function HospitalFacilitiesPage() {
  const params = useParams();
  const hospitalId = params.hospitalId as string;

  const { data: hospital } = useHospital(hospitalId);
  const { data: facilities, isLoading } = useHospitalFacilities(hospitalId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cms/facilities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Facilities</h1>
            <p className="text-muted-foreground">{hospital?.name}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/cms/facilities/${hospitalId}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Link>
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <FacilityTable facilities={facilities || []} showHospital={false} />
      )}
    </div>
  );
}
