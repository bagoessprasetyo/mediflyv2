'use client';

import { useRouter } from 'next/navigation';
import { useUpdateTreatment, useTreatment } from '@/lib/queries/treatments';
import { useParams } from 'next/navigation';
import { TreatmentForm } from '@/components/treatments/treatment-form';

export default function EditTreatmentPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: treatment, isLoading } = useTreatment(id);
  const updateTreatment = useUpdateTreatment(id);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await updateTreatment.mutateAsync(data);
    router.push(`/cms/treatments/${id}`);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!treatment) return <div className="p-6">Treatment not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Treatment</h1>
        <p className="text-muted-foreground">Update information for {treatment.name}</p>
      </div>

      <TreatmentForm defaultValues={treatment} onSubmit={handleSubmit} isLoading={(updateTreatment as any).isPending} />
    </div>
  );
}
