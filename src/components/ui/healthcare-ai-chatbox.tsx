'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PureMultimodalInput } from './multimodal-ai-chat-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { countries, getCitiesByCountry, formatLocationForSearch, type Country } from '@/data/locations';

type VisibilityType = 'public' | 'private' | 'unlisted' | string;

interface Attachment {
  url: string;
  name: string;
  contentType: string;
  size: number;
}

interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
}

interface HealthcareAIChatboxProps {
  className?: string;
  onSearchSubmit?: (query: string, location: string, city?: string) => void;
}

export function HealthcareAIChatbox({ 
  className,
  onSearchSubmit
}: HealthcareAIChatboxProps) {
  const router = useRouter();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatId] = useState('healthcare-search');

  const availableCities = selectedCountry ? getCitiesByCountry(selectedCountry) : [];

  const handleCountryChange = (countryValue: string) => {
    setSelectedCountry(countryValue);
    setSelectedCity(''); // Reset city when country changes
  };

  const handleSendMessage = useCallback(({ input, attachments }: { input: string; attachments: Attachment[] }) => {
    if (!input.trim()) return;

    const location = formatLocationForSearch(selectedCountry, selectedCity);
    
    if (onSearchSubmit) {
      onSearchSubmit(input, selectedCountry, selectedCity);
    } else {
      // Navigate to search page with params
      const searchParams = new URLSearchParams();
      searchParams.set('q', input.trim());
      
      if (selectedCountry) {
        searchParams.set('location', selectedCountry);
      }
      
      if (selectedCity) {
        searchParams.set('city', selectedCity);
      }
      
      router.push(`/search?${searchParams.toString()}`);
    }

    // Simulate processing for UX
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);

  }, [selectedCountry, selectedCity, onSearchSubmit, router]);

  const handleStopGenerating = useCallback(() => {
    setIsGenerating(false);
  }, []);

  const canSend = true;
  const messages: UIMessage[] = [];
  const selectedVisibilityType: VisibilityType = 'private';

  const popularCountries = countries.filter(country => country.popular);
  const otherCountries = countries.filter(country => !country.popular);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className || ''}`}>
      {/* Location Selection */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Country Selection */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 pointer-events-none">
            <Globe className="h-5 w-5" />
          </div>
          
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="h-12 pl-12 pr-4 text-base bg-white border-2 rounded-xl border-gray-300 hover:border-medifly-teal focus:border-medifly-teal transition-colors">
              <SelectValue placeholder="Select destination country" />
            </SelectTrigger>
            
            <SelectContent className="max-h-[300px]">
              {/* Popular Countries */}
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  Popular Destinations
                </div>
                {popularCountries.map((country: Country) => (
                  <SelectItem 
                    key={country.value} 
                    value={country.value}
                    className="py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
              
              {/* Other Countries */}
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  Other Countries
                </div>
                {otherCountries.map((country: Country) => (
                  <SelectItem 
                    key={country.value} 
                    value={country.value}
                    className="py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* City Selection */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 pointer-events-none">
            <MapPin className="h-5 w-5" />
          </div>
          
          <Select 
            value={selectedCity} 
            onValueChange={setSelectedCity}
            disabled={!selectedCountry}
          >
            <SelectTrigger className="h-12 pl-12 pr-4 text-base bg-white border-2 rounded-xl border-gray-300 hover:border-medifly-teal focus:border-medifly-teal transition-colors disabled:opacity-50">
              <SelectValue placeholder={selectedCountry ? "Select city (optional)" : "Select country first"} />
            </SelectTrigger>
            
            <SelectContent className="max-h-[300px]">
              {availableCities.length > 0 ? (
                <>
                  {/* Popular Cities */}
                  {availableCities.some(city => city.popular) && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                        Popular Cities
                      </div>
                      {availableCities
                        .filter(city => city.popular)
                        .map((city) => (
                          <SelectItem 
                            key={city.value} 
                            value={city.value}
                            className="py-2"
                          >
                            <span className="font-medium">{city.label}</span>
                          </SelectItem>
                        ))}
                    </div>
                  )}
                  
                  {/* Other Cities */}
                  {availableCities.some(city => !city.popular) && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                        Other Cities
                      </div>
                      {availableCities
                        .filter(city => !city.popular)
                        .map((city) => (
                          <SelectItem 
                            key={city.value} 
                            value={city.value}
                            className="py-2"
                          >
                            <span className="font-medium">{city.label}</span>
                          </SelectItem>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No cities available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* AI Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <PureMultimodalInput
          chatId={chatId}
          messages={messages}
          attachments={attachments}
          setAttachments={setAttachments}
          onSendMessage={handleSendMessage}
          onStopGenerating={handleStopGenerating}
          isGenerating={isGenerating}
          canSend={canSend}
          selectedVisibilityType={selectedVisibilityType}
          className="bg-white rounded-xl hover:shadow-md transition-shadow"
        />
      </motion.div>
      
      {/* Helper Text */}
      <motion.div 
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-sm text-gray-500">
          Describe your health concern and we'll help you find the right specialists and treatments
          {selectedCountry && (
            <span className="text-medifly-teal font-medium">
              {' '}in {countries.find(c => c.value === selectedCountry)?.label}
              {selectedCity && availableCities.find(c => c.value === selectedCity)?.label}
            </span>
          )}
        </p>
      </motion.div>
    </div>
  );
}