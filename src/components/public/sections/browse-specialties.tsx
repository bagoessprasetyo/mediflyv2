'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Grid } from '@/components/ui/feature-section-with-card-gradient';
import Link from 'next/link';
import { useId } from 'react';
import {
  Heart,
  Bone,
  Ribbon,
  Baby,
  Smile,
  Eye,
  Sparkles,
  Brain,
  Pizza,
  Stethoscope,
  Activity,
  Zap
} from 'lucide-react';

const specialties = [
  {
    name: 'Cardiology',
    icon: Heart,
    description: 'Heart and cardiovascular care',
    specialists: '85+ Specialists',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100'
  },
  {
    name: 'Orthopedics',
    icon: Bone,
    description: 'Bone, joint, and muscle treatment',
    specialists: '92+ Specialists',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    name: 'Oncology',
    icon: Ribbon,
    description: 'Cancer diagnosis and treatment',
    specialists: '67+ Specialists',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100'
  },
  {
    name: 'Fertility',
    icon: Baby,
    description: 'Reproductive health and IVF',
    specialists: '45+ Specialists',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    name: 'Dental Care',
    icon: Smile,
    description: 'Comprehensive dental services',
    specialists: '128+ Specialists',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  {
    name: 'Ophthalmology',
    icon: Eye,
    description: 'Eye care and vision correction',
    specialists: '54+ Specialists',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100'
  },
  {
    name: 'Cosmetic Surgery',
    icon: Sparkles,
    description: 'Aesthetic and reconstructive surgery',
    specialists: '73+ Specialists',
    color: 'text-medifly-teal',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100'
  },
  {
    name: 'Neurology',
    icon: Brain,
    description: 'Brain and nervous system disorders',
    specialists: '38+ Specialists',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    name: 'Gastroenterology',
    icon: Pizza,
    description: 'Digestive system health',
    specialists: '41+ Specialists',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    hoverColor: 'hover:bg-amber-100'
  },
  {
    name: 'General Medicine',
    icon: Stethoscope,
    description: 'Primary care and consultations',
    specialists: '156+ Specialists',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100'
  },
  {
    name: 'Emergency Care',
    icon: Zap,
    description: '24/7 emergency consultations',
    specialists: '89+ Specialists',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100'
  },
  {
    name: 'Wellness & Spa',
    icon: Activity,
    description: 'Health optimization and wellness',
    specialists: '62+ Specialists',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100'
  }
];

export function BrowseSpecialties() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge 
              variant="secondary"
              className="bg-medifly-light-blue text-medifly-teal border-0 font-medium mb-6"
            >
              MEDICAL SPECIALTIES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              Find Your Perfect Specialist
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with world-class medical experts across all specialties. Our verified specialists 
              deliver exceptional care with cutting-edge technology and personalized treatment approaches.
            </p>
          </div>

          {/* Specialties Grid with Gradient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4">
            {specialties.map((specialty, index) => {
              const Icon = specialty.icon;
              
              return (
                <Link 
                  key={index}
                  href={`/specialties/${specialty.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group block"
                >
                  <div className="relative bg-gradient-to-b from-white via-gray-50/50 to-white p-6 rounded-3xl overflow-hidden border border-gray-200/50 hover:border-medifly-teal/30 transition-all duration-300 hover:shadow-lg">
                    <Grid size={20} />
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4 relative z-20">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`h-6 w-6 ${specialty.color}`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center space-y-2 relative z-20">
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-medifly-teal transition-colors">
                        {specialty.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-normal leading-relaxed">
                        {specialty.description}
                      </p>
                      <div className="text-xs font-medium text-medifly-teal pt-1">
                        {specialty.specialists}
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                        <ArrowRight className="h-4 w-4 text-medifly-teal mx-auto" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          
        </div>
      </div>
    </section>
  );
}