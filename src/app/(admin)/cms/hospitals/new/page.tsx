'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useCreateHospital } from '@/lib/queries/hospitals';
import { HospitalForm } from '@/components/hospitals/hospital-form';
import { HospitalFormLoadingSkeleton } from '@/components/skeletons/hospital-form-skeleton';
import { HospitalFormData } from '@/lib/validations/hospital';

export default function NewHospitalPage() {
  const router = useRouter();
  const createHospital = useCreateHospital();

  const handleSubmit = async (data: HospitalFormData) => {
    await createHospital.mutateAsync(data);
    router.push('/cms/hospitals');
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
           <div>
              <h1 className="text-3xl font-bold">Add New Hospital</h1>
              <p className="text-muted-foreground">
                Fill in the information below to create a new hospital
              </p>
            </div>

            <Suspense fallback={<HospitalFormLoadingSkeleton />}>
              <HospitalForm
                onSubmit={handleSubmit}
                isLoading={createHospital.isPending}
              />
            </Suspense>
        </div>
      </div>
    </div>
  );
}