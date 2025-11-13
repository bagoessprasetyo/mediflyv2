'use client';

import { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Heart, Plane } from 'lucide-react';
import { PremiumCard } from './premium-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  country: string;
  description: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  specialties: string[];
  savings?: string;
  travelTime?: string;
  featured?: boolean;
  flag?: string;
}

const DestinationCard = forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ 
    name,
    country,
    description,
    image,
    rating = 5,
    reviewCount,
    specialties = [],
    savings,
    travelTime,
    featured = false,
    flag,
    className,
    ...props 
  }, ref) => {
    return (
      <PremiumCard
        ref={ref}
        variant={featured ? 'elevated' : 'default'}
        size="sm"
        hover="lift"
        className={cn('group overflow-hidden', className)}
        {...props}
      >
        {/* Image Section */}
        <div className="relative h-48 -mx-4 -mt-4 lg:-mx-6 lg:-mt-6 mb-6 overflow-hidden rounded-t-xl">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-medifly-teal/20 to-medifly-light-blue/30 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Plane className="h-8 w-8 text-medifly-teal mx-auto" />
                <span className="text-sm font-medium text-medifly-teal">{name}</span>
              </div>
            </div>
          )}
          
          {/* Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-500 text-white border-0 shadow-sm">
                ⭐ Featured
              </Badge>
            </div>
          )}

          {savings && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white border-0 shadow-sm">
                {savings}
              </Badge>
            </div>
          )}

          {/* Heart Icon */}
          <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group">
            <Heart className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight group-hover:text-medifly-teal transition-colors">
                {name}
              </h3>
              {flag && <span className="text-lg ml-2">{flag}</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{country}</span>
              {travelTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{travelTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            {reviewCount && (
              <span className="text-sm text-gray-500">
                ({reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
              >
                {specialty}
              </Badge>
            ))}
            {specialties.length > 3 && (
              <Badge 
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 border-gray-200"
              >
                +{specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </PremiumCard>
    );
  }
);

DestinationCard.displayName = 'DestinationCard';

export { DestinationCard };