'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useDoctor } from '@/lib/queries/doctors';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

// Import all our new components
import { DoctorDetailSkeleton } from '@/components/skeletons/doctor-detail-skeleton';
import { DoctorHeader } from '@/components/doctors/doctor-detail/doctor-header';
import { DoctorStatsCard } from '@/components/doctors/doctor-detail/doctor-stats-card';
import { HospitalAffiliations } from '@/components/doctors/doctor-detail/hospital-affiliations';
import { SpecialtyBadges } from '@/components/doctors/doctor-detail/specialty-badges';
import { EducationTimeline } from '@/components/doctors/doctor-detail/education-timeline';
import { AvailabilityCalendar } from '@/components/doctors/doctor-detail/availability-calendar';
import { ConsultationInfo } from '@/components/doctors/doctor-detail/consultation-info';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-6">
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Something went wrong loading the doctor profile: {error.message}</span>
            <Button 
              onClick={resetErrorBoundary} 
              size="sm" 
              variant="outline"
              className="ml-4"
            >
              <IconRefresh className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

function DoctorProfileContent() {
  const params = useParams();
  const id = params?.id as string;
  const { data: doctor, isLoading, error } = useDoctor(id);

  if (isLoading) {
    return <DoctorDetailSkeleton />;
  }

  if (error || !doctor) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6 p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <IconAlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Doctor Not Found</h2>
              <p className="text-muted-foreground text-center max-w-md">
                {error?.message || 'The doctor profile you are looking for could not be found or may have been removed.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-6">
        {/* Doctor Header Section */}
        <DoctorHeader doctor={doctor} />

        {/* Quick Stats Cards */}
        <DoctorStatsCard doctor={doctor} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (Left - 2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biography Section */}
            {doctor.biography && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About Dr. {doctor.first_name} {doctor.last_name}</h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="leading-relaxed">{doctor.biography}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hospital Affiliations */}
            {doctor.doctor_hospitals && doctor.doctor_hospitals.length > 0 && (
              <HospitalAffiliations affiliations={doctor.doctor_hospitals} />
            )}

            {/* Education Timeline */}
            {doctor.education && (
              <EducationTimeline education={doctor.education} />
            )}

            {/* Specialties (moved to main column for better visibility) */}
            {doctor.doctor_specialties && doctor.doctor_specialties.length > 0 && (
              <SpecialtyBadges specialties={doctor.doctor_specialties} />
            )}
          </div>

          {/* Sidebar Column (Right - 1/3 width) */}
          <div className="space-y-6">
            {/* Consultation Information */}
            <ConsultationInfo doctor={doctor} />

            {/* Availability Calendar */}
            <AvailabilityCalendar doctorId={doctor.id} doctor={doctor} />

            {/* Contact Information Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-sm">Contact Information</h4>
                
                <div className="space-y-3 text-sm">
                  {doctor.email && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Email</div>
                      <a 
                        href={`mailto:${doctor.email}`}
                        className="text-primary hover:underline"
                      >
                        {doctor.email}
                      </a>
                    </div>
                  )}
                  
                  {doctor.phone && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Phone</div>
                      <a 
                        href={`tel:${doctor.phone}`}
                        className="text-primary hover:underline"
                      >
                        {doctor.phone}
                      </a>
                    </div>
                  )}
                  
                  {doctor.license_number && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground">License Number</div>
                      <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {doctor.license_number}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Status */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-sm">Professional Status</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${doctor.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {doctor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Verified</span>
                    <span className={`font-medium ${doctor.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                      {doctor.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">New Patients</span>
                    <span className={`font-medium ${doctor.is_accepting_new_patients ? 'text-green-600' : 'text-red-600'}`}>
                      {doctor.is_accepting_new_patients ? 'Accepting' : 'Not Accepting'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Telehealth</span>
                    <span className={`font-medium ${doctor.is_telehealth_available ? 'text-blue-600' : 'text-gray-600'}`}>
                      {doctor.is_telehealth_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorViewPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<DoctorDetailSkeleton />}>
        <DoctorProfileContent />
      </Suspense>
    </ErrorBoundary>
  );
}