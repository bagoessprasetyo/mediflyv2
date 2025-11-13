'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSpecialties } from '@/lib/queries/specialties';
import { specialtyCategories } from '@/lib/validations/specialty';
import { SpecialtyTable } from '@/components/specialties/specialty-table';
import { SpecialtyDetailSheet } from '@/components/specialties/specialty-detail-sheet';
import { SpecialtyTableSkeleton } from '@/components/specialties/specialty-skeleton';
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

export default function SpecialtiesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const { data: specialties, isLoading } = useSpecialties({ 
    search, 
    category: categoryFilter, 
    is_active: statusFilter 
  });

  const handleViewSpecialty = (specialty: any) => {
    setSelectedSpecialty(specialty);
    setDetailSheetOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Specialties</h1>
          <p className="text-muted-foreground">Manage medical specialties and their categories</p>
        </div>
        <Button asChild>
          <Link href="/cms/specialties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Specialty
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search specialties by name, code, or description..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>All categories</SelectItem>
            {specialtyCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={statusFilter?.toString()} 
          onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value === 'true')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <SpecialtyTableSkeleton />
      ) : (
        <SpecialtyTable 
          specialties={specialties || []} 
          onViewSpecialty={handleViewSpecialty}
        />
      )}

      <SpecialtyDetailSheet
        specialty={selectedSpecialty}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
}