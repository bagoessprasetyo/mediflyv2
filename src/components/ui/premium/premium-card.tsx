'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  hover?: 'none' | 'lift' | 'scale' | 'glow';
}

const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', size = 'md', hover = 'lift', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all duration-300 ease-out';
    
    const variantStyles = {
      default: 'shadow-sm',
      elevated: 'shadow-lg border-gray-100',
      subtle: 'shadow-sm border-gray-150 bg-gray-50/30',
      glass: 'bg-white/80 backdrop-blur-sm border-white/50 shadow-md'
    };

    const sizeStyles = {
      sm: 'padding-card-sm',
      md: 'padding-card', 
      lg: 'p-8 lg:p-12'
    };

    const hoverStyles = {
      none: '',
      lift: 'premium-hover-lift',
      scale: 'premium-hover-scale',
      glow: 'hover:shadow-2xl hover:border-medifly-teal/20 transition-all duration-200'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          hoverStyles[hover],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

export { PremiumCard };