'use client';

import { InspiredContentForm } from '@/components/inspired-content/inspired-content-form';

export default function NewInspiredContentPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Create Inspired Content</h1>
        <p className="text-muted-foreground">
          Create engaging content to inspire patients and medical tourists
        </p>
      </div>

      <div className="max-w-4xl">
        <InspiredContentForm />
      </div>
    </div>
  );
}