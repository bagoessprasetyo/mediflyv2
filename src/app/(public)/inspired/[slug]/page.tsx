'use client';

import { use } from 'react';
import { useInspiredContentBySlug } from '@/lib/queries/inspired-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Eye, 
  Calendar, 
  Star, 
  Phone, 
  Globe, 
  ArrowLeft,
  Building,
  Users,
  Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// import { Metadata } from 'next'; // Commented out since generateMetadata was removed
import Script from 'next/script';

interface InspiredContentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function InspiredContentDetailPage({ params }: InspiredContentDetailPageProps) {
  const { slug } = use(params);
  const { data: content, isLoading, error } = useInspiredContentBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Loading Hero */}
        <div className="h-64 bg-gray-200 animate-pulse" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-2/3" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Content Not Found</h1>
          <p className="text-gray-500 mb-6">
            The content you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/inspired">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inspiration
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatLocation = () => {
    const parts = [];
    if (content.target_city) parts.push(content.target_city);
    if (content.target_country) {
      parts.push(content.target_country.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()));
    }
    return parts.join(', ') || 'Global';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate structured data
  const structuredData = () => {
    try {
      const { generateStructuredData } = require('@/lib/seo-utils');
      return generateStructuredData(content);
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData()),
        }}
      />
      
      <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {content.featured_image_url ? (
          <Image
            src={content.featured_image_url}
            alt={content.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10">
                  <Link href="/inspired">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inspiration
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {content.category && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 text-gray-900"
                  >
                    {content.category.name}
                  </Badge>
                )}
                
                {content.is_featured && (
                  <Badge className="bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
              
              {content.subtitle && (
                <p className="text-xl text-gray-200 mb-4">{content.subtitle}</p>
              )}
              
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{formatLocation()}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{content.view_count || 0} views</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published {formatDate(content.published_at || content.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Body */}
            <div className="lg:col-span-2 space-y-6">
              {content.excerpt && (
                <div className="text-lg text-gray-600 font-medium">
                  {content.excerpt}
                </div>
              )}
              
              {content.content && (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {content.content}
                  </div>
                </div>
              )}

              {/* Hospital List */}
              {content.hospitals && content.hospitals.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Featured Hospitals</h2>
                  
                  <div className="space-y-4">
                    {content.hospitals
                      .sort((a: any, b: any) => a.position - b.position)
                      .map((hospitalContent: any, index: number) => (
                      <HospitalCard 
                        key={hospitalContent.id} 
                        hospitalContent={hospitalContent}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Content Type</h4>
                    <p className="capitalize">{content.content_type.replace('_', ' ')}</p>
                  </div>
                  
                  {content.target_specialty && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Target Specialty</h4>
                      <p>{content.target_specialty}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Location Focus</h4>
                    <p>{formatLocation()}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Last Updated</h4>
                    <p>{formatDate(content.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Interested in Healthcare?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/search">
                      Find Treatments
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/inspired">
                      More Inspiration
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

interface HospitalCardProps {
  hospitalContent: any;
  index: number;
}

function HospitalCard({ hospitalContent, index }: HospitalCardProps) {
  const hospital = hospitalContent.hospital;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Ranking */}
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full text-xl font-bold flex-shrink-0">
            {hospitalContent.position}
          </div>
          
          {/* Hospital Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">
              {hospitalContent.custom_title || hospital?.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {hospital?.city}
              </span>
              
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {hospital?.type || 'Hospital'}
              </span>
              
              {hospital?.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {hospital.rating}
                </span>
              )}
            </div>
            
            {hospitalContent.highlight_text && (
              <Badge variant="secondary" className="mb-3">
                {hospitalContent.highlight_text}
              </Badge>
            )}
            
            {hospitalContent.description && (
              <p className="text-gray-700 mb-4">
                {hospitalContent.description}
              </p>
            )}
            
            {/* Metrics */}
            {(hospitalContent.rating_score || hospitalContent.patient_count || (hospitalContent.price_range_min && hospitalContent.price_range_max)) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {hospitalContent.rating_score && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Rating: {hospitalContent.rating_score}/5</span>
                  </div>
                )}
                
                {hospitalContent.patient_count && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{hospitalContent.patient_count.toLocaleString()} patients</span>
                  </div>
                )}
                
                {hospitalContent.price_range_min && hospitalContent.price_range_max && (
                  <div className="text-green-600 font-medium">
                    ${hospitalContent.price_range_min.toLocaleString()} - ${hospitalContent.price_range_max.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Note: generateMetadata removed because this is a client component
// If SEO is needed, convert this to a Server Component or create a separate metadata file
/*
async function generateMetadata({ params }: InspiredContentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { getInspiredContentBySlug } = await import('@/lib/server-queries');
    const { generateInspiredContentMetadata } = await import('@/lib/seo-utils');
    
    const content = await getInspiredContentBySlug(slug);
    return generateInspiredContentMetadata(content);
  } catch (error) {
    return {
      title: 'Content Not Found | MediFly',
      description: 'The content you are looking for could not be found.',
    };
  }
}
*/