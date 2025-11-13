'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useCreateFacility } from '@/lib/queries/facilities';
import { CreateFacilityRequest } from '@/lib/validations/facility';
import { useHospital } from '@/lib/queries/hospitals';
import { FacilityForm } from '@/components/facilities/facility-form';
import { FacilityFormLoadingSkeleton } from '@/components/skeletons/facility-form-skeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Plus,
  Building2
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function NewFacilityContent() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = params.hospitalId as string;

  const { data: hospital, isLoading: hospitalLoading } = useHospital(hospitalId);
  const createFacility = useCreateFacility();

  const handleSubmit = async (data: CreateFacilityRequest) => {
    try {
      await createFacility.mutateAsync(data);
      router.push(`/cms/facilities`);
    } catch (error) {
      // Error is handled by the mutation's onError callback with toast
      console.error('Failed to create facility:', error);
    }
  };

  if (hospitalLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-6 w-32" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Hospital not found</h3>
          <p className="text-muted-foreground mb-4">
            The hospital you're trying to add a facility to doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/cms/facilities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Facilities
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/cms/hospitals/${hospitalId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Add New Facility</h1>
              <p className="text-muted-foreground">Create a facility for {hospital.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cms/facilities">Facilities</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/cms/hospitals/${hospitalId}`}>
              {hospital.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>New Facility</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <FacilityForm
        defaultValues={{
          hospital_relationships: [{
            hospital_id: hospitalId,
            facility_id: '',
            primary_hospital: true,
            access_level: 'FULL',
            cost_sharing_percentage: 100,
            notes: ''
          }]
        } as any}
        onSubmit={handleSubmit}
        isLoading={createFacility.isPending}
        mode="create"
      />
    </div>
  );
}

export default function NewFacilityPage() {
  return (
    <Suspense fallback={<FacilityFormLoadingSkeleton />}>
      <NewFacilityContent />
    </Suspense>
  );
}
