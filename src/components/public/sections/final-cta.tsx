'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Star, Award, Shield } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-medifly-teal via-blue-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* Main headline */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Start Your Healthcare Journey?
              </h2>
              <p className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands who've found better healthcare options through our platform. 
                World-class care is just a few clicks away.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-medifly-teal hover:bg-gray-50 shadow-lifted hover:shadow-float font-semibold px-8 py-4 text-lg h-auto btn-ripple"
              >
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-medifly-teal font-semibold px-8 py-4 text-lg h-auto"
              >
                <Link href="/contact">
                  Talk to Our Team
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="pt-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white">150K+</div>
                  <div className="text-sm text-blue-100">Patients Served</div>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-blue-100">Specialists</div>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-blue-100">Average Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-blue-100">Secure & Private</div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Shield className="h-3 w-3 mr-1" />
                  HIPAA Compliant
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Award className="h-3 w-3 mr-1" />
                  ISO 27001
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  JCI Partner
                </Badge>
              </div>
            </div>

            {/* Small print */}
            <div className="pt-6 text-center">
              <p className="text-sm text-blue-200">
                Free consultation • No hidden fees • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}