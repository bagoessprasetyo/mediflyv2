'use client';

import { forwardRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { PremiumCard } from './premium-card';
import { cn } from '@/lib/utils';

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  treatment: string;
  avatar?: string;
  rating: number;
  quote: string;
  savings?: string;
  flag?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const TestimonialCard = forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ 
    name,
    location, 
    treatment,
    avatar,
    rating,
    quote,
    savings,
    flag,
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    const isFeatured = variant === 'featured';
    const isCompact = variant === 'compact';

    return (
      <PremiumCard
        ref={ref}
        variant={isFeatured ? 'elevated' : 'default'}
        size={isCompact ? 'sm' : 'md'}
        hover="lift"
        className={cn('group', className)}
        {...props}
      >
        <div className={cn(
          'space-content-sm',
          isFeatured ? 'text-center' : 'text-left'
        )}>
          {/* Quote Icon (only for featured) */}
          {isFeatured && (
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-medifly-teal/10 rounded-full flex items-center justify-center group-hover:bg-medifly-teal/20 transition-colors">
                <Quote className="h-6 w-6 text-medifly-teal" />
              </div>
            </div>
          )}

          {/* Quote */}
          <blockquote className={cn(
            'leading-relaxed text-gray-700 relative',
            isFeatured ? 'text-lg font-medium italic' : 'text-base',
            isCompact ? 'text-sm' : ''
          )}>
            {!isFeatured && (
              <Quote className="absolute -top-2 -left-1 h-4 w-4 text-medifly-teal/40" />
            )}
            <span className={!isFeatured ? 'ml-4' : ''}>
              "{quote}"
            </span>
          </blockquote>

          {/* Rating */}
          <div className={cn(
            'flex gap-1',
            isFeatured ? 'justify-center' : 'justify-start'
          )}>
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Patient Info */}
          <div className={cn(
            'flex gap-3',
            isFeatured ? 'justify-center items-center' : 'items-start'
          )}>
            <Avatar className={cn(
              'border-2 border-gray-100 group-hover:border-medifly-teal/30 transition-colors',
              isCompact ? 'h-10 w-10' : 'h-12 w-12'
            )}>
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-medifly-teal/10 text-medifly-teal font-semibold">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className={cn(
              'min-w-0',
              isFeatured ? 'text-center' : 'text-left'
            )}>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-semibold text-gray-900',
                  isCompact ? 'text-sm' : 'text-base'
                )}>
                  {name}
                </span>
                {flag && <span className="text-sm">{flag}</span>}
              </div>
              
              <div className={cn(
                'text-gray-600',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {location}
              </div>
            </div>
          </div>

          {/* Treatment and Savings */}
          <div className={cn(
            'flex gap-2 flex-wrap',
            isFeatured ? 'justify-center' : 'justify-start'
          )}>
            <Badge 
              variant="secondary" 
              className={cn(
                'bg-medifly-teal/10 text-medifly-teal border-medifly-teal/20 hover:bg-medifly-teal/20',
                isCompact ? 'text-xs px-2 py-0.5' : 'px-3 py-1'
              )}
            >
              {treatment}
            </Badge>
            
            {savings && (
              <Badge 
                variant="secondary"
                className={cn(
                  'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                  isCompact ? 'text-xs px-2 py-0.5' : 'px-3 py-1'
                )}
              >
                {savings}
              </Badge>
            )}
          </div>
        </div>
      </PremiumCard>
    );
  }
);

TestimonialCard.displayName = 'TestimonialCard';

export { TestimonialCard };