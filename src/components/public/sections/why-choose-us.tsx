'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, DollarSign, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const benefits = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes your health concerns, medical history, and preferences to connect you with the most suitable specialists worldwide.',
    features: [
      'Personalized specialist recommendations',
      'Smart filtering by location & budget',
      'Compatibility matching with doctor expertise'
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Heart,
    title: 'End-to-End Support',
    description: 'From initial consultation to post-treatment follow-up, our dedicated concierge team supports you throughout your entire healthcare journey.',
    features: [
      'Personal healthcare coordinator',
      'Travel and accommodation assistance',
      'Real-time appointment scheduling'
    ],
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'Clear, upfront pricing for all services with no hidden costs. Compare options easily and choose what fits your budget and needs.',
    features: [
      'Detailed cost breakdowns',
      'Multiple payment options',
      'Insurance coordination assistance'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Every specialist and medical facility in our network is thoroughly vetted, certified, and maintains the highest standards of care.',
    features: [
      'Board-certified specialists only',
      'JCI-accredited hospitals',
      'Regular quality audits'
    ],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-medifly-dark mb-6">
              Why Choose Our Platform
            </h2>
            <p className="text-lg lg:text-xl text-medifly-gray max-w-3xl mx-auto">
              We've revolutionized healthcare access with cutting-edge technology, 
              personalized service, and an unwavering commitment to your well-being.
            </p>
          </div>

          {/* Benefits Grid */}
  

          {/* Bottom CTA Section */}
          <div className="mt-20 text-center">
            <Card className="bg-medifly-beige border-0">
              <CardContent className="p-8 lg:p-12">
                <div className="space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-medifly-dark">
                    Ready to Experience the Difference?
                  </h3>
                  <p className="text-lg text-medifly-gray max-w-2xl mx-auto">
                    Join the thousands of patients who have transformed their healthcare 
                    journey with our innovative platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      asChild
                      size="lg"
                      className="gradient-teal text-white shadow-soft hover:shadow-lifted"
                    >
                      <Link href="/get-started">
                        Start Your Journey
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/demo">
                        Watch Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}