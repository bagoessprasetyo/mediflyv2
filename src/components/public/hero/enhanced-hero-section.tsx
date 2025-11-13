'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedHero } from '@/components/ui/animated-hero';
import { HealthcareChatDemo } from '@/components/ui/healthcare-chat-demo';
import { motion } from 'motion/react';

interface EnhancedHeroSectionProps {
  onSearch?: (healthConcern: string, location: string) => void;
}

export function EnhancedHeroSection({ onSearch }: EnhancedHeroSectionProps) {
  const router = useRouter();

  const handleConsultClick = () => {
    // Scroll to the search form section
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to search page
      router.push('/search');
    }
  };

  const handleFindDoctorsClick = () => {
    router.push('/search');
  };

  return (
    <div className="relative">
      {/* Main Animated Hero */}
      <AnimatedHero 
        onConsultClick={handleConsultClick}
        onFindDoctorsClick={handleFindDoctorsClick}
      />

      {/* Interactive Chat Demo Section */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-medifly-teal/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-medifly-light-blue/5 rounded-full blur-xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Seamless <span className="text-gradient">Healthcare Communication</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chat directly with specialists, get instant responses, and manage your healthcare journey 
              through our secure platform. See how easy it is to connect with expert care.
            </p>
          </motion.div>

          {/* Interactive Chat Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HealthcareChatDemo />
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-gray-600 mb-6">
              Ready to start your healthcare journey? Connect with verified specialists today.
            </p>
            <button
              onClick={handleFindDoctorsClick}
              className="btn-premium-primary px-8 py-4 text-lg font-medium rounded-xl"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}