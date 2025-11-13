'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTreatment } from '@/lib/queries/treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TreatmentViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: treatment, isLoading } = useTreatment(id);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!treatment) return <div className="p-6">Treatment not found</div>;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{treatment.name}</h1>
              <p className="text-muted-foreground">{treatment.category}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/cms/treatments/${id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Hospital:</strong> {treatment.hospital?.name}</p>
              <p><strong>Doctor:</strong> {treatment.doctor ? `${treatment.doctor.first_name} ${treatment.doctor.last_name}` : 'N/A'}</p>
              <p className="mt-2">{treatment.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
