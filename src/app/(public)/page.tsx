'use client';

import { EnhancedHeroSection } from '@/components/public/hero/enhanced-hero-section';
import { KeyChallengesRuixenSection } from '@/components/public/sections/key-challenges-ruixen';
import { TrustIndicators } from '@/components/public/sections/trust-indicators';
import { GetInspiredSection } from '@/components/public/get-inspired-section';
import { HowItWorksSection } from '@/components/public/sections/how-it-works';
import { HealthcareDestinations } from '@/components/public/sections/healthcare-destinations';
import { WhyChooseUsSection } from '@/components/public/sections/why-choose-us';
import { PatientTestimonials } from '@/components/public/sections/patient-testimonials';
import { BrowseSpecialties } from '@/components/public/sections/browse-specialties';
import { FinalCTA } from '@/components/public/sections/final-cta';
import { Gallery4 } from '@/components/ui/gallery4';
import { CountryRecommendations } from '@/components/public/sections/country-recommendations';
import { DoctorRecommendations } from '@/components/public/sections/doctor-recommendations';
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant';

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
      {/* Section 1: Enhanced Hero Section with Animations and Chat Demo */}
      <EnhancedHeroSection onSearch={handleSearch} />
      
      {/* Section 10: Browse by Medical Specialty */}
      <BrowseSpecialties />

      {/* Section 2: Top Hospital Recommendations */}
      <Gallery4 />

      {/* Section 2.5: Top Medical Specialists */}
      <DoctorRecommendations />

      {/* Section 3: Country Recommendations */}
      <CountryRecommendations />

      {/* Section 4: Key Challenges - Ruixen Style */}
      <KeyChallengesRuixenSection />

      {/* Section 5: Get Inspired - Enhanced Popular Healthcare Journeys */}
      <div className="search-section">
        <GetInspiredSection 
          limit={6} 
          showTitle={true}
          showViewAllButton={true}
        />
      </div>

      <PatientTestimonials />

      {/* Section 6: How It Works Process */}
      {/* <HowItWorksSection /> */}

      {/* Section 7: Top Healthcare Destinations */}
      {/* <HealthcareDestinations /> */}

      {/* Section 8: Why Choose Our Platform */}
      {/* <WhyChooseUsSection /> */}

      {/* Section 9: Patient Success Stories / Testimonials */}
      

      

      {/* Section 11: Final Call-to-Action */}
      {/* <FinalCTA /> */}
      
      {/* Floating AI Assistant */}
      <FloatingAiAssistant />
    </div>
  );
}
