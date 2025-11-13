'use client';

import { DestinationCard } from '@/components/ui/card-21';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const countryRecommendations = [
  {
    id: 'singapore',
    location: 'Singapore',
    flag: '🇸🇬',
    stats: '45 Top Hospitals • World-Class Care',
    specialties: ['Advanced Surgery', 'Oncology', 'Transplants'],
    description: 'Global leader in medical excellence with cutting-edge technology and premium healthcare services.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1470&auto=format&fit=crop',
    href: '/destinations/singapore',
    themeColor: '184 100% 22%', // Deep teal for Singapore (medical excellence)
  },
  {
    id: 'thailand',
    location: 'Thailand',
    flag: '🇹🇭',
    stats: '200+ JCI Hospitals • Medical Tourism Leader',
    specialties: ['Cosmetic Surgery', 'Dental Care', 'Wellness'],
    description: 'Southeast Asia\'s medical tourism capital offering world-class care at exceptional value.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop',
    href: '/destinations/thailand',
    themeColor: '146 64% 32%', // Emerald green for Thailand (wellness & nature)
  },
  {
    id: 'malaysia',
    location: 'Malaysia',
    flag: '🇲🇾',
    stats: '150+ Hospitals • Regional Hub',
    specialties: ['Cardiology', 'Orthopedics', 'Medical Check-ups'],
    description: 'Strategic healthcare hub combining advanced facilities with cultural comfort and accessibility.',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1428&auto=format&fit=crop',
    href: '/destinations/malaysia',
    themeColor: '222 84% 35%', // Deep blue for Malaysia (trust & stability)
  },
  {
    id: 'south-korea',
    location: 'South Korea',
    flag: '🇰🇷',
    stats: '300+ Advanced Centers • Innovation Leader',
    specialties: ['Medical Technology', 'Dermatology', 'Robotics Surgery'],
    description: 'Global innovation powerhouse in medical technology with highly specialized procedures.',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1470&auto=format&fit=crop',
    href: '/destinations/south-korea',
    themeColor: '280 100% 30%', // Rich purple for South Korea (innovation & technology)
  },
  {
    id: 'india',
    location: 'India',
    flag: '🇮🇳',
    stats: '500+ Specialized Hospitals • Complex Care',
    specialties: ['Complex Surgery', 'Fertility', 'Traditional Medicine'],
    description: 'Leading destination for complex medical procedures with exceptional expertise and affordability.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1471&auto=format&fit=crop',
    href: '/destinations/india',
    themeColor: '24 100% 35%', // Warm orange for India (warmth & expertise)
  },
  {
    id: 'japan',
    location: 'Japan',
    flag: '🇯🇵',
    stats: '250+ Research Centers • Precision Medicine',
    specialties: ['Precision Medicine', 'Longevity Care', 'Advanced Diagnostics'],
    description: 'Precision medicine leader with groundbreaking research in longevity and advanced diagnostics.',
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1453&auto=format&fit=crop',
    href: '/destinations/japan',
    themeColor: '0 72% 45%', // Cherry blossom pink for Japan (precision & care)
  },
];

export function CountryRecommendations() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6"
            style={{ backgroundColor: '#f6f4f2' }}
          >
            RECOMMENDATIONS BY COUNTRY
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 tracking-tighter ">
            Explore Healthcare Excellence Across Asia
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover world-renowned medical destinations where cutting-edge technology meets exceptional care. 
            Each country offers unique specialties and advantages for your healthcare journey.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {countryRecommendations.map((country) => (
            <div key={country.id} className="h-[450px]">
              <DestinationCard
                imageUrl={country.imageUrl}
                location={country.location}
                flag={country.flag}
                stats={country.stats}
                href={country.href}
                themeColor={country.themeColor}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button 
            asChild
            size="lg" 
            className="bg-medifly-teal hover:bg-medifly-teal/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link href="/destinations" className="inline-flex items-center gap-2">
              Compare All Countries
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}