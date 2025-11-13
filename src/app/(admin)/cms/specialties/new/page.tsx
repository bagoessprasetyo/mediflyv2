'use client';

import { SpecialtyForm } from '@/components/specialties/specialty-form';

export default function NewSpecialtyPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Specialty</h1>
        <p className="text-muted-foreground">Add a new medical specialty to the system</p>
      </div>

      <div className="max-w-2xl">
        <SpecialtyForm />
      </div>
    </div>
  );
}