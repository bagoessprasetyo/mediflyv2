'use client';

import { FeatureCard } from '@/components/ui/premium';
import { Award, Globe, Shield, Clock } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/use-scroll-animation';

const indicators = [
  {
    icon: Award,
    stat: '500+',
    title: 'Board-Certified Specialists',
    description: 'Only verified, board-certified medical professionals from top institutions worldwide',
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-50'
  },
  {
    icon: Globe,
    stat: '15+',
    title: 'Countries & Destinations',
    description: 'Access premium healthcare across Asia and beyond with our global network',
    iconColor: 'text-emerald-600',
    iconBgColor: 'bg-emerald-50'
  },
  {
    icon: Shield,
    stat: '100%',
    title: 'Secure & Private',
    description: 'HIPAA-compliant platform with end-to-end encryption for your health data',
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-50'
  },
  {
    icon: Clock,
    stat: '24/7',
    title: 'Always Available',
    description: 'Connect with specialists instantly, any time of day or night',
    iconColor: 'text-medifly-teal',
    iconBgColor: 'bg-teal-50'
  }
];

export function TrustIndicators() {
  const { containerRef, visibleItems } = useStaggeredAnimation(indicators.length, 200);

  return (
    <section className="space-section bg-white">
      <div className="container-premium">
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className={`
                transform transition-all duration-700 ease-out
                ${visibleItems[index] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
                }
              `}
            >
              <FeatureCard
                icon={indicator.icon}
                title={indicator.title}
                description={indicator.description}
                stat={indicator.stat}
                iconColor={indicator.iconColor}
                iconBgColor={indicator.iconBgColor}
                alignment="center"
                variant="default"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}