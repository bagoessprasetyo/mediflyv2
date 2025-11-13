'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Calendar,
  Phone,
  Zap,
  AlertCircle,
  CheckCircle2,
  Heart,
  Clock3,
  CalendarDays,
  Users
} from 'lucide-react';

interface HospitalScheduleCardProps {
  operatingHours?: Record<string, string>;
  emergencyServices?: boolean;
  traumaLevel?: string;
  isActive?: boolean;
  phoneNumber?: string;
  emergencyPhone?: string;
}

export function HospitalScheduleCard({ 
  operatingHours, 
  emergencyServices, 
  traumaLevel, 
  isActive,
  phoneNumber,
  emergencyPhone 
}: HospitalScheduleCardProps) {
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = currentDate.toTimeString().substring(0, 5);

  // Check if currently open
  const isCurrentlyOpen = () => {
    if (!operatingHours || !operatingHours[currentDay]) {
      return false;
    }
    
    const todayHours = operatingHours[currentDay];
    if (todayHours.toLowerCase().includes('closed') || todayHours === '24/7') {
      return todayHours === '24/7';
    }

    const [openTime, closeTime] = todayHours.split('-').map(time => time.trim());
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const isOpen = isCurrentlyOpen();

  // Format hours for display
  const formatHours = (hours: string) => {
    if (hours === '24/7') return '24 Hours';
    if (hours.toLowerCase().includes('closed')) return 'Closed';
    return hours;
  };

  // Get days of week in order
  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  const dayLabels: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  // Current status
  const getStatusInfo = () => {
    if (emergencyServices) {
      return {
        status: 'Emergency Services Available 24/7',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Heart
      };
    } else if (isOpen) {
      return {
        status: 'Currently Open',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2
      };
    } else {
      return {
        status: 'Currently Closed',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Operating Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              <span className="font-medium">Current Status</span>
            </div>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.status}
            </Badge>
          </div>

          {/* Hours List */}
          {operatingHours && Object.keys(operatingHours).length > 0 ? (
            <div className="space-y-2">
              {daysOfWeek.map((day) => {
                const hours = operatingHours[day];
                const isToday = day === currentDay;
                
                return (
                  <div 
                    key={day} 
                    className={`flex items-center justify-between py-2 px-3 rounded ${
                      isToday ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`capitalize ${isToday ? 'font-medium text-blue-900' : ''}`}>
                      {dayLabels[day]}
                      {isToday && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
                    </span>
                    <span className={`text-sm ${isToday ? 'font-medium' : 'text-gray-600'}`}>
                      {hours ? formatHours(hours) : 'Not specified'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Operating hours not specified</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Services Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-600" />
            Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Emergency Status */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-900">Emergency Services</p>
                  <p className="text-sm text-red-700">
                    {emergencyServices ? 'Available 24/7' : 'Not Available'}
                  </p>
                </div>
              </div>
              <Badge className={emergencyServices ? 'bg-red-600' : 'bg-gray-400'}>
                {emergencyServices ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Trauma Level */}
            {traumaLevel && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-900">Trauma Level</span>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  {traumaLevel}
                </Badge>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="space-y-3">
              <Separator />
              <h4 className="font-medium text-gray-900">Emergency Contact</h4>
              
              {emergencyPhone ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Emergency Line</span>
                  </div>
                  <a 
                    href={`tel:${emergencyPhone}`}
                    className="text-red-600 font-medium hover:underline"
                  >
                    {emergencyPhone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Emergency</span>
                  </div>
                  <span className="text-red-600 font-bold">911</span>
                </div>
              )}

              {phoneNumber && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Main Line</span>
                  </div>
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {phoneNumber}
                  </a>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                size="sm"
                asChild
              >
                <a href="tel:911">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency (911)
                </a>
              </Button>
              
              {phoneNumber && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Hospital
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Schedule Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600" />
            Quick Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Current Time</span>
              </div>
              <span className="text-purple-800 font-mono">
                {currentTime}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Today</span>
              </div>
              <span className="text-blue-800 capitalize">
                {currentDay}
              </span>
            </div>

            {emergencyServices && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Always Available</span>
                </div>
                <p className="text-sm text-green-700">
                  Emergency services operate 24 hours a day, 7 days a week
                </p>
              </div>
            )}

            {!isActive && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This hospital is currently marked as inactive
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}