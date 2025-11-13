'use client';

import { motion } from 'motion/react';
import { Search, Settings, TrendingUp, Shield, ArrowRight, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCard } from '@/components/ui/ruixen-bento-cards';

export function KeyChallengesRuixenSection() {
  const challenges = [
    {
      icon: Search,
      title: "Limited Local Options",
      description: "Long waits and few local specialists available in your area."
    },
    {
      icon: Settings,
      title: "Fragmented Information",
      description: "Finding, comparing, and choosing care can feel overwhelming."
    },
    {
      icon: TrendingUp,
      title: "Higher Local Costs",
      description: "Specialized treatments at home are often more expensive."
    },
    {
      icon: Shield,
      title: "Lack of International Support",
      description: "Patients struggle to find reliable guidance abroad."
    }
  ];

  return (
    <section 
      className="pb-20 " 
      style={{ backgroundColor: '#fafafa' }}
    >
      <div className="mx-auto container border border-gray-200 py-12 border-t-0 px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6"
            style={{ backgroundColor: '#f6f4f2' }}
          >
            KEY CHALLENGES
          </div>
          <h2 className="text-4xl md:text-5xl tracking-tighter font-medium text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Overcoming Barriers to Better Healthcare
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every year, millions across Asia struggle to access the care they need.
          </p>
        </motion.div>

        {/* Responsive Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Feature Card - Large */}
          <PlusCard 
            icon={Heart}
            title="Better health decisions shouldn't depend on where you live"
            description="We believe every patient deserves access to world-class healthcare, regardless of their location or circumstances. MediFly connects you with trusted specialists across Asia."
            className="lg:col-span-3 lg:row-span-2 min-h-[300px]"
            // style={{ backgroundColor: '#ade4ff' }}
          >
            <div className="mt-4">
              <Button 
                className="bg-white text-blue-800 hover:bg-gray-50 font-semibold group shadow-sm"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </PlusCard>

          {/* Challenge Cards - First Row */}
          <PlusCard 
            {...challenges[0]} 
            className="lg:col-span-2 lg:row-span-1"
          />

          <PlusCard 
            {...challenges[1]} 
            className="lg:col-span-1 lg:row-span-1"
          />

          {/* Challenge Cards - Second Row */}
          <PlusCard 
            {...challenges[2]} 
            className="lg:col-span-2 lg:row-span-1"
          />

          <PlusCard 
            {...challenges[3]} 
            className="lg:col-span-1 lg:row-span-1"
          />

          {/* Philosophy Card - Full Width */}
          <PlusCard 
            icon={Users}
            title="Our Philosophy"
            description="We believe in a collaborative process, where transparency and communication lead to outstanding results. Your health is our mission, and we're committed to connecting you with the best specialists across Asia."
            className="lg:col-span-6"
            // style={{ backgroundColor: '#f6f4f2' }}
          />
        </motion.div>

        {/* Section Footer Heading */}
        <motion.div 
          className="max-w-2xl ml-auto text-right px-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-4xl md:text-6xl font-medium text-black mb-4">
            Built for patients. Designed for trust.
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            MediFly gives you the tools to access world-class healthcare with confidence. 
            Each connection is thoughtfully designed to be secure, reliable, and accessible.
          </p>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md ml-auto">
            {[
              { number: "500+", label: "Specialists" },
              { number: "15+", label: "Countries" },
              { number: "24/7", label: "Support" },
              { number: "4.9★", label: "Rating" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}