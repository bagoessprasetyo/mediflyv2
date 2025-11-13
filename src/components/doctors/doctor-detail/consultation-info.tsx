'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconCurrencyDollar,
  IconClock,
  IconVideo,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCalendar,
  IconStethoscope,
  IconCreditCard,
  IconShield,
  IconUser,
  IconCheck,
  IconInfoCircle
} from '@tabler/icons-react';

interface ConsultationInfoProps {
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    consultation_fee?: number;
    consultation_duration?: number;
    is_accepting_new_patients?: boolean;
    is_telehealth_available?: boolean;
    email?: string;
    phone?: string;
    languages?: string[];
  };
}

export function ConsultationInfo({ doctor }: ConsultationInfoProps) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Contact for pricing';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '30 min';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes} min`;
  };

  const estimatedCosts = {
    consultation: doctor.consultation_fee || 200,
    followUp: (doctor.consultation_fee || 200) * 0.75,
    telehealth: (doctor.consultation_fee || 200) * 0.8
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconStethoscope className="w-5 h-5" />
          Consultation Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pricing Section */}
        <div className="text-center space-y-3">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(doctor.consultation_fee)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDuration(doctor.consultation_duration)} consultation
            </div>
          </div>
          
          {/* Service Options */}
          <div className="grid gap-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <IconMapPin className="w-4 h-4 text-green-600" />
                <span>In-Person Visit</span>
              </div>
              <span className="font-medium">{formatCurrency(estimatedCosts.consultation)}</span>
            </div>
            
            {doctor.is_telehealth_available && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <IconVideo className="w-4 h-4 text-blue-600" />
                  <span>Telehealth</span>
                </div>
                <span className="font-medium">{formatCurrency(estimatedCosts.telehealth)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4 text-purple-600" />
                <span>Follow-up Visit</span>
              </div>
              <span className="font-medium">{formatCurrency(estimatedCosts.followUp)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Current Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconUser className="w-4 h-4" />
                <span className="text-sm">New Patients</span>
              </div>
              <Badge variant={doctor.is_accepting_new_patients ? "default" : "secondary"} className="text-xs">
                {doctor.is_accepting_new_patients ? (
                  <>
                    <IconCheck className="w-3 h-3 mr-1" />
                    Accepting
                  </>
                ) : (
                  'Not Accepting'
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconVideo className="w-4 h-4" />
                <span className="text-sm">Telehealth</span>
              </div>
              <Badge variant={doctor.is_telehealth_available ? "outline" : "secondary"} className="text-xs">
                {doctor.is_telehealth_available ? 'Available' : 'Not Available'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatDuration(doctor.consultation_duration)}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Languages */}
        {doctor.languages && doctor.languages.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Languages Spoken</h4>
            <div className="flex flex-wrap gap-1">
              {doctor.languages.map((language) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Payment & Insurance Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <IconCreditCard className="w-4 h-4" />
            Payment & Insurance
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCheck className="w-3 h-3 text-green-600" />
              <span>Most major insurance plans accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheck className="w-3 h-3 text-green-600" />
              <span>Cash, card, and HSA/FSA payments</span>
            </div>
            <div className="flex items-center gap-2">
              <IconShield className="w-3 h-3 text-blue-600" />
              <span>HIPAA compliant and secure</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Booking Actions */}
        <div className="space-y-3">
          {doctor.is_accepting_new_patients ? (
            <Button className="w-full" size="lg">
              <IconCalendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          ) : (
            <Button variant="outline" className="w-full" size="lg" disabled>
              <IconUser className="w-4 h-4 mr-2" />
              Not Accepting New Patients
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {doctor.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${doctor.phone}`}>
                  <IconPhone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </Button>
            )}
            {doctor.email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${doctor.email}`}>
                  <IconMail className="w-4 h-4 mr-1" />
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <IconInfoCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Important Information
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Please arrive 15 minutes early for your appointment</li>
                <li>• Bring a valid ID and insurance card</li>
                <li>• 24-hour cancellation policy applies</li>
                {doctor.is_telehealth_available && (
                  <li>• Telehealth appointments require stable internet connection</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extended version with more detailed pricing breakdown
export function DetailedConsultationInfo({ 
  doctor,
  acceptedInsurance,
  paymentMethods,
  cancellationPolicy 
}: ConsultationInfoProps & {
  acceptedInsurance?: string[];
  paymentMethods?: string[];
  cancellationPolicy?: string;
}) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Contact for pricing';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '30 min';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes} min`;
  };

  const estimatedCosts = {
    consultation: doctor.consultation_fee || 200,
    followUp: (doctor.consultation_fee || 200) * 0.75,
    telehealth: (doctor.consultation_fee || 200) * 0.8,
    urgentCare: (doctor.consultation_fee || 200) * 1.25
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconStethoscope className="w-5 h-5" />
          Consultation & Pricing
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Detailed Pricing Table */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(doctor.consultation_fee)}
            </div>
            <div className="text-sm text-muted-foreground">
              Standard {formatDuration(doctor.consultation_duration)} consultation
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Service Options</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center gap-2">
                  <IconMapPin className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">In-Person Consultation</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDuration(doctor.consultation_duration)} appointment
                    </div>
                  </div>
                </div>
                <span className="font-semibold">{formatCurrency(estimatedCosts.consultation)}</span>
              </div>

              {doctor.is_telehealth_available && (
                <div className="flex justify-between items-center p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <IconVideo className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Telehealth Consultation</div>
                      <div className="text-xs text-muted-foreground">
                        Video call appointment
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold">{formatCurrency(estimatedCosts.telehealth)}</span>
                </div>
              )}

              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center gap-2">
                  <IconClock className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Follow-up Visit</div>
                    <div className="text-xs text-muted-foreground">
                      Return patient consultation
                    </div>
                  </div>
                </div>
                <span className="font-semibold">{formatCurrency(estimatedCosts.followUp)}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Insurance & Payment */}
        {(acceptedInsurance || paymentMethods) && (
          <>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <IconShield className="w-4 h-4" />
                Insurance & Payment
              </h4>
              
              {acceptedInsurance && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Accepted Insurance:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {acceptedInsurance.map((insurance) => (
                      <div key={insurance} className="text-xs flex items-center gap-1">
                        <IconCheck className="w-3 h-3 text-green-600" />
                        {insurance}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {paymentMethods && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Payment Methods:</p>
                  <div className="flex flex-wrap gap-1">
                    {paymentMethods.map((method) => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Booking Actions */}
        <div className="space-y-3">
          {doctor.is_accepting_new_patients ? (
            <Button className="w-full" size="lg">
              <IconCalendar className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
          ) : (
            <Button variant="outline" className="w-full" size="lg" disabled>
              <IconUser className="w-4 h-4 mr-2" />
              Not Accepting New Patients
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {doctor.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${doctor.phone}`}>
                  <IconPhone className="w-4 h-4 mr-1" />
                  Call Office
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm">
              <IconInfoCircle className="w-4 h-4 mr-1" />
              More Info
            </Button>
          </div>
        </div>

        {/* Policy Information */}
        {cancellationPolicy && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <IconInfoCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Cancellation Policy
                </p>
                <p className="text-xs text-muted-foreground">
                  {cancellationPolicy}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}