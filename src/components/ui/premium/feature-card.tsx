'use client';

import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { PremiumCard } from './premium-card';
import { cn } from '@/lib/utils';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
  variant?: 'default' | 'minimal' | 'highlighted';
  alignment?: 'center' | 'left';
  iconColor?: string;
  iconBgColor?: string;
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ 
    icon: Icon, 
    title, 
    description, 
    stat,
    variant = 'default',
    alignment = 'center',
    iconColor = 'text-medifly-teal',
    iconBgColor = 'bg-medifly-teal/10',
    className,
    ...props 
  }, ref) => {
    const contentAlignment = alignment === 'center' ? 'text-center' : 'text-left';
    const iconAlignment = alignment === 'center' ? 'mx-auto' : '';

    return (
      <PremiumCard
        ref={ref}
        variant={variant === 'highlighted' ? 'elevated' : 'default'}
        hover={variant === 'minimal' ? 'scale' : 'lift'}
        className={cn('group', className)}
        {...props}
      >
        <div className={cn('space-content-sm', contentAlignment)}>
          {/* Icon */}
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
            iconBgColor,
            iconAlignment,
            'group-hover:scale-110'
          )}>
            <Icon className={cn('h-8 w-8 transition-colors', iconColor)} />
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            {stat && (
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {stat}
              </div>
            )}
            
            <h3 className="text-subsection-title">
              {title}
            </h3>
            
            <p className="text-body-secondary">
              {description}
            </p>
          </div>
        </div>
      </PremiumCard>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';

export { FeatureCard };