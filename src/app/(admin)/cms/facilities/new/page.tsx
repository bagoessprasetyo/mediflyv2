'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useCreateFacility } from '@/lib/queries/facilities';
import { CreateFacilityRequest } from '@/lib/validations/facility';
import { FacilityForm } from '@/components/facilities/facility-form';
import { FacilityFormLoadingSkeleton } from '@/components/skeletons/facility-form-skeleton';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();
  const createFacility = useCreateFacility();

  const handleSubmit = async (data: CreateFacilityRequest) => {
    try {
      await createFacility.mutateAsync(data);
      router.push('/cms/facilities');
    } catch (error) {
      // Error is handled by the mutation's onError callback with toast
      console.error('Failed to create facility:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cms/facilities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Facility</h1>
              <p className="text-muted-foreground">Add a facility and associate it with one or more hospitals</p>
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
          <BreadcrumbPage>New Facility</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <FacilityForm
        defaultValues={{
          hospital_relationships: []
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
    <div className="container mx-auto py-6">
      <Suspense fallback={<FacilityFormLoadingSkeleton />}>
        <NewFacilityContent />
      </Suspense>
    </div>
  );
}