'use client';

import { useSpecialty } from '@/lib/queries/specialties';
import { SpecialtyForm } from '@/components/specialties/specialty-form';
import { SpecialtyFormSkeleton } from '@/components/specialties/specialty-skeleton';
import { use } from 'react';

interface EditSpecialtyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSpecialtyPage({ params }: EditSpecialtyPageProps) {
  const { id } = use(params);
  const { data: specialty, isLoading } = useSpecialty(id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Specialty</h1>
          <p className="text-muted-foreground">Update specialty information</p>
        </div>

        <div className="max-w-2xl">
          <SpecialtyFormSkeleton />
        </div>
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Specialty Not Found</h1>
          <p className="text-muted-foreground">The specialty you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Specialty</h1>
        <p className="text-muted-foreground">Update information for {specialty.name}</p>
      </div>

      <div className="max-w-2xl">
        <SpecialtyForm specialty={specialty} isEditing />
      </div>
    </div>
  );
}