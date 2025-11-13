'use client';

import { useFeaturedInspiredContent } from '@/lib/queries/inspired-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface GetInspiredSectionProps {
  limit?: number;
  showTitle?: boolean;
  showViewAllButton?: boolean;
}

export function GetInspiredSection({ 
  limit = 6, 
  showTitle = true, 
  showViewAllButton = true 
}: GetInspiredSectionProps) {
  const { data: featuredContent, isLoading } = useFeaturedInspiredContent(limit);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-medifly-beige">
        <div className="container mx-auto px-4">
          {showTitle && (
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-medifly-dark mb-6">
                Get Inspired: Popular Healthcare Journeys
              </h2>
              <p className="text-lg lg:text-xl text-medifly-gray max-w-3xl mx-auto">
                Explore trusted specialists and destinations for your health needs. 
                Discover treatments that have transformed lives worldwide.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-soft bg-white">
                <div className="h-48 bg-medifly-light-blue/20 animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-medifly-light-blue/30 animate-pulse rounded" />
                    <div className="h-4 bg-medifly-light-blue/20 animate-pulse rounded w-2/3" />
                  </div>
                  <div className="h-3 bg-medifly-light-blue/20 animate-pulse rounded w-1/2" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="h-5 bg-medifly-teal/30 animate-pulse rounded w-20" />
                      <div className="h-3 bg-medifly-light-blue/20 animate-pulse rounded w-24" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-medifly-light-blue/20 animate-pulse rounded w-16" />
                      <div className="h-3 bg-medifly-light-blue/20 animate-pulse rounded w-20" />
                    </div>
                  </div>
                  <div className="h-8 bg-medifly-light-blue/20 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredContent || featuredContent.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-medifly-beige">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-medifly-dark mb-6">
              Get Inspired: Popular Healthcare Journeys
            </h2>
            <p className="text-lg lg:text-xl text-medifly-gray max-w-3xl mx-auto">
              Explore trusted specialists and destinations for your health needs. 
              Discover treatments that have transformed lives worldwide.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredContent.map((content) => (
            <InspiredContentCard key={content.id} content={content} />
          ))}
        </div>

        {showViewAllButton && (
          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg"
              className="gradient-teal text-white shadow-soft hover:shadow-lifted"
            >
              <Link href="/inspired">
                View All Healthcare Journeys
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

interface InspiredContentCardProps {
  content: any;
}

function InspiredContentCard({ content }: InspiredContentCardProps) {
  const formatLocation = () => {
    const parts = [];
    if (content.target_city) parts.push(content.target_city);
    if (content.target_country) {
      parts.push(content.target_country.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()));
    }
    return parts.join(', ') || 'Global';
  };

  return (
    <Card className="group overflow-hidden hover-scale cursor-pointer border-0 shadow-soft bg-white">
      <Link href={`/inspired/${content.slug}`}>
        <div className="relative h-48 overflow-hidden">
          {content.featured_image_url ? (
            <Image
              src={content.featured_image_url}
              alt={content.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-medifly-light-blue/30 to-medifly-teal/30 flex items-center justify-center">
              <div className="text-4xl font-bold text-medifly-teal/60">
                {content.title.charAt(0)}
              </div>
            </div>
          )}
          
          {/* Category badge */}
          {content.category && (
            <div className="absolute top-3 left-3">
              <Badge 
                className="bg-medifly-teal text-white border-0 shadow-soft"
              >
                {content.category.name}
              </Badge>
            </div>
          )}

          {/* Trending/Popular badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white border-0 shadow-soft">
              Popular
            </Badge>
          </div>

          {/* View count */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              <Eye className="h-3 w-3" />
              {content.view_count || 0}
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 group-hover:text-medifly-teal transition-colors text-medifly-dark">
            {content.title}
          </CardTitle>
          
          {content.subtitle && (
            <CardDescription className="line-clamp-1 text-medifly-gray">
              {content.subtitle}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {content.excerpt && (
            <p className="text-sm text-medifly-gray line-clamp-2">
              {content.excerpt}
            </p>
          )}

          {/* Pricing and rating simulation */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-medifly-teal">
                From $1,200
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-medifly-gray">4.8★ (156 reviews)</span>
              </div>
            </div>
            <div className="text-xs text-medifly-gray text-right">
              <div>15+ Specialists</div>
              <div className="flex items-center gap-1 justify-end">
                <MapPin className="h-3 w-3" />
                <span>{formatLocation()}</span>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-medifly-teal group-hover:text-white group-hover:border-medifly-teal transition-all"
          >
            Explore Options
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}

// Compact version for sidebar or smaller spaces
export function GetInspiredCompact({ limit = 3 }: { limit?: number }) {
  const { data: featuredContent, isLoading } = useFeaturedInspiredContent(limit);

  if (isLoading || !featuredContent?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Get Inspired</h3>
      <div className="space-y-2">
        {featuredContent.map((content) => (
          <Link 
            key={content.id} 
            href={`/inspired/${content.slug}`}
            className="block p-3 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <h4 className="font-medium text-sm line-clamp-2 mb-1">
              {content.title}
            </h4>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {content.target_country?.replace('_', ' ') || 'Global'}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {content.view_count || 0}
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <Button asChild variant="outline" size="sm" className="w-full">
        <Link href="/inspired">
          View All
        </Link>
      </Button>
    </div>
  );
}