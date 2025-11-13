'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTreatments } from '@/lib/queries/treatments';
import { useHospitals } from '@/lib/queries/hospitals';
import { TreatmentTable } from '@/components/treatments/treatment-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TreatmentsPage() {
  const [search, setSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const { data: treatments, isLoading } = useTreatments({ search, hospital_id: hospitalFilter, category: categoryFilter });
  const { data: hospitals } = useHospitals();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treatments & Packages</h1>
          <p className="text-muted-foreground">Manage treatment packages offered by hospitals</p>
        </div>
        <Button asChild>
          <Link href="/cms/treatments/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Treatment
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search treatments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All hospitals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All hospitals</SelectItem>
            {hospitals?.map((hospital: any) => (
              <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All categories</SelectItem>
            <SelectItem value="SURGERY">Surgery</SelectItem>
            <SelectItem value="THERAPY">Therapy</SelectItem>
            <SelectItem value="DIAGNOSTIC">Diagnostic</SelectItem>
            <SelectItem value="WELLNESS">Wellness</SelectItem>
            <SelectItem value="PREVENTIVE">Preventive</SelectItem>
            <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><p className="text-muted-foreground">Loading...</p></div>
      ) : (
        <TreatmentTable treatments={treatments || []} />
      )}
    </div>
  );
}
