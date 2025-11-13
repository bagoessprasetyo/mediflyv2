'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope } from 'lucide-react';

interface HealthConcernInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function HealthConcernInput({ 
  value, 
  onChange, 
  placeholder = "Describe your health concern... (e.g., persistent headaches, back pain, skin condition)" 
}: HealthConcernInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`absolute left-4 top-4 z-10 transition-colors duration-200 ${
        isFocused ? 'text-medifly-teal' : 'text-gray-400'
      }`}>
        <Stethoscope className="h-5 w-5" />
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          min-h-[120px] pl-12 pr-4 py-4 text-base
          bg-white border-2 rounded-xl shadow-soft
          transition-all duration-300 ease-in-out
          placeholder:text-gray-400 
          focus:border-medifly-teal focus:shadow-lifted 
          hover:shadow-soft
          resize-none
        `}
        rows={4}
      />
      
      {/* Character count */}
      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
        {value.length}/500
      </div>
    </div>
  );
}