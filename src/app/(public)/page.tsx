'use client';

import { HeroSection } from '@/components/public/hero/hero-section';
import { TrustIndicators } from '@/components/public/sections/trust-indicators';
import { GetInspiredSection } from '@/components/public/get-inspired-section';
import { HowItWorksSection } from '@/components/public/sections/how-it-works';
import { HealthcareDestinations } from '@/components/public/sections/healthcare-destinations';
import { WhyChooseUsSection } from '@/components/public/sections/why-choose-us';
import { PatientTestimonials } from '@/components/public/sections/patient-testimonials';
import { BrowseSpecialties } from '@/components/public/sections/browse-specialties';
import { FinalCTA } from '@/components/public/sections/final-cta';

export default function Home() {
  const handleSearch = async (healthConcern: string, location: string) => {
    // This will be implemented with actual search functionality
    console.log('Searching for:', { healthConcern, location });
    // For now, we can implement client-side navigation
    const params = new URLSearchParams();
    if (healthConcern) params.set('concern', healthConcern);
    if (location) params.set('location', location);
    
    // Navigate to search results page
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Section with Interactive Inputs */}
      <HeroSection onSearch={handleSearch} />

      {/* Section 2: Trust Indicators */}
      <TrustIndicators />

      {/* Section 3: Get Inspired - Enhanced Popular Healthcare Journeys */}
      <GetInspiredSection 
        limit={6} 
        showTitle={true}
        showViewAllButton={true}
      />

      {/* Section 4: How It Works Process */}
      <HowItWorksSection />

      {/* Section 5: Top Healthcare Destinations */}
      <HealthcareDestinations />

      {/* Section 6: Why Choose Our Platform */}
      <WhyChooseUsSection />

      {/* Section 7: Patient Success Stories / Testimonials */}
      <PatientTestimonials />

      {/* Section 8: Browse by Medical Specialty */}
      <BrowseSpecialties />

      {/* Section 9: Final Call-to-Action */}
      <FinalCTA />
    </div>
  );
}
