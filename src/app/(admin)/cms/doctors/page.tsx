'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDoctors } from '@/lib/queries/doctors';
import { DoctorTable } from '@/components/doctors/doctor-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState<string | undefined>();

  const { data: doctors, isLoading } = useDoctors({ search, hospital_id: hospitalFilter });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Doctors</h1>
              <p className="text-muted-foreground">Manage clinicians and their profiles</p>
            </div>
            <Button asChild>
              <Link href="/cms/doctors/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Link>
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined as any}>All hospitals</SelectItem>
                {/* Optionally populate hospitals here if needed */}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <DoctorTable doctors={doctors || []} />
          )}
        </div>
      </div>
    </div>
  );
}
