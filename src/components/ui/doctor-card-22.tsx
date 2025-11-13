import * as React from 'react';
import { HealthcareCard } from './card-22';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  profileImage?: string;
  yearsOfExperience: number;
  consultationFee?: number;
  acceptingNewPatients: boolean;
  telehealth: boolean;
  specialties: Array<{
    name: string;
    category: string;
    isPrimary: boolean;
    boardCertified: boolean;
    yearsInSpecialty?: number;
  }>;
  hospitals: Array<{
    id: string;
    name: string;
    city: string;
    isPrimary: boolean;
    positionTitle?: string;
    department?: string;
  }>;
  images?: string[];
  rating?: number;
  description?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick?: () => void;
  className?: string;
}

export const DoctorCard22 = ({ doctor, onBookClick, className }: DoctorCardProps) => {
  // Default doctor/clinic images if none provided
  const defaultImages = [
    doctor.profileImage || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2940&auto=format&fit=crop'
  ];

  // Generate tags from doctor data
  const tags = [];
  if (doctor.acceptingNewPatients) tags.push('Accepting Patients');
  if (doctor.telehealth) tags.push('Telehealth Available');
  if (doctor.specialties.length > 0) {
    const primarySpecialty = doctor.specialties.find(s => s.isPrimary) || doctor.specialties[0];
    tags.push(primarySpecialty.name);
    if (primarySpecialty.boardCertified) tags.push('Board Certified');
  }

  // Generate doctor full name with title
  const fullName = `${doctor.title} ${doctor.firstName} ${doctor.lastName}`;

  // Get primary specialty for display
  const primarySpecialty = doctor.specialties.find(s => s.isPrimary) || doctor.specialties[0];
  const specialtyName = primarySpecialty?.name || 'General Medicine';

  // Get primary hospital for display
  const primaryHospital = doctor.hospitals.find(h => h.isPrimary) || doctor.hospitals[0];
  const hospitalInfo = primaryHospital ? primaryHospital.name : 'Multiple Locations';

  // Generate description if not provided
  const description = doctor.description || 
    `${fullName} is a ${specialtyName.toLowerCase()} specialist with ${doctor.yearsOfExperience} years of experience. ` +
    `${primaryHospital ? `Practicing at ${primaryHospital.name}` : 'Available at multiple locations'}, ` +
    `${doctor.acceptingNewPatients ? 'currently accepting new patients' : 'limited availability'}.`;

  // Calculate rating (use provided rating or generate from experience)
  const rating = doctor.rating || Math.min(4.8, 4.0 + (doctor.yearsOfExperience / 20));

  // Format availability
  const availability = doctor.acceptingNewPatients ? 'Accepting New Patients' : 'Limited Availability';

  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      // Default action - could navigate to doctor booking page
      console.log('Book appointment with:', fullName);
    }
  };

  return (
    <HealthcareCard
      images={doctor.images || defaultImages}
      tags={tags.slice(0, 3)} // Limit to 3 tags for clean display
      rating={Number(rating.toFixed(1))}
      title={fullName}
      dateRange={availability}
      hostType={specialtyName}
      isTopRated={rating >= 4.5}
      description={description}
      pricePerNight={doctor.consultationFee || 0}
      onBookClick={handleBookClick}
      actionLabel="Book Appointment"
      className={className}
    />
  );
};