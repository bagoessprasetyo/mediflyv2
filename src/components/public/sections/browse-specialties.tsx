'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-medifly-dark mb-6">
              Browse by Medical Specialty
            </h2>
            <p className="text-lg lg:text-xl text-medifly-gray max-w-3xl mx-auto">
              Find the right specialist for your specific health needs. Our verified experts 
              cover all major medical specialties with world-class care.
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => {
              const Icon = specialty.icon;
              
              return (
                <Card 
                  key={index}
                  className={`
                    group hover-lift cursor-pointer border-0 shadow-soft
                    ${specialty.bgColor} ${specialty.hoverColor}
                    transition-all duration-300
                  `}
                >
                  <Link href={`/specialties/${specialty.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-6 text-center">
                      <div className="space-y-4">
                        {/* Icon */}
                        <div className="flex justify-center">
                          <div className={`
                            w-16 h-16 bg-white rounded-full shadow-soft
                            flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300
                          `}>
                            <Icon className={`h-8 w-8 ${specialty.color}`} />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-medifly-dark group-hover:text-medifly-teal transition-colors">
                            {specialty.name}
                          </h3>
                          <p className="text-xs text-medifly-gray leading-relaxed">
                            {specialty.description}
                          </p>
                          <div className="text-xs font-medium text-medifly-teal">
                            {specialty.specialists}
                          </div>
                        </div>

                        {/* Hover Arrow */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-medifly-teal mx-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16">
            <div className="bg-medifly-beige rounded-2xl p-8 lg:p-12">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-medifly-dark">
                  Can't find your specialty?
                </h3>
                <p className="text-medifly-gray max-w-2xl mx-auto">
                  We work with specialists across all medical fields. Contact our team 
                  and we'll help connect you with the right expert for your needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild
                    className="gradient-teal text-white shadow-soft hover:shadow-lifted"
                  >
                    <Link href="/contact">
                      Get Personalized Help
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline">
                    <Link href="/specialties">
                      View All Specialties
                    </Link>
                  </Button>
                </div>

                {/* Total stats */}
                <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-medifly-teal/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medifly-teal">500+</div>
                    <div className="text-sm text-medifly-gray">Total Specialists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medifly-teal">50+</div>
                    <div className="text-sm text-medifly-gray">Specialties Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medifly-teal">15+</div>
                    <div className="text-sm text-medifly-gray">Countries Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}