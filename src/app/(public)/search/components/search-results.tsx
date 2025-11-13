'use client';

import { useState } from 'react';
import { Heart, Users } from 'lucide-react';
import { HospitalCard22 } from '@/components/ui/hospital-card-22';
import { DoctorCard22 } from '@/components/ui/doctor-card-22';
import { SearchResultsSkeleton } from '@/components/ui/search-results-skeleton';
import { cn } from '@/lib/utils';

interface Hospital {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  emergencyServices: boolean;
  traumaLevel?: string;
  address: string;
  phone: string;
  website?: string;
  specialties: string[];
  similarity: number;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  profileImage?: string;
  yearsOfExperience: number;
  consultationFee?: number;
  acceptingNewPatients: boolean;
  telehealth: boolean;
  specialties: Array<{
    name: string;
    category: string;
    isPrimary: boolean;
    boardCertified: boolean;
    yearsInSpecialty?: number;
  }>;
  hospitals: Array<{
    id: string;
    name: string;
    city: string;
    isPrimary: boolean;
    positionTitle?: string;
    department?: string;
  }>;
}

interface SearchResultsProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  query: string;
  location?: string;
  filters: any;
  loading?: boolean;
}

export function SearchResults({ hospitals, doctors, query, location, filters, loading = false }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors'>('hospitals');

  // Show skeleton while loading
  if (loading) {
    return <SearchResultsSkeleton cardCount={12} />;
  }

  if (hospitals.length === 0 && doctors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-subsection-title text-gray-900">
            No Results Found
          </h3>
          <p className="text-body-secondary text-gray-600 max-w-md mx-auto">
            We couldn't find any hospitals or doctors matching your search criteria. 
            Try broadening your search or ask Aira for suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Tab Navigation */}
      <div className="border rounded-md bg-muted p-1 w-fit">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-sm transition-colors whitespace-nowrap",
              activeTab === 'hospitals'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Hospitals</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                {hospitals.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-sm transition-colors whitespace-nowrap",
              activeTab === 'doctors'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Specialists</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                {doctors.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Hospital Results */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard22 key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}

      {/* Doctor Results */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard22 key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

