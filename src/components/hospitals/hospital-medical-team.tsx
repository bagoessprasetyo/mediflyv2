'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Calendar,
  Phone,
  Mail,
  Star,
  Clock,
  Stethoscope,
  ShieldCheck,
  Video,
  User,
  Award,
  Building2,
  ChevronRight,
  Filter,
  MapPin,
  Heart,
  Brain,
  Eye,
  Bone
} from 'lucide-react';

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  profile_image?: string;
  years_of_experience?: number;
  consultation_fee?: number;
  is_active: boolean;
  is_verified: boolean;
  is_accepting_new_patients: boolean;
  is_telehealth_available: boolean;
  position_title?: string;
  department?: string;
  is_primary: boolean;
  doctor_specialties?: Array<{
    is_primary: boolean;
    board_certified: boolean;
    specialty: {
      name: string;
      category: string;
      color_code?: string;
    };
  }>;
}

interface HospitalMedicalTeamProps {
  hospitalId: string;
  hospitalName: string;
  doctors: Doctor[];
  isLoading?: boolean;
}

// Specialty icon mapping
const getSpecialtyIcon = (category: string) => {
  const icons: Record<string, any> = {
    CARDIOLOGY: Heart,
    NEUROLOGY: Brain,
    OPHTHALMOLOGY: Eye,
    ORTHOPEDICS: Bone,
    GENERAL: Stethoscope,
    SURGERY: Building2,
    PEDIATRICS: Users,
    INTERNAL_MEDICINE: Stethoscope,
    OTHER: Stethoscope,
  };
  return icons[category] || Stethoscope;
};

// Specialty color mapping
const getSpecialtyColor = (category: string) => {
  const colors: Record<string, string> = {
    CARDIOLOGY: 'bg-red-100 text-red-800 border-red-200',
    NEUROLOGY: 'bg-purple-100 text-purple-800 border-purple-200',
    OPHTHALMOLOGY: 'bg-blue-100 text-blue-800 border-blue-200',
    ORTHOPEDICS: 'bg-green-100 text-green-800 border-green-200',
    GENERAL: 'bg-gray-100 text-gray-800 border-gray-200',
    SURGERY: 'bg-orange-100 text-orange-800 border-orange-200',
    PEDIATRICS: 'bg-pink-100 text-pink-800 border-pink-200',
    INTERNAL_MEDICINE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    OTHER: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return colors[category] || colors.OTHER;
};

function DoctorCard({ doctor, hospitalName }: { doctor: Doctor; hospitalName: string }) {
  const initials = `${doctor.first_name.charAt(0)}${doctor.last_name.charAt(0)}`;
  const primarySpecialty = doctor.doctor_specialties?.find(s => s.is_primary);
  const SpecialtyIcon = primarySpecialty ? getSpecialtyIcon(primarySpecialty.specialty.category) : Stethoscope;
  const specialtyColor = primarySpecialty ? getSpecialtyColor(primarySpecialty.specialty.category) : 'bg-gray-100 text-gray-800 border-gray-200';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Doctor Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
              <AvatarImage 
                src={doctor.profile_image} 
                alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-semibold bg-blue-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicators */}
            {doctor.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            )}
            
            {doctor.is_primary && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Star className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Doctor Information */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                Dr. {doctor.first_name} {doctor.last_name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {doctor.title && (
                  <Badge variant="outline" className="text-xs">
                    {doctor.title}
                  </Badge>
                )}
                {primarySpecialty && (
                  <Badge variant="outline" className={`text-xs ${specialtyColor}`}>
                    <SpecialtyIcon className="w-3 h-3 mr-1" />
                    {primarySpecialty.specialty.name}
                  </Badge>
                )}
                {primarySpecialty?.board_certified && (
                  <Badge className="text-xs bg-green-600 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Board Certified
                  </Badge>
                )}
              </div>
            </div>

            {/* Position and Department */}
            <div className="space-y-1">
              {doctor.position_title && (
                <p className="text-sm font-medium text-gray-700">
                  {doctor.position_title}
                </p>
              )}
              {doctor.department && (
                <p className="text-sm text-gray-600">
                  {doctor.department} • {hospitalName}
                </p>
              )}
            </div>

            {/* Experience and Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {doctor.years_of_experience && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.years_of_experience} years exp.</span>
                </div>
              )}
              {doctor.consultation_fee && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">
                    From {formatCurrency(doctor.consultation_fee)}
                  </span>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {doctor.is_accepting_new_patients && (
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Accepting Patients
                </Badge>
              )}
              {doctor.is_telehealth_available && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Telehealth
                </Badge>
              )}
              {!doctor.is_active && (
                <Badge variant="destructive" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" className="flex-1" asChild>
                <Link href={`/cms/doctors/${doctor.id}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DoctorCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HospitalMedicalTeam({ hospitalId, hospitalName, doctors, isLoading }: HospitalMedicalTeamProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Filter doctors based on search and tab
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchQuery || 
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.position_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.doctor_specialties?.some(s => s.specialty.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'primary' && doctor.is_primary) ||
      (selectedTab === 'active' && doctor.is_accepting_new_patients) ||
      (selectedTab === 'telehealth' && doctor.is_telehealth_available);

    return matchesSearch && matchesTab;
  });

  // Group doctors by specialty
  const specialtyGroups = filteredDoctors.reduce((groups: Record<string, Doctor[]>, doctor) => {
    const primarySpecialty = doctor.doctor_specialties?.find(s => s.is_primary);
    const specialtyName = primarySpecialty?.specialty.name || 'General Medicine';
    
    if (!groups[specialtyName]) {
      groups[specialtyName] = [];
    }
    groups[specialtyName].push(doctor);
    
    return groups;
  }, {});

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter(d => d.is_active).length;
  const acceptingPatients = doctors.filter(d => d.is_accepting_new_patients).length;
  const telehealth = doctors.filter(d => d.is_telehealth_available).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Medical Team ({totalDoctors})
          </CardTitle>
          <Button variant="outline" asChild>
            <Link href={`/cms/doctors?hospital_id=${hospitalId}`}>
              View All Doctors
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeDoctors}</div>
            <div className="text-sm text-blue-700">Active Doctors</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{acceptingPatients}</div>
            <div className="text-sm text-green-700">Accepting Patients</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{telehealth}</div>
            <div className="text-sm text-purple-700">Telehealth Available</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{Object.keys(specialtyGroups).length}</div>
            <div className="text-sm text-orange-700">Specialties</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name, specialty, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All Doctors</TabsTrigger>
            <TabsTrigger value="primary">Primary Staff</TabsTrigger>
            <TabsTrigger value="active">Accepting Patients</TabsTrigger>
            <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6 mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <DoctorCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 
                    'Try adjusting your search criteria.' : 
                    'No doctors match the selected filter.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(specialtyGroups).map(([specialtyName, specialtyDoctors]) => (
                  <div key={specialtyName}>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      {specialtyName} ({specialtyDoctors.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {specialtyDoctors.map((doctor) => (
                        <DoctorCard 
                          key={doctor.id} 
                          doctor={doctor} 
                          hospitalName={hospitalName}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}