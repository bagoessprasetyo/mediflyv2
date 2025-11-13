'use client';

import { useRouter } from 'next/navigation';
import { DoctorForm } from '@/components/doctors/doctor-form';
import { useCreateDoctor } from '@/lib/queries/doctors';

export default function NewDoctorPage() {
  const router = useRouter();
  const createDoctor = useCreateDoctor();

  const handleCreate = async (data: any) => {
    await createDoctor.mutateAsync(data);
    router.push('/cms/doctors');
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-3xl font-bold">Add Doctor</h1>
            <p className="text-muted-foreground">Create a new doctor profile</p>
          </div>

          <DoctorForm onSubmit={handleCreate} isLoading={(createDoctor as any).isPending} />
        </div>
      </div>
    </div>
  );
}
