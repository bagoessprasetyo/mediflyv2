'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TestimonialCard, PremiumCard } from '@/components/ui/premium';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'United States',
    treatment: 'Cardiac Care in Bangkok',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    quote: 'The care I received was exceptional. From booking to recovery, everything was seamless. The doctors were world-class and the facilities were better than what I have at home.',
    savings: 'Saved $45,000',
    flag: '🇺🇸'
  },
  {
    id: 2,
    name: 'David L.',
    location: 'Canada',
    treatment: 'Knee Replacement in Malaysia',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    quote: 'I saved 60% compared to local costs and received world-class treatment. The follow-up care has been outstanding, and I\'m back to playing tennis!',
    savings: 'Saved $28,000',
    flag: '🇨🇦'
  },
  {
    id: 3,
    name: 'Maria R.',
    location: 'Spain',
    treatment: 'Fertility Treatment in India',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    quote: 'The AI matching was spot-on. My specialist understood my needs perfectly. After years of trying, we finally have our miracle baby thanks to the amazing team.',
    savings: 'Saved $35,000',
    flag: '🇪🇸'
  },
  {
    id: 4,
    name: 'James K.',
    location: 'Australia',
    treatment: 'Eye Surgery in Turkey',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    quote: 'From consultation to post-op care, everything exceeded my expectations. The technology was cutting-edge and the results are perfect. Highly recommended!',
    savings: 'Saved $18,000',
    flag: '🇦🇺'
  },
  {
    id: 5,
    name: 'Lisa W.',
    location: 'United Kingdom',
    treatment: 'Dental Implants in Malaysia',
    avatar: '/api/placeholder/64/64',
    rating: 5,
    quote: 'The entire experience was transformative. Not only did I save money, but the quality of care was superior to what I could get locally. My smile has never looked better!',
    savings: 'Saved $12,000',
    flag: '🇬🇧'
  }
];

export function PatientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="space-section bg-section-blue">
      <div className="container-premium">
        <div className="max-w-6xl mx-auto space-content">
          {/* Header */}
          <div className="text-center space-content-sm">
            <h2 className="text-section-title">
              Patient Success Stories
            </h2>
            <p className="text-body container-content">
              Real stories from patients who found world-class healthcare through our platform.
              Join thousands who have transformed their health journey.
            </p>
          </div>

          {/* Main Testimonial Carousel */}
          <div className="relative">
            <TestimonialCard
              name={currentTestimonial.name}
              location={currentTestimonial.location}
              treatment={currentTestimonial.treatment}
              avatar={currentTestimonial.avatar}
              rating={currentTestimonial.rating}
              quote={currentTestimonial.quote}
              savings={currentTestimonial.savings}
              flag={currentTestimonial.flag}
              variant="featured"
              className="max-w-4xl mx-auto"
            />

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-sm bg-white hover:bg-gray-50 border-gray-200 premium-hover-lift"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-sm bg-white hover:bg-gray-50 border-gray-200 premium-hover-lift"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? 'bg-medifly-teal scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">150K+</div>
              <div className="text-body-secondary">Patients Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">4.9★</div>
              <div className="text-body-secondary">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">95%</div>
              <div className="text-body-secondary">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">$2M+</div>
              <div className="text-body-secondary">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}