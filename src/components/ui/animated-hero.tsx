'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MoveRight, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimatedHeroProps {
  onConsultClick?: () => void;
  onFindDoctorsClick?: () => void;
}

function AnimatedHero({ onConsultClick, onFindDoctorsClick }: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["innovative", "trusted", "advanced", "personalized", "accessible"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleConsultClick = () => {
    if (onConsultClick) {
      onConsultClick();
    } else {
      // Default behavior - scroll to search section or navigate
      document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFindDoctorsClick = () => {
    if (onFindDoctorsClick) {
      onFindDoctorsClick();
    } else {
      // Default behavior - navigate to search page
      window.location.href = '/search';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-medifly-beige to-white">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 pt-32 pb-10 items-center justify-center flex-col relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-medifly-light-blue/20 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-medifly-teal/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-medifly-teal/10 rounded-full blur-lg" />
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="secondary" size="sm" className="gap-4 bg-white/80 text-medifly-teal border border-medifly-teal/20 hover:bg-white">
              <Stethoscope className="w-4 h-4" />
              Trusted by 10,000+ patients
              <MoveRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Main headline with animated text */}
          <motion.div 
            className="flex gap-4 flex-col text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter font-regular text-gray-900">
              <span className="text-medifly-teal">Experience</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-gradient"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span>healthcare</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl mx-auto">
              Connect with world-class medical specialists across Asia. Get expert diagnoses, 
              personalized treatment plans, and seamless care coordination — all from the comfort of your home.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="gap-4 bg-medifly-teal hover:bg-medifly-teal/90 text-white flex-1 h-14 text-base font-medium rounded-xl" 
              variant="default"
              onClick={handleConsultClick}
            >
              <Stethoscope className="w-5 h-5" />
              Consult Specialist
            </Button>
            <Button 
              size="lg" 
              className="gap-4 flex-1 h-14 text-base font-medium rounded-xl border-2 border-medifly-teal text-medifly-teal hover:bg-medifly-teal hover:text-white" 
              variant="outline"
              onClick={handleFindDoctorsClick}
            >
              <Users className="w-5 h-5" />
              Find Doctors
              <MoveRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 w-full max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-medifly-teal">500+</div>
              <div className="text-sm text-gray-600">Medical Specialists</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-medifly-teal">15+</div>
              <div className="text-sm text-gray-600">Countries Served</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-medifly-teal">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-medifly-teal">4.9★</div>
              <div className="text-sm text-gray-600">Patient Rating</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };