'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  IconStethoscope,
  IconCertificate,
  IconStar,
  IconTrendingUp,
  IconMedicalCross,
  IconBrain,
  IconHeart,
  IconEye,
  IconBone,
  IconActivity
} from '@tabler/icons-react';

interface SpecialtyBadgesProps {
  specialties: Array<{
    id: string;
    is_primary: boolean;
    years_in_specialty?: number;
    board_certified?: boolean;
    certification_date?: string | Date;
    specialty: {
      id: string;
      name: string;
      category?: string;
      color_code?: string;
      requires_certification?: boolean;
    };
  }>;
}

interface SpecialtyCardProps {
  specialty: SpecialtyBadgesProps['specialties'][0];
  maxYears: number;
}

function SpecialtyCard({ specialty, maxYears }: SpecialtyCardProps) {
  const { is_primary, years_in_specialty, board_certified, certification_date, specialty: spec } = specialty;
  
  const getSpecialtyIcon = (name: string, category?: string) => {
    const lowerName = name.toLowerCase();
    const lowerCategory = category?.toLowerCase() || '';

    // Heart-related
    if (lowerName.includes('cardio') || lowerName.includes('heart')) {
      return <IconHeart className="w-4 h-4" />;
    }
    // Brain/Neuro-related
    if (lowerName.includes('neuro') || lowerName.includes('brain') || lowerName.includes('psychiatry')) {
      return <IconBrain className="w-4 h-4" />;
    }
    // Eye-related
    if (lowerName.includes('ophthal') || lowerName.includes('eye')) {
      return <IconEye className="w-4 h-4" />;
    }
    // Bone/Orthopedic
    if (lowerName.includes('orthop') || lowerName.includes('bone') || lowerName.includes('joint')) {
      return <IconBone className="w-4 h-4" />;
    }
    // Surgical
    if (lowerCategory.includes('surgical') || lowerName.includes('surgery')) {
      return <IconMedicalCross className="w-4 h-4" />;
    }
    // Emergency
    if (lowerName.includes('emergency') || lowerName.includes('trauma')) {
      return <IconActivity className="w-4 h-4" />;
    }
    // Default
    return <IconStethoscope className="w-4 h-4" />;
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toUpperCase()) {
      case 'MEDICAL':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800/20 dark:text-blue-300';
      case 'SURGICAL':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800/20 dark:text-red-300';
      case 'DIAGNOSTIC':
        return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800/20 dark:text-purple-300';
      case 'EMERGENCY':
        return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800/20 dark:text-orange-300';
      case 'THERAPEUTIC':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800/20 dark:text-green-300';
      case 'PEDIATRIC':
        return 'bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-950/20 dark:border-pink-800/20 dark:text-pink-300';
      case 'MENTAL_HEALTH':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-800/20 dark:text-indigo-300';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-950/20 dark:border-gray-800/20 dark:text-gray-300';
    }
  };

  const formatCertificationDate = (date?: string | Date) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  };

  const getExperienceLevel = (years?: number) => {
    if (!years) return { level: 'New', color: 'text-gray-500' };
    if (years < 5) return { level: 'Developing', color: 'text-blue-600' };
    if (years < 10) return { level: 'Experienced', color: 'text-green-600' };
    if (years < 20) return { level: 'Senior', color: 'text-purple-600' };
    return { level: 'Expert', color: 'text-orange-600' };
  };

  const experienceLevel = getExperienceLevel(years_in_specialty);
  const experienceProgress = maxYears > 0 ? ((years_in_specialty || 0) / maxYears) * 100 : 0;

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
      is_primary 
        ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
        : getCategoryColor(spec.category)
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

      <div className="space-y-3">
        {/* Specialty Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className={`p-2 rounded-lg ${
              is_primary ? 'bg-primary/10 text-primary' : 'bg-current/10'
            }`}>
              {getSpecialtyIcon(spec.name, spec.category)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-tight">
                {spec.name}
              </h4>
              {spec.category && (
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {spec.category.toLowerCase().replace('_', ' ')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Certification Status */}
        <div className="flex flex-wrap gap-2">
          {board_certified ? (
            <Badge variant="default" className="text-xs bg-green-600">
              <IconCertificate className="w-3 h-3 mr-1" />
              Board Certified
            </Badge>
          ) : spec.requires_certification ? (
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
              <IconCertificate className="w-3 h-3 mr-1" />
              Certification Required
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              No Certification Required
            </Badge>
          )}

          {certification_date && (
            <Badge variant="outline" className="text-xs">
              Since {formatCertificationDate(certification_date)}
            </Badge>
          )}
        </div>

        {/* Experience Information */}
        {years_in_specialty && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Experience</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${experienceLevel.color}`}>
                  {experienceLevel.level}
                </span>
                <span className="text-muted-foreground">
                  {years_in_specialty} {years_in_specialty === 1 ? 'year' : 'years'}
                </span>
              </div>
            </div>
            
            {maxYears > 0 && (
              <div className="space-y-1">
                <Progress 
                  value={experienceProgress} 
                  className="h-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{maxYears}+ years</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SpecialtyBadges({ specialties }: SpecialtyBadgesProps) {
  if (!specialties || specialties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStethoscope className="w-5 h-5" />
            Medical Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <IconStethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No specialties found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort specialties: primary first, then by certification status, then by experience
  const sortedSpecialties = [...specialties].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    if (a.board_certified && !b.board_certified) return -1;
    if (!a.board_certified && b.board_certified) return 1;
    return (b.years_in_specialty || 0) - (a.years_in_specialty || 0);
  });

  const certifiedCount = specialties.filter(s => s.board_certified).length;
  const primarySpecialty = specialties.find(s => s.is_primary);
  const maxYears = Math.max(...specialties.map(s => s.years_in_specialty || 0));

  // Group specialties by category for better organization
  const specialtiesByCategory = sortedSpecialties.reduce((acc, specialty) => {
    const category = specialty.specialty.category || 'OTHER';
    if (!acc[category]) acc[category] = [];
    acc[category].push(specialty);
    return acc;
  }, {} as Record<string, typeof specialties>);

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconStethoscope className="w-5 h-5" />
              Medical Specialties
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {specialties.length} {specialties.length === 1 ? 'Specialty' : 'Specialties'}
              </Badge>
              {certifiedCount > 0 && (
                <Badge variant="default" className="text-xs bg-green-600">
                  {certifiedCount} Certified
                </Badge>
              )}
            </div>
          </div>
          
          {primarySpecialty && (
            <p className="text-sm text-muted-foreground">
              Primary: <span className="font-medium">{primarySpecialty.specialty.name}</span>
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(specialtiesByCategory).map(([category, categorySpecialties]) => (
            <div key={category} className="space-y-3">
              {Object.keys(specialtiesByCategory).length > 1 && (
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {category.replace('_', ' ')}
                  </h4>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
              )}
              <div className="grid gap-3">
                {categorySpecialties.map((specialty) => (
                  <SpecialtyCard 
                    key={specialty.id} 
                    specialty={specialty} 
                    maxYears={maxYears}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}