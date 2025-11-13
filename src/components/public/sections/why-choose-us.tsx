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
          <div className="space-y-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    !isEven ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`space-y-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="space-y-4">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-16 h-16 ${benefit.bgColor} rounded-xl
                          flex items-center justify-center shadow-soft
                        `}>
                          <Icon className={`h-8 w-8 ${benefit.color}`} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-medifly-dark">
                          {benefit.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-lg text-medifly-gray leading-relaxed">
                        {benefit.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-3">
                        {benefit.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-medifly-teal rounded-full flex-shrink-0" />
                            <span className="text-medifly-dark">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="pt-4">
                        <Button 
                          asChild
                          variant="outline"
                          className="hover:bg-medifly-teal hover:text-white hover:border-medifly-teal"
                        >
                          <Link href="/how-it-works">
                            Learn More
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Visual/Illustration */}
                  <div className={`${!isEven ? 'lg:col-start-1' : ''}`}>
                    <Card className="overflow-hidden shadow-lifted border-0">
                      <CardContent className="p-0">
                        <div className={`
                          aspect-[4/3] ${benefit.bgColor} 
                          flex items-center justify-center relative overflow-hidden
                        `}>
                          {/* Placeholder illustration - can be replaced with actual images */}
                          <div className="text-center space-y-4 p-8">
                            <div className={`
                              w-24 h-24 bg-white rounded-full mx-auto 
                              flex items-center justify-center shadow-lifted
                            `}>
                              <Icon className={`h-12 w-12 ${benefit.color}`} />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xl font-semibold text-medifly-dark">
                                {benefit.title}
                              </h4>
                              <p className="text-sm text-medifly-gray max-w-xs">
                                Advanced technology meets personalized healthcare
                              </p>
                            </div>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full" />
                          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/30 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

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