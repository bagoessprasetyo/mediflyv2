import * as React from 'react';
import { HealthcareCard } from './card-22';

interface Hospital {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  emergencyServices: boolean;
  traumaLevel?: string;
  address: string;
  phone: string;
  website?: string;
  specialties: string[];
  similarity: number;
  images?: string[];
  consultationFee?: number;
  description?: string;
}

interface HospitalCardProps {
  hospital: Hospital;
  onBookClick?: () => void;
  className?: string;
}

export const HospitalCard22 = ({ hospital, onBookClick, className }: HospitalCardProps) => {
  // Default hospital images if none provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
  ];

  // Generate tags from hospital data
  const tags = [];
  if (hospital.emergencyServices) tags.push('Emergency 24/7');
  if (hospital.traumaLevel) tags.push(`Level ${hospital.traumaLevel} Trauma`);
  if (hospital.specialties.length > 0) tags.push(hospital.specialties[0]);
  if (tags.length === 0) tags.push(hospital.type);

  // Generate description if not provided
  const description = hospital.description || 
    `${hospital.name} is a ${hospital.type.toLowerCase()} located in ${hospital.city}, ${hospital.state}. ` +
    `Specializing in ${hospital.specialties.slice(0, 2).join(' and ')}, we provide excellent healthcare services with a ${hospital.rating}-star rating.`;

  // Format operating info
  const operatingInfo = hospital.emergencyServices ? 'Open 24/7' : 'Standard Hours';

  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      // Default action - could navigate to hospital detail page
      console.log('Book appointment at:', hospital.name);
    }
  };

  return (
    <HealthcareCard
      images={hospital.images || defaultImages}
      tags={tags}
      rating={hospital.rating}
      title={hospital.name}
      dateRange={operatingInfo}
      hostType={hospital.type}
      isTopRated={hospital.rating >= 4.5}
      description={description}
      pricePerNight={hospital.consultationFee || 0}
      onBookClick={handleBookClick}
      actionLabel="Book Consultation"
      className={className}
    />
  );
};