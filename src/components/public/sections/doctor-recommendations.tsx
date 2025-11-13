'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const topDoctors = [
  {
    id: 'dr-sarah-wong',
    name: 'Dr. Sarah Wong',
    specialty: 'Cardiothoracic Surgery',
    hospital: 'Singapore General Hospital',
    experience: '15+ Years Experience',
    achievements: ['Heart Transplant Pioneer', 'Robotic Surgery Expert', '500+ Complex Procedures'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-sarah-wong'
  },
  {
    id: 'dr-michael-chen',
    name: 'Dr. Michael Chen',
    specialty: 'Neurosurgery',
    hospital: 'Mount Elizabeth Hospital',
    experience: '18+ Years Experience',
    achievements: ['Brain Tumor Specialist', 'Minimally Invasive Techniques', '1000+ Successful Surgeries'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-michael-chen'
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'Oncology',
    hospital: 'Apollo Hospitals, Mumbai',
    experience: '12+ Years Experience',
    achievements: ['Cancer Research Leader', 'Immunotherapy Expert', '2000+ Patients Treated'],
    image: 'https://images.unsplash.com/photo-1594824226119-7b2245c9e6a5?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-priya-sharma'
  },
  {
    id: 'dr-james-kim',
    name: 'Dr. James Kim',
    specialty: 'Orthopedic Surgery',
    hospital: 'Samsung Medical Center, Seoul',
    experience: '14+ Years Experience',
    achievements: ['Sports Medicine Expert', 'Joint Replacement Specialist', '800+ Knee Surgeries'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-james-kim'
  },
  {
    id: 'dr-lisa-thailand',
    name: 'Dr. Lisa Tanaka',
    specialty: 'Fertility & Reproductive Medicine',
    hospital: 'Bumrungrad International Hospital',
    experience: '16+ Years Experience',
    achievements: ['IVF Success Rate 85%', 'Genetic Counseling Expert', '3000+ Successful Pregnancies'],
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-lisa-tanaka'
  },
  {
    id: 'dr-ahmed-istanbul',
    name: 'Dr. Ahmed Özkan',
    specialty: 'Ophthalmology',
    hospital: 'Acibadem Hospitals, Istanbul',
    experience: '20+ Years Experience',
    achievements: ['LASIK Pioneer', 'Retinal Surgery Expert', '5000+ Vision Corrections'],
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1470&auto=format&fit=crop',
    href: '/doctors/dr-ahmed-ozkan'
  }
];

export function DoctorRecommendations() {
  return (
    <div className="w-full pt-20 lg:pt-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge 
                variant="secondary"
                className="bg-medifly-light-blue text-medifly-teal border-0 font-medium"
              >
                TOP SPECIALISTS
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-4xl font-medium text-left text-gray-900">
                Meet World-Class Medical Specialists
              </h2>
              <p className="text-lg max-w-3xl leading-relaxed tracking-tight text-gray-600 text-left">
                Connect with renowned specialists who combine cutting-edge expertise with compassionate care. 
                Each doctor has been carefully selected for their exceptional outcomes and patient satisfaction.
              </p>
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topDoctors.map((doctor) => (
              <Link key={doctor.id} href={doctor.href} className="group block">
                <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:border-medifly-teal/30 transition-all duration-300 hover:shadow-lg bg-white">
                  {/* Doctor Photo */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-gradient-to-br from-medifly-light-blue/20 to-medifly-teal/10">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-medifly-teal transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-medifly-teal font-medium text-sm">
                        {doctor.specialty}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700 text-sm font-medium">
                        🏥 {doctor.hospital}
                      </p>
                      <p className="text-gray-600 text-sm">
                        📅 {doctor.experience}
                      </p>
                    </div>

                    {/* Key Achievements */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {doctor.achievements.slice(0, 2).map((achievement, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-medifly-teal text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View Profile
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8">
            <Button 
              asChild
              size="lg" 
              className="bg-medifly-teal hover:bg-medifly-teal/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="/doctors" className="inline-flex items-center gap-2">
                Browse All Specialists
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}