'use client';

import { motion } from 'motion/react';
import { Search, Settings, TrendingUp, Shield, ArrowRight, Heart, Users, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoItem from '@/components/ui/bento-item';

export function KeyChallengesBentoSection() {
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
    <section className="py-20 lg:py-28 aurora-container">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-2 bg-gray-200/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-6">
            KEY CHALLENGES
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Overcoming Barriers to Better Healthcare
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every year, millions across Asia struggle to access the care they need.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          className="bento-grid max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Feature Card - Large */}
          <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between bg-gradient-to-br from-medifly-teal to-blue-600 text-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Our Mission</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Better health decisions shouldn't depend on where you live
              </h2>
              <p className="text-blue-100 leading-relaxed mb-6">
                We believe every patient deserves access to world-class healthcare, regardless of their location or circumstances.
              </p>
            </div>
            <div className="mt-4 h-32 bg-black/10 rounded-lg flex items-center justify-center text-blue-100 border border-white/20">
              <div className="text-center">
                <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-60" />
                <span className="text-sm opacity-80">[Healthcare Vision Showcase]</span>
              </div>
            </div>
          </BentoItem>

          {/* Challenge Cards */}
          {challenges.map((challenge, index) => (
            <BentoItem key={index} className={index >= 2 ? "md:row-span-1" : ""}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <challenge.icon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </BentoItem>
          ))}

          {/* Philosophy Card - Full Width */}
          <BentoItem className="col-span-full-mobile bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-medifly-teal">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-medifly-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-medifly-teal" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Philosophy</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We believe in a collaborative process, where transparency and communication lead to outstanding results. 
                  Your health is our mission, and we're committed to connecting you with the best specialists across Asia.
                </p>
                <Button 
                  variant="outline" 
                  className="border-medifly-teal text-medifly-teal hover:bg-medifly-teal hover:text-white font-semibold group"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </BentoItem>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { number: "500+", label: "Specialists Connected" },
            { number: "15+", label: "Countries Covered" },
            { number: "24/7", label: "Support Available" },
            { number: "4.9★", label: "Patient Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/40">
              <div className="text-2xl font-bold text-medifly-teal mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}