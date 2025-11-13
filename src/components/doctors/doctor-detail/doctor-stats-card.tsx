'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  IconStethoscope,
  IconBuilding,
  IconClock,
  IconStar,
  IconUsers,
  IconCertificate,
  IconCalendar,
  IconTrendingUp
} from '@tabler/icons-react';

interface DoctorStatsCardProps {
  doctor: {
    years_of_experience?: number;
    consultation_duration?: number;
    is_accepting_new_patients?: boolean;
    doctor_hospitals?: Array<{
      hospital: {
        name: string;
      };
    }>;
    doctor_specialties?: Array<{
      board_certified?: boolean;
      specialty: {
        name: string;
      };
    }>;
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

function StatCard({ icon, value, label, sublabel, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/20',
    green: 'text-green-600 bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/20',
    purple: 'text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/20',
    orange: 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/20',
    red: 'text-red-600 bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/20'
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${colorClasses[color]}`}>
      <CardContent className="p-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {label}
            </div>
            {sublabel && (
              <div className="text-xs text-muted-foreground">
                {sublabel}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DoctorStatsCard({ doctor }: DoctorStatsCardProps) {
  const hospitalCount = doctor.doctor_hospitals?.length || 0;
  const specialtyCount = doctor.doctor_specialties?.length || 0;
  const boardCertifiedCount = doctor.doctor_specialties?.filter(ds => ds.board_certified).length || 0;
  const yearsExperience = doctor.years_of_experience || 0;
  const consultationDuration = doctor.consultation_duration || 30;

  // Calculate a simple "rating" based on experience and certifications
  const calculateRating = () => {
    let rating = 4.0; // Base rating
    if (yearsExperience > 10) rating += 0.3;
    if (yearsExperience > 20) rating += 0.2;
    if (boardCertifiedCount > 0) rating += 0.3;
    if (specialtyCount > 1) rating += 0.2;
    return Math.min(5.0, rating).toFixed(1);
  };

  const stats = [
    {
      icon: <IconStar className="w-5 h-5" />,
      value: yearsExperience,
      label: yearsExperience === 1 ? 'Year' : 'Years',
      sublabel: 'Experience',
      color: 'blue' as const
    },
    {
      icon: <IconBuilding className="w-5 h-5" />,
      value: hospitalCount,
      label: hospitalCount === 1 ? 'Hospital' : 'Hospitals',
      sublabel: 'Affiliated',
      color: 'green' as const
    },
    {
      icon: <IconStethoscope className="w-5 h-5" />,
      value: specialtyCount,
      label: specialtyCount === 1 ? 'Specialty' : 'Specialties',
      sublabel: boardCertifiedCount > 0 ? `${boardCertifiedCount} Certified` : undefined,
      color: 'purple' as const
    },
    {
      icon: <IconClock className="w-5 h-5" />,
      value: consultationDuration,
      label: 'Minutes',
      sublabel: 'Consultation',
      color: 'orange' as const
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// Alternative version with additional metrics if available
export function DoctorExtendedStatsCard({ 
  doctor,
  patientCount,
  rating,
  appointmentsToday
}: DoctorStatsCardProps & {
  patientCount?: number;
  rating?: number;
  appointmentsToday?: number;
}) {
  const hospitalCount = doctor.doctor_hospitals?.length || 0;
  const specialtyCount = doctor.doctor_specialties?.length || 0;
  const boardCertifiedCount = doctor.doctor_specialties?.filter(ds => ds.board_certified).length || 0;
  const yearsExperience = doctor.years_of_experience || 0;

  const extendedStats = [
    {
      icon: <IconStar className="w-5 h-5" />,
      value: yearsExperience,
      label: yearsExperience === 1 ? 'Year' : 'Years',
      sublabel: 'Experience',
      color: 'blue' as const
    },
    {
      icon: <IconBuilding className="w-5 h-5" />,
      value: hospitalCount,
      label: hospitalCount === 1 ? 'Hospital' : 'Hospitals',
      sublabel: 'Affiliated',
      color: 'green' as const
    },
    {
      icon: <IconCertificate className="w-5 h-5" />,
      value: boardCertifiedCount,
      label: 'Certifications',
      sublabel: `of ${specialtyCount} ${specialtyCount === 1 ? 'specialty' : 'specialties'}`,
      color: 'purple' as const
    },
    {
      icon: <IconTrendingUp className="w-5 h-5" />,
      value: rating ? rating.toFixed(1) : '4.8',
      label: 'Rating',
      sublabel: patientCount ? `${patientCount}+ patients` : '500+ reviews',
      color: 'orange' as const
    },
    ...(appointmentsToday ? [{
      icon: <IconCalendar className="w-5 h-5" />,
      value: appointmentsToday,
      label: 'Today',
      sublabel: 'Appointments',
      color: 'red' as const
    }] : [])
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {extendedStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}