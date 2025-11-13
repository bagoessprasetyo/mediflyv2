'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Edit,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  Users,
  Clock,
  MoreHorizontal,
  Zap,
  Heart,
  ShieldCheck,
  ExternalLink,
  Settings,
  TrendingUp,
  Eye,
  Award,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HospitalHeroProps {
  hospital: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    type: string;
    bed_count?: number;
    established?: string;
    emergency_services?: boolean;
    trauma_level?: string;
    logo?: string;
    rating?: number;
    review_count?: number;
    is_active?: boolean;
    is_verified?: boolean;
    is_featured?: boolean;
    facility_relationships?: any[];
    doctor_relationships?: any[];
  };
}

export function HospitalHeroSection({ hospital }: HospitalHeroProps) {
  const initials = hospital.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDoctorCount = () => hospital.doctor_relationships?.length || 0;
  const getFacilityCount = () => hospital.facility_relationships?.length || 0;

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-lg" />
      
      {/* Content overlay */}
      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Back button and breadcrumb */}
            <div className="absolute -top-16 left-0 flex items-center gap-2 text-white">
              <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/20">
                <Link href="/cms/hospitals">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-sm">← Back to Hospitals</span>
            </div>

            {/* Hospital Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-28 h-28 lg:w-36 lg:h-36 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={hospital.logo} 
                  alt={hospital.name}
                  className="object-contain bg-white p-2"
                />
                <AvatarFallback className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {hospital.is_verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Hospital Information */}
            <div className="flex-1 space-y-4 min-w-0">
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {hospital.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className="text-base px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    {hospital.type?.replace('_', ' ')}
                  </Badge>
                  
                  {hospital.is_active && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-sm">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                  
                  {hospital.is_verified && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 text-sm">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  
                  {hospital.is_featured && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-sm">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  {hospital.emergency_services && (
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-sm">
                      <Heart className="w-3 h-3 mr-1" />
                      Emergency Services
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {hospital.description && (
                  <p className="text-gray-600 leading-relaxed max-w-3xl">
                    {hospital.description}
                  </p>
                )}

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {hospital.bed_count || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Hospital Beds</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                      {hospital.rating ? (
                        <>
                          <Star className="h-5 w-5 fill-current" />
                          {hospital.rating.toFixed(1)}
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rating {hospital.review_count ? `(${hospital.review_count})` : ''}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {getDoctorCount()}
                    </div>
                    <div className="text-sm text-gray-500">Medical Staff</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {hospital.established || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Established</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{hospital.address}</p>
                    <p>{hospital.city}, {hospital.state} {hospital.zip_code}</p>
                    <p className="text-sm text-gray-500">{hospital.country}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-wrap items-center gap-6">
                  {hospital.phone && (
                    <a 
                      href={`tel:${hospital.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{hospital.phone}</span>
                    </a>
                  )}
                  
                  {hospital.email && (
                    <a 
                      href={`mailto:${hospital.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">{hospital.email}</span>
                    </a>
                  )}
                  
                  {hospital.website && (
                    <a 
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 min-w-fit lg:items-end">
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
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Public Page
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button asChild>
                  <Link href={`/cms/hospitals/${hospital.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Button className="w-full lg:w-auto" variant="default">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Tour
                </Button>
                
                <Button variant="outline" className="w-full lg:w-auto">
                  <Award className="mr-2 h-4 w-4" />
                  View Accreditations
                </Button>
                
                <Button variant="ghost" className="w-full lg:w-auto text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Admin
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}