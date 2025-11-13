'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  IconBuilding,
  IconMapPin,
  IconStar,
  IconCalendar,
  IconUsers,
  IconPhone,
  IconStethoscope,
  IconBuildingHospital,
  IconCertificate
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface HospitalAffiliationsProps {
  affiliations: Array<{
    id: string;
    is_primary: boolean;
    position_title?: string;
    department?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    is_active: boolean;
    hospital: {
      id: string;
      name: string;
      city?: string;
      state?: string;
      type?: string;
      rating?: number;
      emergency_services?: boolean;
    };
  }>;
}

interface HospitalCardProps {
  affiliation: HospitalAffiliationsProps['affiliations'][0];
}

function HospitalCard({ affiliation }: HospitalCardProps) {
  const { hospital, is_primary, position_title, department, start_date, end_date, is_active } = affiliation;
  const hospitalInitials = hospital.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2);
  
  const getHospitalTypeIcon = (type?: string) => {
    switch (type?.toUpperCase()) {
      case 'GENERAL':
        return <IconBuildingHospital className="w-4 h-4" />;
      case 'SPECIALTY':
        return <IconStethoscope className="w-4 h-4" />;
      case 'TEACHING':
        return <IconUsers className="w-4 h-4" />;
      case 'CHILDRENS':
        return <IconUsers className="w-4 h-4" />;
      default:
        return <IconBuilding className="w-4 h-4" />;
    }
  };

  const getHospitalTypeColor = (type?: string) => {
    switch (type?.toUpperCase()) {
      case 'GENERAL':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'SPECIALTY':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'TEACHING':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'CHILDRENS':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const calculateTenure = () => {
    if (!start_date) return null;
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();
    return formatDistanceToNow(startDate, { addSuffix: false });
  };

  return (
    <div className={`relative p-4 border rounded-lg transition-all hover:shadow-md ${
      is_primary 
        ? 'border-primary/20 bg-primary/5 ring-1 ring-primary/10' 
        : 'border-border hover:border-border/80'
    }`}>
      {/* Primary Badge */}
      {is_primary && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="default" className="text-xs">
            <IconStar className="w-3 h-3 mr-1" />
            Primary
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Hospital Avatar */}
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarFallback className={`text-sm font-semibold ${getHospitalTypeColor(hospital.type)}`}>
              {hospitalInitials}
            </AvatarFallback>
          </Avatar>
          {hospital.emergency_services && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          )}
        </div>

        {/* Hospital Details */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-foreground leading-tight">
                {hospital.name}
              </h4>
              {!is_active && (
                <Badge variant="outline" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            
            {/* Location */}
            {(hospital.city || hospital.state) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <IconMapPin className="w-3 h-3" />
                <span>
                  {hospital.city}{hospital.city && hospital.state && ', '}{hospital.state}
                </span>
              </div>
            )}

            {/* Position & Department */}
            {(position_title || department) && (
              <div className="space-y-1">
                {position_title && (
                  <div className="font-medium text-sm text-foreground">
                    {position_title}
                  </div>
                )}
                {department && (
                  <div className="text-sm text-muted-foreground">
                    {department} Department
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            {/* Hospital Type Badge */}
            {hospital.type && (
              <Badge variant="outline" className={`text-xs ${getHospitalTypeColor(hospital.type)}`}>
                {getHospitalTypeIcon(hospital.type)}
                <span className="ml-1 capitalize">
                  {hospital.type.toLowerCase().replace('_', ' ')}
                </span>
              </Badge>
            )}

            {/* Rating Badge */}
            {hospital.rating && (
              <Badge variant="outline" className="text-xs">
                <IconStar className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {hospital.rating.toFixed(1)}
              </Badge>
            )}

            {/* Emergency Services */}
            {hospital.emergency_services && (
              <Badge variant="outline" className="text-xs text-red-600">
                Emergency Services
              </Badge>
            )}
          </div>

          {/* Timeline */}
          {(start_date || calculateTenure()) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {start_date && (
                <div className="flex items-center gap-1">
                  <IconCalendar className="w-3 h-3" />
                  <span>
                    {formatDate(start_date)}
                    {end_date ? ` - ${formatDate(end_date)}` : ' - Present'}
                  </span>
                </div>
              )}
              {calculateTenure() && (
                <div className="flex items-center gap-1">
                  <IconCertificate className="w-3 h-3" />
                  <span>{calculateTenure()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HospitalAffiliations({ affiliations }: HospitalAffiliationsProps) {
  if (!affiliations || affiliations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Hospital Affiliations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <IconBuilding className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hospital affiliations found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort affiliations: primary first, then by activity status, then by start date
  const sortedAffiliations = [...affiliations].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    
    // Sort by start date (most recent first)
    if (a.start_date && b.start_date) {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    }
    return 0;
  });

  const activeCount = affiliations.filter(a => a.is_active).length;
  const primaryHospital = affiliations.find(a => a.is_primary);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Hospital Affiliations
            <Badge variant="secondary" className="ml-2">
              {activeCount} Active
            </Badge>
          </CardTitle>
          {primaryHospital && (
            <Badge variant="outline" className="text-xs">
              Primary: {primaryHospital.hospital.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAffiliations.map((affiliation) => (
          <HospitalCard key={affiliation.id} affiliation={affiliation} />
        ))}
      </CardContent>
    </Card>
  );
}