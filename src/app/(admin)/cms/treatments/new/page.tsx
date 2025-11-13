'use client';

import { useRouter } from 'next/navigation';
import { useCreateTreatment } from '@/lib/queries/treatments';
import { TreatmentForm } from '@/components/treatments/treatment-form';

export default function NewTreatmentPage() {
  const router = useRouter();
  const createTreatment = useCreateTreatment();

  const handleSubmit = async (data: any) => {
    await createTreatment.mutateAsync(data);
    router.push('/cms/treatments');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Treatment</h1>
        <p className="text-muted-foreground">Create a new treatment package</p>
      </div>

      <TreatmentForm onSubmit={handleSubmit} isLoading={(createTreatment as any).isPending} />
    </div>
  );
}
