'use client';

import { motion } from 'motion/react';
import { Search, Settings, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KeyChallengesSection() {
  const challenges = [
    {
      icon: Search,
      title: "Limited Local Options",
      description: "Long waits and few local specialists available."
    },
    {
      icon: Settings,
      title: "Fragmented Information",
      description: "Finding, comparing, and choosing care can feel overwhelming."
    },
    {
      icon: TrendingUp,
      title: "Higher Local Costs for Specialized Treatments",
      description: "Specialized treatments at home are often more expensive."
    },
    {
      icon: Shield,
      title: "Lack of Support for International Care",
      description: "Patients struggle to find reliable guidance abroad."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-2 bg-gray-200 rounded-full text-sm font-medium text-gray-700 mb-6">
            KEY CHALLENGES
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Overcoming Barriers to Better Healthcare
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every year, millions across Asia struggle to access the care they need.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Challenge Cards - Left Column */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <challenge.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solution Card - Right Column */}
          <motion.div
            className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                Better health decisions shouldn't depend on where you live
              </h3>
              
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl group"
              >
                Partner With Us
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}