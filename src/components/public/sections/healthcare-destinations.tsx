'use client';

import { DestinationCard } from '@/components/ui/premium';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const destinations = [
  {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    flag: '🇲🇾',
    description: 'Southeast Asia\'s leading medical hub with state-of-the-art facilities and internationally trained specialists.',
    specialties: ['Cardiology', 'Orthopedics', 'Cosmetic Surgery'],
    rating: 4.8,
    reviewCount: 2847,
    savings: 'Save 70%',
    travelTime: '2h from Singapore',
    featured: false,
    image: '/api/placeholder/400/300'
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    description: 'World-renowned medical excellence with cutting-edge technology and premium healthcare services.',
    specialties: ['Oncology', 'Neurosurgery', 'Pediatric Care'],
    rating: 4.9,
    reviewCount: 1923,
    savings: null,
    travelTime: 'Global Hub',
    featured: true,
    image: '/api/placeholder/400/300'
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    description: 'Affordable excellence in medical tourism with JCI-accredited hospitals and expert practitioners.',
    specialties: ['Dental Care', 'Cosmetic Surgery', 'Wellness'],
    rating: 4.7,
    reviewCount: 3456,
    savings: 'Save 80%',
    travelTime: '1.5h from Bangkok',
    featured: false,
    image: '/api/placeholder/400/300'
  },
  {
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    description: 'Advanced medical care combining modern technology with traditional healing practices.',
    specialties: ['Complex Surgery', 'Fertility', 'Ayurveda'],
    rating: 4.6,
    reviewCount: 4231,
    savings: 'Save 85%',
    travelTime: '3h from Dubai',
    featured: false,
    image: '/api/placeholder/400/300'
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    flag: '🇹🇷',
    description: 'Bridge between Europe and Asia offering world-class medical care at exceptional value.',
    specialties: ['Hair Transplant', 'Dental Care', 'Eye Surgery'],
    rating: 4.8,
    reviewCount: 2156,
    savings: 'Save 75%',
    travelTime: '3h from London',
    featured: false,
    image: '/api/placeholder/400/300'
  },
  {
    name: 'Seoul',
    country: 'South Korea',
    flag: '🇰🇷',
    description: 'Innovation leader in medical technology with highly skilled specialists and advanced procedures.',
    specialties: ['Cosmetic Surgery', 'Dermatology', 'Medical Technology'],
    rating: 4.9,
    reviewCount: 1687,
    savings: null,
    travelTime: '2h from Tokyo',
    featured: true,
    image: '/api/placeholder/400/300'
  }
];

export function HealthcareDestinations() {
  return (
    <section className="space-section bg-section-warm">
      <div className="container-premium">
        <div className="space-content">
          {/* Header */}
          <div className="text-center space-content-sm container-content">
            <h2 className="text-section-title">
              Discover Healthcare Destinations
            </h2>
            <p className="text-body">
              Explore world-renowned medical destinations offering exceptional care, 
              cutting-edge technology, and remarkable value. Your journey to better health starts here.
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Link 
                key={index}
                href={`/destinations/${destination.country.toLowerCase()}`}
                className="block"
              >
                <DestinationCard
                  name={destination.name}
                  country={destination.country}
                  description={destination.description}
                  image={destination.image}
                  rating={destination.rating}
                  reviewCount={destination.reviewCount}
                  specialties={destination.specialties}
                  savings={destination.savings || undefined}
                  travelTime={destination.travelTime}
                  featured={destination.featured}
                  flag={destination.flag}
                />
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Button 
              asChild
              size="lg" 
              className="btn-premium-primary"
            >
              <Link href="/destinations" className="inline-flex items-center gap-2">
                View All Destinations
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}