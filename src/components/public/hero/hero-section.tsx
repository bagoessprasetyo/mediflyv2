'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumCard } from '@/components/ui/premium';
import { HealthConcernInput } from './health-concern-input';
import { LocationPicker } from './location-picker';
import { ArrowRight, Clock, Shield, Users, Star } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  onSearch?: (healthConcern: string, location: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [healthConcern, setHealthConcern] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!healthConcern.trim()) return;
    
    setIsLoading(true);
    try {
      if (onSearch) {
        await onSearch(healthConcern, location);
      }
      
      // Redirect to search page with query parameters
      const searchParams = new URLSearchParams();
      searchParams.set('q', healthConcern);
      if (location.trim()) {
        searchParams.set('location', location);
      }
      
      router.push(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSearchEnabled = healthConcern.trim().length > 10;

  return (
    <section className="relative bg-medifly-beige py-20 lg:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-medifly-light-blue/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-medifly-teal/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-medifly-teal/10 rounded-full blur-lg" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content and Inputs */}
          <div className="lg:col-span-3 space-y-8">
            {/* Headlines */}
            <div className="space-content">
              <h1 className="text-hero text-gray-900">
                Access World-Class Healthcare,{' '}
                <span className="text-gradient">Anywhere You Are</span>
              </h1>
              
              <p className="text-body max-w-2xl">
                Connect with top medical specialists across Asia. Get expert diagnoses, 
                second opinions, and personalized treatment plans from the comfort of home.
              </p>
            </div>

            {/* Interactive Form */}
            <PremiumCard 
              variant="glass" 
              size="lg"
              hover="glow"
              className="border-2 border-white/50"
            >
              <div className="space-content-sm">
                <div>
                  <label className="block text-small font-medium text-gray-900 mb-3">
                    What's your health concern?
                  </label>
                  <HealthConcernInput
                    value={healthConcern}
                    onChange={setHealthConcern}
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-gray-900 mb-3">
                    Preferred destination (optional)
                  </label>
                  <LocationPicker
                    value={location}
                    onChange={setLocation}
                  />
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={!isSearchEnabled || isLoading}
                  size="lg"
                  className="btn-premium-primary w-full h-14 text-base font-medium rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Finding Specialists...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Find Specialists
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="pt-6 border-t border-gray-100/50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-medifly-teal">500+</div>
                    <div className="text-xs-muted">Specialists</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-medifly-teal">15+</div>
                    <div className="text-xs-muted">Countries</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-medifly-teal">24/7</div>
                    <div className="text-xs-muted">Available</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-medifly-teal">4.9★</div>
                    <div className="text-xs-muted">Rating</div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Right Column - Visual */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-medifly-teal/10 to-medifly-light-blue/20">
                <div className="aspect-[4/5] bg-gradient-to-br from-medifly-light-blue/20 to-medifly-teal/20 flex items-center justify-center">
                  {/* Placeholder for hero image */}
                  <div className="text-center space-content p-8">
                    <div className="w-24 h-24 bg-medifly-teal/20 rounded-2xl mx-auto flex items-center justify-center premium-hover-scale">
                      <Users className="h-12 w-12 text-medifly-teal" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-subsection-title">
                        Expert Healthcare
                      </h3>
                      <p className="text-body-secondary">
                        Connect with world-class specialists
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-green-500 text-white border-0 shadow-sm premium-hover-scale">
                    <Clock className="h-3 w-3 mr-1" />
                    Available 24/7
                  </Badge>
                </div>
                
                <div className="absolute -bottom-3 -left-3">
                  <PremiumCard size="sm" hover="scale" className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-medifly-teal" />
                      <span className="text-xs-muted font-medium">HIPAA Compliant</span>
                    </div>
                  </PremiumCard>
                </div>
                
                <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                  <PremiumCard size="sm" hover="scale" className="p-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span className="text-xs-muted font-medium">150+ Reviews</span>
                    </div>
                  </PremiumCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}