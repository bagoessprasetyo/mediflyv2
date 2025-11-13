'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Building2, 
  Stethoscope, 
  Zap,
  Microscope,
  Car,
  ShieldCheck,
  Users
} from 'lucide-react';

interface FacilityStatsCardsProps {
  facilities: any[];
}

export function FacilityStatsCards({ facilities }: FacilityStatsCardsProps) {
  // Calculate statistics
  const totalFacilities = facilities?.length || 0;
  const availableFacilities = facilities?.filter(f => f.is_available)?.length || 0;
  const emergencyFacilities = facilities?.filter(f => f.category === 'EMERGENCY')?.length || 0;
  const diagnosticFacilities = facilities?.filter(f => f.category === 'DIAGNOSTIC')?.length || 0;

  const availabilityRate = totalFacilities > 0 ? (availableFacilities / totalFacilities) * 100 : 0;

  const stats = [
    {
      title: 'Total Facilities',
      value: totalFacilities,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Available',
      value: availableFacilities,
      icon: ShieldCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: `${availabilityRate.toFixed(1)}% available`,
    },
    {
      title: 'Emergency',
      value: emergencyFacilities,
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Diagnostic',
      value: diagnosticFacilities,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface FacilityCategoryBreakdownProps {
  facilities: any[];
}

export function FacilityCategoryBreakdown({ facilities }: FacilityCategoryBreakdownProps) {
  // Group facilities by category
  const categoryStats = facilities?.reduce((acc: Record<string, number>, facility) => {
    const category = facility.category || 'OTHER';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {}) || {};

  const categoryInfo: Record<string, { label: string; icon: any; color: string }> = {
    EMERGENCY: { label: 'Emergency', icon: Zap, color: 'bg-red-100 text-red-800' },
    DIAGNOSTIC: { label: 'Diagnostic', icon: Activity, color: 'bg-blue-100 text-blue-800' },
    LABORATORY: { label: 'Laboratory', icon: Microscope, color: 'bg-purple-100 text-purple-800' },
    INTENSIVE_CARE: { label: 'ICU', icon: Users, color: 'bg-yellow-100 text-yellow-800' },
    OPERATING_ROOM: { label: 'OR', icon: Stethoscope, color: 'bg-green-100 text-green-800' },
    PATIENT_ROOM: { label: 'Patient Rooms', icon: Building2, color: 'bg-indigo-100 text-indigo-800' },
    PHARMACY: { label: 'Pharmacy', icon: ShieldCheck, color: 'bg-pink-100 text-pink-800' },
    PARKING: { label: 'Parking', icon: Car, color: 'bg-gray-100 text-gray-800' },
    OTHER: { label: 'Other', icon: Building2, color: 'bg-slate-100 text-slate-800' },
  };

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Show top 8 categories

  if (sortedCategories.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No facilities data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Facility Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sortedCategories.map(([category, count]) => {
            const info = categoryInfo[category] || categoryInfo.OTHER;
            const IconComponent = info.icon;
            
            return (
              <div key={category} className="flex items-center gap-2 p-2 rounded-lg border">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{info.label}</p>
                  <p className="text-xs text-muted-foreground">{count} facilities</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}