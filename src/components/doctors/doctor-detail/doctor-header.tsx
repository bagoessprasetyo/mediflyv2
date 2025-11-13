'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IconMail,
  IconPhone,
  IconEdit,
  IconMapPin,
  IconCertificate,
  IconStar,
  IconStethoscope,
  IconCalendar,
  IconVideo,
  IconUser
} from '@tabler/icons-react';

interface DoctorHeaderProps {
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    title?: string;
    email?: string;
    phone?: string;
    profile_image?: string;
    years_of_experience?: number;
    is_verified?: boolean;
    is_accepting_new_patients?: boolean;
    is_telehealth_available?: boolean;
    languages?: string[];
    consultation_fee?: number;
    doctor_hospitals?: Array<{
      is_primary: boolean;
      position_title?: string;
      hospital: {
        name: string;
        city?: string;
      };
    }>;
    doctor_specialties?: Array<{
      is_primary: boolean;
      board_certified?: boolean;
      specialty: {
        name: string;
        category?: string;
      };
    }>;
  };
}

export function DoctorHeader({ doctor }: DoctorHeaderProps) {
  const primaryHospital = doctor.doctor_hospitals?.find(dh => dh.is_primary);
  const primarySpecialty = doctor.doctor_specialties?.find(ds => ds.is_primary);
  const initials = `${doctor.first_name.charAt(0)}${doctor.last_name.charAt(0)}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative">
      <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
                <AvatarImage 
                  src={doctor.profile_image} 
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl lg:text-2xl font-semibold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {doctor.is_verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5">
                  <IconCertificate className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {doctor.title && (
                    <Badge variant="outline" className="text-sm">
                      {doctor.title}
                    </Badge>
                  )}
                  {primarySpecialty && (
                    <Badge variant="secondary" className="text-sm">
                      <IconStethoscope className="w-3 h-3 mr-1" />
                      {primarySpecialty.specialty.name}
                    </Badge>
                  )}
                  {primarySpecialty?.board_certified && (
                    <Badge variant="default" className="text-sm bg-green-600">
                      <IconCertificate className="w-3 h-3 mr-1" />
                      Board Certified
                    </Badge>
                  )}
                </div>
                
                {/* Location & Experience */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {primaryHospital && (
                    <div className="flex items-center gap-1">
                      <IconMapPin className="w-4 h-4" />
                      <span>{primaryHospital.hospital.name}</span>
                      {primaryHospital.hospital.city && (
                        <span>, {primaryHospital.hospital.city}</span>
                      )}
                    </div>
                  )}
                  {doctor.years_of_experience && (
                    <div className="flex items-center gap-1">
                      <IconStar className="w-4 h-4" />
                      <span>{doctor.years_of_experience} years experience</span>
                    </div>
                  )}
                </div>

                {/* Languages */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-sm text-muted-foreground">Languages:</span>
                    <div className="flex gap-1">
                      {doctor.languages.map((lang, index) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap gap-2">
                {doctor.is_accepting_new_patients && (
                  <Badge variant="default" className="bg-green-600 text-white">
                    <IconUser className="w-3 h-3 mr-1" />
                    Accepting New Patients
                  </Badge>
                )}
                {doctor.is_telehealth_available && (
                  <Badge variant="secondary">
                    <IconVideo className="w-3 h-3 mr-1" />
                    Telehealth Available
                  </Badge>
                )}
                {doctor.consultation_fee && (
                  <Badge variant="outline">
                    From {formatCurrency(doctor.consultation_fee)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 min-w-fit">
              <Button className="w-full lg:w-auto">
                <IconCalendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              
              <div className="flex gap-2">
                {doctor.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${doctor.phone}`}>
                      <IconPhone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                {doctor.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${doctor.email}`}>
                      <IconMail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>

              {/* Admin Edit Button */}
              <Button variant="ghost" size="sm" asChild className="mt-2">
                <Link href={`/cms/doctors/${doctor.id}/edit`}>
                  <IconEdit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}