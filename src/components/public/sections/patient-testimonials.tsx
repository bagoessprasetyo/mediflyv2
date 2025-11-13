'use client';

import { motion } from "motion/react";
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { Badge } from '@/components/ui/badge';

const healthcareTestimonials = [
  {
    text: "The cardiac surgery in Bangkok saved my life. World-class specialists, advanced technology, and costs 70% lower than home. The care exceeded all expectations.",
    image: "https://images.unsplash.com/photo-1594824226119-7b2245c9e6a5?q=80&w=150&auto=format&fit=crop",
    name: "Sarah M.",
    role: "Heart Surgery Patient • Bangkok",
  },
  {
    text: "Knee replacement in Malaysia transformed my life. State-of-the-art robotic surgery, excellent rehabilitation, and I'm back to playing tennis at 62!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    name: "David L.",
    role: "Orthopedic Patient • Kuala Lumpur",
  },
  {
    text: "After years of failed fertility treatments, Mumbai specialists helped us have our miracle baby. The AI matching found the perfect doctor for our case.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    name: "Maria R.",
    role: "IVF Success • Mumbai",
  },
  {
    text: "LASIK surgery in Istanbul was flawless. Latest technology, expert surgeon, perfect 20/20 vision results. Cost less than surgery alone back home.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    name: "James K.",
    role: "Eye Surgery • Istanbul",
  },
  {
    text: "Korean plastic surgeons' precision is unmatched. Facial reconstruction after accident restored my confidence with natural-looking, remarkable results.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=150&auto=format&fit=crop",
    name: "Emily Chen",
    role: "Reconstructive Surgery • Seoul",
  },
  {
    text: "Complex spinal surgery in Singapore exceeded expectations. Robotic technology, expert team, half the recovery time. My health investment paid off completely.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    name: "Robert Singh",
    role: "Spinal Surgery • Singapore",
  },
  {
    text: "Cancer treatment in Thailand combined advanced immunotherapy with compassionate care. The medical team guided me to full recovery with hope and expertise.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
    name: "Lisa Thompson",
    role: "Oncology Patient • Bangkok",
  },
  {
    text: "Dental implants in Malaysia exceeded expectations. Modern facility, skilled specialists, and my smile has never looked better. Saved thousands on treatment.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=150&auto=format&fit=crop",
    name: "Michael Johnson",
    role: "Dental Surgery • Kuala Lumpur",
  },
  {
    text: "Neurosurgery in Singapore was life-changing. Brain tumor removal by expert surgeons using latest techniques. Complete recovery and renewed hope.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop",
    name: "Amanda Rivera",
    role: "Brain Surgery • Singapore",
  },
];

// Split testimonials into columns
const firstColumn = healthcareTestimonials.slice(0, 3);
const secondColumn = healthcareTestimonials.slice(3, 6);
const thirdColumn = healthcareTestimonials.slice(6, 9);

export function PatientTestimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-4xl mx-auto mb-16"
          >
            <div className="flex justify-center mb-6">
              <Badge 
                variant="secondary"
                className="bg-medifly-light-blue text-medifly-teal border-0 font-medium"
              >
                PATIENT SUCCESS STORIES
              </Badge>
            </div>

            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-6 text-center leading-tight">
              Transforming Lives Through Quality Healthcare
            </h2>
            <p className="text-lg text-gray-600 text-center leading-relaxed max-w-3xl">
              Real stories from patients who found world-class healthcare through our platform.
              Each journey represents hope, healing, and the power of accessible medical excellence.
            </p>
          </motion.div>

          {/* Testimonials Columns */}
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-20 pt-16 border-t border-gray-200">
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">150K+</div>
              <div className="text-gray-600 font-medium">Patients Served</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">4.9★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl lg:text-4xl font-bold text-medifly-teal tracking-tight">$2M+</div>
              <div className="text-gray-600 font-medium">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}