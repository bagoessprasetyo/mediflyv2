'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  Star,
  ShieldCheck,
  TrendingUp,
  Users,
  Heart,
  Building2,
  FileText,
  Target,
  CheckCircle2,
  Trophy,
  Medal,
  Zap,
  Activity,
  BarChart3,
  Gauge
} from 'lucide-react';

interface QualityMetric {
  name: string;
  value: number;
  maxValue: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  category: 'safety' | 'quality' | 'patient' | 'efficiency';
}

interface Accreditation {
  name: string;
  organization: string;
  status: 'active' | 'pending' | 'expired';
  issued: string;
  expires?: string;
  level?: string;
}

interface HospitalQualityMetricsProps {
  hospital: {
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
    emergency_services?: boolean;
    trauma_level?: string;
    type: string;
    bed_count?: number;
    established?: string;
  };
  metrics?: QualityMetric[];
  accreditations?: Accreditation[];
}

// Sample metrics for demonstration
const defaultMetrics: QualityMetric[] = [
  { name: 'Patient Satisfaction', value: 4.7, maxValue: 5, unit: '/5', trend: 'up', category: 'patient' },
  { name: 'Safety Rating', value: 5, maxValue: 5, unit: 'stars', trend: 'stable', category: 'safety' },
  { name: 'Readmission Rate', value: 8.2, maxValue: 15, unit: '%', trend: 'down', category: 'quality' },
  { name: 'Wait Time', value: 22, maxValue: 45, unit: 'min', trend: 'down', category: 'efficiency' },
  { name: 'Infection Rate', value: 0.8, maxValue: 3, unit: '%', trend: 'down', category: 'safety' },
  { name: 'Staff Ratio', value: 1.8, maxValue: 2, unit: ':1', trend: 'up', category: 'quality' },
];

// Sample accreditations
const defaultAccreditations: Accreditation[] = [
  { 
    name: 'Joint Commission Accreditation', 
    organization: 'The Joint Commission', 
    status: 'active',
    issued: '2023-01-15',
    expires: '2026-01-15'
  },
  { 
    name: 'Magnet Recognition', 
    organization: 'ANCC', 
    status: 'active',
    issued: '2022-06-01',
    expires: '2026-06-01',
    level: 'Gold'
  },
  { 
    name: 'Level I Trauma Center', 
    organization: 'ACS', 
    status: 'active',
    issued: '2021-03-10'
  },
  { 
    name: 'CMS 5-Star Rating', 
    organization: 'CMS', 
    status: 'active',
    issued: '2024-01-01',
    expires: '2024-12-31',
    level: '5 Stars'
  },
];

function MetricCard({ metric }: { metric: QualityMetric }) {
  const percentage = (metric.value / metric.maxValue) * 100;
  
  const getCategoryIcon = () => {
    switch (metric.category) {
      case 'safety': return ShieldCheck;
      case 'quality': return Award;
      case 'patient': return Heart;
      case 'efficiency': return Activity;
      default: return Target;
    }
  };

  const getCategoryColor = () => {
    switch (metric.category) {
      case 'safety': return 'text-green-600 bg-green-50';
      case 'quality': return 'text-blue-600 bg-blue-50';
      case 'patient': return 'text-red-600 bg-red-50';
      case 'efficiency': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    if (metric.trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (metric.trend === 'down') return <Activity className="h-4 w-4 text-red-600 rotate-180" />;
    return <BarChart3 className="h-4 w-4 text-gray-600" />;
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${getCategoryColor()}`}>
              <CategoryIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
            </div>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {metric.value}{metric.unit}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {metric.name}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <Progress 
              value={percentage} 
              className={`h-2 ${percentage > 80 ? 'bg-green-100' : percentage > 60 ? 'bg-yellow-100' : 'bg-red-100'}`}
            />
            <div className="text-xs text-gray-500">
              Target: {metric.maxValue}{metric.unit}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccreditationBadge({ accreditation }: { accreditation: Accreditation }) {
  const getStatusColor = () => {
    switch (accreditation.status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (accreditation.status) {
      case 'active': return <CheckCircle2 className="h-3 w-3" />;
      case 'pending': return <Activity className="h-3 w-3" />;
      case 'expired': return <Zap className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-gray-900">{accreditation.name}</h4>
          <p className="text-sm text-gray-600">{accreditation.organization}</p>
        </div>
        <Badge variant="outline" className={`${getStatusColor()} text-xs`}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{accreditation.status}</span>
        </Badge>
      </div>

      {accreditation.level && (
        <div className="flex items-center gap-2">
          <Medal className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">{accreditation.level}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>Issued: {new Date(accreditation.issued).toLocaleDateString()}</p>
        {accreditation.expires && (
          <p>Expires: {new Date(accreditation.expires).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}

export function HospitalQualityMetrics({ 
  hospital, 
  metrics = defaultMetrics, 
  accreditations = defaultAccreditations 
}: HospitalQualityMetricsProps) {
  
  // Calculate overall quality score
  const calculateQualityScore = () => {
    const totalMetrics = metrics.length;
    const scoreSum = metrics.reduce((sum, metric) => {
      const percentage = (metric.value / metric.maxValue) * 100;
      return sum + percentage;
    }, 0);
    return Math.round(scoreSum / totalMetrics);
  };

  const qualityScore = calculateQualityScore();
  const activeAccreditations = accreditations.filter(acc => acc.status === 'active');

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Quality Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="space-y-2">
                <Gauge className="h-8 w-8 text-blue-600 mx-auto" />
                <div className="text-3xl font-bold text-blue-900">{qualityScore}</div>
                <div className="text-sm text-blue-700">Overall Quality Score</div>
                <Progress value={qualityScore} className="h-2" />
              </div>
            </div>

            {/* Rating */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="space-y-2">
                <Star className="h-8 w-8 text-green-600 mx-auto" />
                <div className="text-3xl font-bold text-green-900 flex items-center justify-center gap-1">
                  {hospital.rating ? (
                    <>
                      {hospital.rating.toFixed(1)}
                      <Star className="h-6 w-6 fill-current" />
                    </>
                  ) : 'N/A'}
                </div>
                <div className="text-sm text-green-700">
                  Patient Rating {hospital.review_count ? `(${hospital.review_count} reviews)` : ''}
                </div>
              </div>
            </div>

            {/* Accreditations */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="space-y-2">
                <Award className="h-8 w-8 text-purple-600 mx-auto" />
                <div className="text-3xl font-bold text-purple-900">{activeAccreditations.length}</div>
                <div className="text-sm text-purple-700">Active Accreditations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accreditations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Accreditations & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accreditations.map((accreditation, index) => (
              <AccreditationBadge key={index} accreditation={accreditation} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Hospital Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hospital.emergency_services && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <Zap className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">Emergency Services</span>
              </div>
            )}
            
            {hospital.trauma_level && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Heart className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Trauma {hospital.trauma_level}</span>
              </div>
            )}
            
            {hospital.type === 'TEACHING' && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Teaching Hospital</span>
              </div>
            )}
            
            {hospital.is_verified && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Verified</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}