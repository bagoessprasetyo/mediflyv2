'use client';

import { useState } from 'react';
import { Star, MapPin, Phone, Globe, Clock, Users, Heart, ExternalLink, Calendar, Shield, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium';

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
}

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
}

interface SearchResultsProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  query: string;
  location?: string;
  filters: any;
}

export function SearchResults({ hospitals, doctors, query, location, filters }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors'>('hospitals');

  if (hospitals.length === 0 && doctors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-subsection-title text-gray-900">
            No Results Found
          </h3>
          <p className="text-body-secondary text-gray-600 max-w-md mx-auto">
            We couldn't find any hospitals or doctors matching your search criteria. 
            Try broadening your search or ask Aira for suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Tab Navigation */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'hospitals'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Hospitals</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'hospitals' ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
              }`}>
                {hospitals.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'doctors'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Specialists</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'doctors' ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
              }`}>
                {doctors.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Hospital Results */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}

      {/* Doctor Results */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors cursor-pointer truncate group-hover:text-teal-600">
                  {hospital.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{hospital.type}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{hospital.rating}</span>
                    <span className="text-xs text-gray-500">({hospital.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{hospital.city}, {hospital.state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            {hospital.emergencyServices && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                <Zap className="h-3 w-3" />
                Emergency
              </span>
            )}
            {hospital.traumaLevel && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Shield className="h-3 w-3" />
                Level {hospital.traumaLevel} Trauma
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-4">
        <div className="space-y-4">{/* Content continues here */}

          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{hospital.address}</span>
              </div>
              {hospital.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{hospital.phone}</span>
                </div>
              )}
              {hospital.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1">
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            
            {/* Specialties */}
            {hospital.specialties.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Specialties
                </div>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {specialty}
                    </span>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      +{hospital.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modern Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" size="sm" className="flex-1 border-gray-300 hover:border-gray-400">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/20">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const primarySpecialty = doctor.specialties.find(s => s.isPrimary) || doctor.specialties[0];
  const primaryHospital = doctor.hospitals.find(h => h.isPrimary) || doctor.hospitals[0];

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 pb-4">
        <div className="flex gap-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              {doctor.profileImage ? (
                <img 
                  src={doctor.profileImage} 
                  alt={`Dr. ${doctor.lastName}`}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <Users className="h-8 w-8 text-white" />
              )}
            </div>
            {primarySpecialty?.boardCertified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate group-hover:text-blue-600">
                  Dr. {doctor.firstName} {doctor.lastName}
                  {doctor.title && <span className="text-sm text-gray-500 ml-1 font-normal">{doctor.title}</span>}
                </h3>
                {primarySpecialty && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {primarySpecialty.name}
                    {primarySpecialty.boardCertified && (
                      <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Board Certified
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {doctor.yearsOfExperience}+ years
                </div>
                {doctor.consultationFee && (
                  <div className="text-sm text-gray-600 mt-1">
                    From ${doctor.consultationFee}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-4">
        <div className="space-y-4">{/* Content continues here */}

          {/* Hospital Affiliation */}
          {primaryHospital && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <span className="font-medium">{primaryHospital.name}</span>
                <span className="text-gray-500"> • {primaryHospital.city}</span>
                {primaryHospital.department && (
                  <div className="text-xs text-gray-500 mt-1">{primaryHospital.department}</div>
                )}
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
              doctor.acceptingNewPatients 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${doctor.acceptingNewPatients ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {doctor.acceptingNewPatients ? 'Accepting new patients' : 'Not accepting patients'}
            </div>
            {doctor.telehealth && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Zap className="h-3 w-3" />
                Telehealth available
              </div>
            )}
          </div>

          {/* Additional Specialties */}
          {doctor.specialties.length > 1 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Other Specialties
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.slice(1, 4).map((specialty, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {specialty.name}
                  </span>
                ))}
                {doctor.specialties.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    +{doctor.specialties.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Modern Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" size="sm" className="flex-1 border-gray-300 hover:border-gray-400">
              <Users className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
              <Calendar className="h-4 w-4 mr-2" />
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}