'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Award, 
  Users,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react';
import Link from 'next/link';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { name: 'Find Specialists', href: '/specialists' },
      { name: 'Browse Destinations', href: '/destinations' },
      { name: 'Medical Procedures', href: '/procedures' },
      { name: 'Second Opinions', href: '/second-opinions' },
      { name: 'Telehealth', href: '/telehealth' },
      { name: 'Cost Estimator', href: '/cost-estimator' }
    ]
  },
  {
    title: 'Support & Resources',
    links: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Patient Support', href: '/patient-support' },
      { name: 'Healthcare Guides', href: '/guides' },
      { name: 'Help Center', href: '/help' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partnerships', href: '/partnerships' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Patient Stories', href: '/testimonials' },
      { name: 'Health Blog', href: '/blog' }
    ]
  }
];

const certifications = [
  { name: 'HIPAA Compliant', icon: Shield },
  { name: 'ISO 27001', icon: Award },
  { name: 'JCI Partner', icon: Users }
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' }
];

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-premium space-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Brand Section */}
          <div className="space-content-sm max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-medifly-teal rounded-xl flex items-center justify-center">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">MediFly</div>
                <div className="text-sm text-gray-400">World-Class Healthcare</div>
              </div>
            </div>
            
            <p className="text-body text-gray-300">
              Empowering access to world-class healthcare through innovative technology 
              and personalized care coordination across Asia and beyond.
            </p>

            {/* Social Media */}
            <div className="space-y-4">
              <div className="text-small font-medium text-gray-400">Follow Our Journey</div>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-white/10 hover:bg-medifly-teal rounded-lg flex items-center justify-center transition-all duration-200 premium-hover-scale"
                    >
                      <Icon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold text-white text-base">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-small text-gray-400 hover:text-medifly-teal transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="max-w-xl mx-auto text-center space-content-sm">
            <h3 className="text-subsection-title text-white">Stay Connected</h3>
            <p className="text-body-secondary text-gray-400">
              Get healthcare insights and exclusive updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent transition-all"
              />
              <Button className="btn-premium-primary">
                Subscribe
              </Button>
            </div>
            <p className="text-xs-muted text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-white/10" />
      <div className="container-premium py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-small text-gray-400">
              © 2024 MediFly. All rights reserved.
            </p>
          </div>

          {/* Certifications */}
          <div className="flex items-center gap-3">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <Badge 
                  key={cert.name}
                  variant="outline" 
                  className="border-white/20 text-gray-400 hover:border-medifly-teal hover:text-medifly-teal transition-colors duration-200"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {cert.name}
                </Badge>
              );
            })}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-small">
            <Link href="/privacy" className="text-gray-400 hover:text-medifly-teal transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-medifly-teal transition-colors duration-200">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}