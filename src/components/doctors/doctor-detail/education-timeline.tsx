'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconSchool,
  IconCertificate,
  IconTrophy,
  IconCalendar,
  IconMapPin,
  IconStar,
  IconBooks,
  IconStethoscope
} from '@tabler/icons-react';

interface EducationTimelineProps {
  education: Array<{
    degree: string;
    school: string;
    year: number;
    location?: string;
    gpa?: string;
    honors?: string;
    description?: string;
  }>;
}

interface EducationItemProps {
  item: EducationTimelineProps['education'][0];
  isLast: boolean;
}

function EducationItem({ item, isLast }: EducationItemProps) {
  const { degree, school, year, location, gpa, honors, description } = item;
  
  const getDegreeIcon = (degree: string) => {
    const lowerDegree = degree.toLowerCase();
    
    if (lowerDegree.includes('md') || lowerDegree.includes('doctor of medicine')) {
      return <IconCertificate className="w-4 h-4" />;
    }
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return <IconTrophy className="w-4 h-4" />;
    }
    if (lowerDegree.includes('residency') || lowerDegree.includes('internship')) {
      return <IconStethoscope className="w-4 h-4" />;
    }
    if (lowerDegree.includes('fellowship')) {
      return <IconStar className="w-4 h-4" />;
    }
    if (lowerDegree.includes('bachelor') || lowerDegree.includes('bs') || lowerDegree.includes('ba')) {
      return <IconBooks className="w-4 h-4" />;
    }
    if (lowerDegree.includes('master') || lowerDegree.includes('ms') || lowerDegree.includes('ma')) {
      return <IconSchool className="w-4 h-4" />;
    }
    
    return <IconBooks className="w-4 h-4" />;
  };

  const getDegreeColor = (degree: string) => {
    const lowerDegree = degree.toLowerCase();
    
    if (lowerDegree.includes('md') || lowerDegree.includes('doctor of medicine')) {
      return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/20';
    }
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/20';
    }
    if (lowerDegree.includes('residency') || lowerDegree.includes('internship')) {
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/20';
    }
    if (lowerDegree.includes('fellowship')) {
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/20';
    }
    if (lowerDegree.includes('bachelor')) {
      return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/20';
    }
    if (lowerDegree.includes('master')) {
      return 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800/20';
    }
    
    return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800/20';
  };

  const getEducationLevel = (degree: string) => {
    const lowerDegree = degree.toLowerCase();
    
    if (lowerDegree.includes('fellowship')) return 'Fellowship';
    if (lowerDegree.includes('residency')) return 'Residency';
    if (lowerDegree.includes('internship')) return 'Internship';
    if (lowerDegree.includes('md') || lowerDegree.includes('doctor')) return 'Medical Degree';
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) return 'Doctorate';
    if (lowerDegree.includes('master')) return 'Master\'s';
    if (lowerDegree.includes('bachelor')) return 'Bachelor\'s';
    
    return 'Education';
  };

  return (
    <div className="relative flex gap-4 group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${getDegreeColor(degree).split(' ')[0]} bg-current`} />
        {!isLast && (
          <div className="w-px h-16 bg-gradient-to-b from-border to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 pb-6">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-foreground leading-tight">
                {degree}
              </h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconSchool className="w-4 h-4" />
                <span className="font-medium">{school}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={`text-xs ${getDegreeColor(degree)}`}>
                {getDegreeIcon(degree)}
                <span className="ml-1">{getEducationLevel(degree)}</span>
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconCalendar className="w-3 h-3" />
                <span>{year}</span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <IconMapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
            
            {/* Honors and GPA */}
            {(honors || gpa) && (
              <div className="flex flex-wrap gap-2">
                {honors && (
                  <Badge variant="secondary" className="text-xs">
                    <IconTrophy className="w-3 h-3 mr-1" />
                    {honors}
                  </Badge>
                )}
                {gpa && (
                  <Badge variant="outline" className="text-xs">
                    GPA: {gpa}
                  </Badge>
                )}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export function EducationTimeline({ education }: EducationTimelineProps) {
  if (!education || education.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBooks className="w-5 h-5" />
            Education & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <IconBooks className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No education information available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Parse education if it's a JSON string, otherwise use as-is
  let parsedEducation = education;
  if (typeof education === 'string') {
    try {
      parsedEducation = JSON.parse(education);
    } catch (error) {
      console.error('Error parsing education JSON:', error);
      parsedEducation = [];
    }
  }

  // Sort education by year (most recent first)
  const sortedEducation = [...parsedEducation].sort((a, b) => b.year - a.year);
  
  // Calculate stats
  const totalYearsEducation = Math.max(...sortedEducation.map(e => e.year)) - Math.min(...sortedEducation.map(e => e.year)) + 1;
  const degreeCount = sortedEducation.length;
  const hasAdvancedDegree = sortedEducation.some(e => 
    e.degree.toLowerCase().includes('md') || 
    e.degree.toLowerCase().includes('phd') || 
    e.degree.toLowerCase().includes('doctorate')
  );
  const hasSpecialtyTraining = sortedEducation.some(e => 
    e.degree.toLowerCase().includes('fellowship') || 
    e.degree.toLowerCase().includes('residency')
  );

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconBooks className="w-5 h-5" />
              Education & Training
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {degreeCount} {degreeCount === 1 ? 'Degree' : 'Degrees'}
              </Badge>
              {hasAdvancedDegree && (
                <Badge variant="default" className="text-xs bg-blue-600">
                  Advanced Degree
                </Badge>
              )}
              {hasSpecialtyTraining && (
                <Badge variant="default" className="text-xs bg-green-600">
                  Specialty Training
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {totalYearsEducation > 1 && (
              <span>{totalYearsEducation} years of education and training</span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="space-y-0">
          {sortedEducation.map((item, index) => (
            <EducationItem 
              key={`${item.school}-${item.year}-${index}`}
              item={item}
              isLast={index === sortedEducation.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}