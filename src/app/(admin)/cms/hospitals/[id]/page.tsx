'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useHospitalWithDoctors } from '@/lib/queries/hospitals';
import { HospitalDetailSkeleton } from '@/components/skeletons/hospital-detail-skeleton';
import { HospitalHeroSection } from '@/components/hospitals/hospital-hero';
import { HospitalMedicalTeam } from '@/components/hospitals/hospital-medical-team';
import { HospitalScheduleCard } from '@/components/hospitals/hospital-schedule-card';
import { HospitalQualityMetrics } from '@/components/hospitals/hospital-quality-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Activity,
  Zap,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Car,
  Star,
  Users,
  Award,
  Globe,
  ExternalLink,
  Eye,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

// Icon mapping for facility categories
const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    EMERGENCY: Zap,
    DIAGNOSTIC: Activity,
    LABORATORY: Microscope,
    INTENSIVE_CARE: Users,
    OPERATING_ROOM: Stethoscope,
    PATIENT_ROOM: Building2,
    PHARMACY: ShieldCheck,
    PARKING: Car,
    CAFETERIA: Building2,
    ACCESSIBILITY: Users,
    OTHER: Building2,
  };
  return icons[category] || Building2;
};

function HospitalDetailContent() {
  const params = useParams();
  const hospitalId = params.id as string;

  const { data: hospital, isLoading } = useHospitalWithDoctors(hospitalId);

  if (isLoading) {
    return <HospitalDetailSkeleton />;
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <Building2 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Hospital Not Found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            The hospital you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/cms/hospitals">
              ← Back to Hospitals
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Transform doctor relationships data
  const doctors = hospital.doctor_relationships?.map((rel: any) => ({
    ...rel.doctor,
    ...rel, // Include relationship data like is_primary, position_title, department
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative pt-8 pb-4 px-6">
          <HospitalHeroSection hospital={hospital} />
        </div>

        {/* Main Content */}
        <div className="px-6 pb-12">
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-1">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="medical-team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Medical Team
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule & Hours
                </TabsTrigger>
                <TabsTrigger value="quality" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Quality & Metrics
                </TabsTrigger>
                <TabsTrigger value="facilities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Facilities
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Hospital Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Hospital Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {hospital.description && (
                        <p className="text-gray-700 leading-relaxed">{hospital.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{hospital.address}</p>
                              <p>{hospital.city}, {hospital.state} {hospital.zip_code}</p>
                            </div>
                          </div>
                          {hospital.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">
                                {hospital.phone}
                              </a>
                            </div>
                          )}
                          {hospital.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <a href={`mailto:${hospital.email}`} className="text-blue-600 hover:underline">
                                {hospital.email}
                              </a>
                            </div>
                          )}
                          {hospital.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a href={hospital.website} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:underline flex items-center gap-1">
                                Visit Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{hospital.bed_count || 0}</div>
                              <div className="text-sm text-blue-700">Total Beds</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{doctors.length}</div>
                              <div className="text-sm text-purple-700">Medical Staff</div>
                            </div>
                          </div>
                          
                          {hospital.rating && (
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                                <Star className="h-6 w-6 fill-current" />
                                {hospital.rating.toFixed(1)}
                              </div>
                              <div className="text-sm text-green-700">
                                Patient Rating {hospital.review_count ? `(${hospital.review_count} reviews)` : ''}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Media Gallery */}
                  {(hospital.images?.length > 0 || hospital.virtual_tour) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-purple-600" />
                          Media Gallery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {hospital.images && hospital.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {hospital.images.slice(0, 8).map((image: string, index: number) => (
                              <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                                <img src={image} alt={`${hospital.name} - ${index + 1}`} 
                                     className="w-full h-full object-cover hover:scale-105 transition-transform" />
                              </div>
                            ))}
                          </div>
                        )}
                        {hospital.virtual_tour && (
                          <Button variant="outline" asChild>
                            <a href={hospital.virtual_tour} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Virtual Tour
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <HospitalScheduleCard 
                    operatingHours={hospital.operating_hours}
                    emergencyServices={hospital.emergency_services}
                    traumaLevel={hospital.trauma_level}
                    isActive={hospital.is_active}
                    phoneNumber={hospital.phone}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Medical Team Tab */}
            <TabsContent value="medical-team" className="space-y-6">
              <HospitalMedicalTeam 
                hospitalId={hospitalId}
                hospitalName={hospital.name}
                doctors={doctors}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <HospitalScheduleCard 
                  operatingHours={hospital.operating_hours}
                  emergencyServices={hospital.emergency_services}
                  traumaLevel={hospital.trauma_level}
                  isActive={hospital.is_active}
                  phoneNumber={hospital.phone}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Department Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto" />
                      <p>Department-specific hours will be available once configured.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quality Tab */}
            <TabsContent value="quality" className="space-y-6">
              <HospitalQualityMetrics hospital={hospital} />
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Hospital Facilities ({hospital.facility_relationships?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hospital.facility_relationships && hospital.facility_relationships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hospital.facility_relationships.map((relationship: any) => {
                        const facility = relationship.facilities;
                        if (!facility) return null;
                        
                        const CategoryIcon = getCategoryIcon(facility.category);
                        
                        return (
                          <Card key={relationship.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <CategoryIcon className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{facility.name}</h4>
                                      {relationship.primary_hospital && (
                                        <Star className="h-4 w-4 text-yellow-500" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 capitalize">
                                      {facility.category.replace('_', ' ')}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Access Level</span>
                                    <Badge variant="outline" className="text-xs">
                                      {relationship.access_level.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Cost Share</span>
                                    <span className="text-sm font-medium">
                                      {relationship.cost_sharing_percentage}%
                                    </span>
                                  </div>
                                </div>

                                {facility.description && (
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {facility.description}
                                  </p>
                                )}

                                {relationship.notes && (
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600">{relationship.notes}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2 text-gray-900">No Facilities</h3>
                      <p className="text-gray-600">This hospital has no associated facilities configured.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function ViewHospitalPage() {
  return (
    <Suspense fallback={<HospitalDetailSkeleton />}>
      <HospitalDetailContent />
    </Suspense>
  );
}