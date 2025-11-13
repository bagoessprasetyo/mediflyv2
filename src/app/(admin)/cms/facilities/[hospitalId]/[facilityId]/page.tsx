'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useFacility, useHospitalFacilities } from '@/lib/queries/facilities';
import { FacilityDetailSkeleton } from '@/components/skeletons/facility-detail-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Users, 
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  MoreHorizontal,
  Star,
  Zap,
  Stethoscope,
  Microscope,
  Car,
  ShieldCheck
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

function FacilityDetailContent() {
  const params = useParams();
  const hospitalId = params.hospitalId as string;
  const id = params.facilityId as string;

  const { data: facility, isLoading } = useFacility(id);
  const { data: relatedFacilities } = useHospitalFacilities(hospitalId);

  if (isLoading) {
    return <FacilityDetailSkeleton />;
  }

  if (!facility) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Facility not found</h3>
        <p className="text-muted-foreground">
          The facility you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(facility.category);
  const otherFacilities = relatedFacilities?.filter(f => f.id !== id) || [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cms/facilities">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CategoryIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{facility.name}</h1>
                  <p className="text-muted-foreground">{facility.hospitals?.[0]?.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Activity className="mr-2 h-4 w-4" />
                    View Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button asChild>
                <Link href={`/cms/facilities/${hospitalId}/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/cms/facilities">Facilities</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/cms/hospitals/${hospitalId}`}>
                  {facility.hospitals?.[0]?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{facility.name}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Facility Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">
                            {facility.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">
                          {facility.capacity ? `${facility.capacity} units` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Availability Status</p>
                        <div className="flex items-center gap-2">
                          {facility.is_available ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Available
                              </Badge>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <Badge variant="destructive">
                                Unavailable
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {facility.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-sm leading-relaxed">{facility.description}</p>
                      </div>
                    </>
                  )}
                  
                  {facility.icon && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Display Icon</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{facility.icon}</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {facility.icon}
                          </code>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Associated Hospitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Associated Hospitals ({facility.hospitals?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {facility.hospitals && facility.hospitals.length > 0 ? (
                    facility.hospitals.map((hospital, index) => (
                      <div key={hospital.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{hospital.name}</h3>
                              {hospital.relationship.primary_hospital && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Primary
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {hospital.relationship.access_level.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {hospital.city}, {hospital.state}
                            </p>
                            {hospital.type && (
                              <Badge variant="outline" className="mt-2">
                                {hospital.type.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {hospital.relationship.cost_sharing_percentage}% Cost Share
                            </div>
                            {hospital.relationship.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {hospital.relationship.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {hospital.relationship.primary_hospital && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Emergency Services</p>
                              <p className="font-medium">
                                {hospital.emergency_services ? 'Available' : 'Not available'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Contact</p>
                              <p className="font-medium">
                                {hospital.phone || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-2" />
                      <p>No associated hospitals</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                      <p className="text-sm text-muted-foreground">Utilization Rate</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-600">24/7</p>
                      <p className="text-sm text-muted-foreground">Operating Hours</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-purple-600">A+</p>
                      <p className="text-sm text-muted-foreground">Service Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href={`/cms/facilities/${hospitalId}/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Facility
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Maintenance
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Booking Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Operational</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Maintenance</span>
                      <span className="text-sm font-medium">Up to date</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Certification</span>
                      <span className="text-sm font-medium">Valid</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Facilities */}
              {otherFacilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Related Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {otherFacilities.slice(0, 3).map((relatedFacility) => {
                      const RelatedIcon = getCategoryIcon(relatedFacility.category);
                      return (
                        <Link
                          key={relatedFacility.id}
                          href={`/cms/facilities/${hospitalId}/${relatedFacility.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <RelatedIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {relatedFacility.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {relatedFacility.category.replace('_', ' ')}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                    
                    {otherFacilities.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/cms/facilities?hospital=${hospitalId}`}>
                          View all {otherFacilities.length} facilities
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FacilityViewPage() {
  return (
    <Suspense fallback={<FacilityDetailSkeleton />}>
      <FacilityDetailContent />
    </Suspense>
  );
}
