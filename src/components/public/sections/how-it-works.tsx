'use client';

import { PremiumCard } from '@/components/ui/premium';
import { MessageSquare, Search, Calendar, Heart, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Share Your Health Concern',
    description: 'Describe your symptoms or health goals in natural language. Our AI-powered system understands your needs and concerns.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    accent: 'border-blue-200'
  },
  {
    number: '02',
    icon: Search,
    title: 'Get Personalized Matches',
    description: 'Receive curated recommendations for top specialists, proven treatments, and trusted destinations tailored to you.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    accent: 'border-emerald-200'
  },
  {
    number: '03',
    icon: Calendar,
    title: 'Book & Coordinate',
    description: 'Schedule consultations, book travel, and coordinate all logistics seamlessly. We handle the complex details.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    accent: 'border-purple-200'
  },
  {
    number: '04',
    icon: Heart,
    title: 'Receive Ongoing Care',
    description: 'Access comprehensive treatment plans, ongoing support, and follow-up care throughout your health journey.',
    color: 'text-medifly-teal',
    bgColor: 'bg-teal-50',
    accent: 'border-teal-200'
  }
];

export function HowItWorksSection() {
  return (
    <section className="space-section bg-section-alt">
      <div className="container-premium">
        <div className="space-content">
          {/* Header */}
          <div className="text-center space-content-sm container-content">
            <h2 className="text-section-title">
              How It Works
            </h2>
            <p className="text-body">
              Getting world-class healthcare is simple with our streamlined process. 
              We guide you every step of the way, making complex medical decisions effortless.
            </p>
          </div>

          {/* Steps Flow */}
          <div className="relative">
            {/* Flowing connecting path */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-medifly-teal/20 to-transparent" />
                <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-medifly-teal/30 via-medifly-teal/60 to-medifly-teal/30" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                const isLast = index === steps.length - 1;
                
                return (
                  <div key={index} className="relative group">
                    <PremiumCard 
                      variant="default"
                      hover="scale"
                      className={`relative z-10 text-center border-l-4 ${step.accent} overflow-visible`}
                    >
                      <div className="space-content-sm">
                        {/* Step Indicator */}
                        <div className="relative -mt-8 mb-6">
                          <div className={`
                            w-16 h-16 ${step.bgColor} border-4 border-white rounded-2xl
                            flex items-center justify-center mx-auto shadow-md
                            group-hover:scale-110 transition-all duration-300
                          `}>
                            <Icon className={`h-7 w-7 ${step.color}`} />
                          </div>
                          
                          {/* Step number badge */}
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-medifly-teal text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                            {step.number}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-4">
                          <h3 className="text-subsection-title">
                            {step.title}
                          </h3>
                          <p className="text-body-secondary leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </PremiumCard>
                    
                    {/* Flow arrows for mobile */}
                    {!isLast && (
                      <div className="lg:hidden flex justify-center mt-8 mb-4">
                        <div className="w-8 h-8 rounded-full bg-medifly-teal/10 flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-medifly-teal" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-medifly-teal/5 rounded-full border border-medifly-teal/20 hover:bg-medifly-teal/10 transition-colors duration-200 group">
              <span className="text-base font-medium text-medifly-teal">Ready to get started?</span>
              <ArrowRight className="h-5 w-5 text-medifly-teal group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}