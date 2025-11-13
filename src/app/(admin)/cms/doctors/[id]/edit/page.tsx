'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useDoctor, useUpdateDoctor } from '@/lib/queries/doctors';
import { useParams } from 'next/navigation';
import { DoctorForm } from '@/components/doctors/doctor-form';

export default function EditDoctorPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: doctor, isLoading } = useDoctor(id);
  const updateDoctor = useUpdateDoctor(id);
  const router = useRouter();

  const handleUpdate = async (data: any) => {
    await updateDoctor.mutateAsync(data);
    router.push(`/cms/doctors/${id}`);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!doctor) return <div className="p-6">Doctor not found</div>;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Doctor</h1>
            <p className="text-muted-foreground">Update doctor profile</p>
          </div>

          <DoctorForm defaultValues={doctor} onSubmit={handleUpdate} isLoading={(updateDoctor as any).isPending} />
        </div>
      </div>
    </div>
  );
}
