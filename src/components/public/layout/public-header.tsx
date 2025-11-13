'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Stethoscope, Phone, Globe, User } from 'lucide-react';
import Link from 'next/link';

const navigation = [
  { name: 'Find Specialists', href: '/specialists' },
  { name: 'Browse Destinations', href: '/destinations' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Get Inspired', href: '/inspired' },
  { name: 'About', href: '/about' },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-medifly-teal rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-medifly-dark">MediFly</span>
              <span className="text-xs text-medifly-gray hidden sm:block">World-Class Healthcare</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-medifly-gray hover:text-medifly-teal font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* 24/7 Support Badge - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                <Phone className="h-3 w-3 mr-1" />
                24/7 Support
              </Badge>
            </div>

            {/* Language Selector - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2">
              <Globe className="h-4 w-4 text-medifly-gray" />
              <span className="text-sm text-medifly-gray">EN</span>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild variant="ghost" className="text-medifly-gray hover:text-medifly-teal">
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button asChild className="gradient-teal text-white shadow-soft hover:shadow-lifted">
                <Link href="/get-started">
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-medifly-gray" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-medifly-teal rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-medifly-dark">MediFly</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-4 mb-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-lg text-medifly-dark hover:text-medifly-teal font-medium py-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">24/7 Support Available</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="w-full justify-center">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full justify-center gradient-teal text-white shadow-soft"
                    >
                      <Link href="/get-started" onClick={() => setIsOpen(false)}>
                        Get Started Free
                      </Link>
                    </Button>
                  </div>

                  {/* Language and Region */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-medifly-gray">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>English</span>
                      </div>
                      <span>🇺🇸 USD</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}