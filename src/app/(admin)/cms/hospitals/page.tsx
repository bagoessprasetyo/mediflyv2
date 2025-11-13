'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHospitals } from '@/lib/queries/hospitals';
import { HospitalTable } from '@/components/hospitals/hospital-table';
import { HospitalPageSkeleton } from '@/components/skeletons/hospital-skeleton';
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
// Layout now provides sidebar and header

export default function HospitalsPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const { data: hospitals, isLoading } = useHospitals({
    search,
    city: cityFilter,
    type: typeFilter,
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Hospitals</h1>
              <p className="text-muted-foreground">Manage all hospitals in the system</p>
            </div>
            <Button asChild>
              <Link href="/cms/hospitals/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Hospital
              </Link>
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search hospitals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>All types</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="SPECIALTY">Specialty</SelectItem>
                <SelectItem value="TEACHING">Teaching</SelectItem>
                <SelectItem value="CLINIC">Clinic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <HospitalPageSkeleton />
          ) : (
            <HospitalTable hospitals={hospitals || []} />
          )}
        </div>
      </div>
    </div>
  );
}