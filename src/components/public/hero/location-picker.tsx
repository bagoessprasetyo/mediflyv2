'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Popular medical destinations
const destinations = [
  { value: 'malaysia', label: 'Malaysia', flag: '🇲🇾', popular: true },
  { value: 'singapore', label: 'Singapore', flag: '🇸🇬', popular: true },
  { value: 'thailand', label: 'Thailand', flag: '🇹🇭', popular: true },
  { value: 'india', label: 'India', flag: '🇮🇳', popular: true },
  { value: 'turkey', label: 'Turkey', flag: '🇹🇷', popular: true },
  { value: 'south_korea', label: 'South Korea', flag: '🇰🇷', popular: true },
  { value: 'philippines', label: 'Philippines', flag: '🇵🇭', popular: false },
  { value: 'vietnam', label: 'Vietnam', flag: '🇻🇳', popular: false },
  { value: 'indonesia', label: 'Indonesia', flag: '🇮🇩', popular: false },
  { value: 'japan', label: 'Japan', flag: '🇯🇵', popular: false },
  { value: 'uae', label: 'United Arab Emirates', flag: '🇦🇪', popular: false },
  { value: 'taiwan', label: 'Taiwan', flag: '🇹🇼', popular: false },
];

export function LocationPicker({ 
  value, 
  onChange, 
  placeholder = "Select your location or preferred country" 
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredDestinations = destinations.filter(dest =>
    dest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularDestinations = filteredDestinations.filter(dest => dest.popular);
  const otherDestinations = filteredDestinations.filter(dest => !dest.popular);

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 pointer-events-none">
        <MapPin className="h-5 w-5" />
      </div>
      
      <Select value={value} onValueChange={onChange} onOpenChange={setIsOpen}>
        <SelectTrigger 
          className={`
            h-16 pl-12 pr-4 text-base
            bg-white border-2 rounded-xl shadow-soft
            transition-all duration-300 ease-in-out
            hover:shadow-soft focus:border-medifly-teal focus:shadow-lifted
            ${isOpen ? 'border-medifly-teal shadow-lifted' : ''}
          `}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent className="w-[--radix-select-trigger-width] max-h-[300px]">
          {/* Search Input */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
          </div>
          
          {/* Popular Destinations */}
          {popularDestinations.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                Popular Destinations
              </div>
              {popularDestinations.map((destination) => (
                <SelectItem 
                  key={destination.value} 
                  value={destination.value}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{destination.flag}</span>
                    <span className="font-medium">{destination.label}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          )}
          
          {/* Other Destinations */}
          {otherDestinations.length > 0 && (
            <div>
              {popularDestinations.length > 0 && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  Other Countries
                </div>
              )}
              {otherDestinations.map((destination) => (
                <SelectItem 
                  key={destination.value} 
                  value={destination.value}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{destination.flag}</span>
                    <span className="font-medium">{destination.label}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          )}
          
          {filteredDestinations.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-500">
              No countries found matching "{searchQuery}"
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}