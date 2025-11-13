'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useHospital, useUpdateHospital } from '@/lib/queries/hospitals';
import { HospitalForm } from '@/components/hospitals/hospital-form';
import { HospitalFormLoadingSkeleton } from '@/components/skeletons/hospital-form-skeleton';
import { HospitalFormData } from '@/lib/validations/hospital';

export default function EditHospitalPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = params.id as string;

  const { data: hospital, isLoading } = useHospital(hospitalId);
  const updateHospital = useUpdateHospital(hospitalId);

  const handleSubmit = async (data: HospitalFormData) => {
    await updateHospital.mutateAsync(data);
    router.push(`/cms/hospitals/${hospitalId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
            <HospitalFormLoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Hospital not found</h3>
              <p className="text-muted-foreground">
                The hospital you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Hospital</h1>
            <p className="text-muted-foreground">
              Update the information for {hospital.name}
            </p>
          </div>

          <Suspense fallback={<HospitalFormLoadingSkeleton />}>
            <HospitalForm
              defaultValues={hospital}
              onSubmit={handleSubmit}
              isLoading={updateHospital.isPending}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}