'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconCalendar,
  IconClock,
  IconVideo,
  IconMapPin,
  IconCheck,
  IconX,
  IconUser,
  IconStethoscope,
  IconPhone
} from '@tabler/icons-react';
import { useDoctorAvailability } from '@/lib/queries/doctors';

interface AvailabilityCalendarProps {
  doctorId: string;
  doctor?: {
    is_telehealth_available?: boolean;
    is_accepting_new_patients?: boolean;
  };
}

interface AvailabilityItemProps {
  day: string;
  dayIndex: number;
  schedule: Array<{
    id: string;
    start_time: string;
    end_time: string;
    location_type: 'IN_PERSON' | 'TELEHEALTH' | 'BOTH';
    hospital?: {
      name: string;
      city?: string;
    };
    is_active: boolean;
  }>;
}

function AvailabilityItem({ day, dayIndex, schedule }: AvailabilityItemProps) {
  const isToday = new Date().getDay() === dayIndex;
  const activeSchedule = schedule.filter(s => s.is_active);
  

  return (
    <div className={`flex justify-between items-center py-3 px-4 rounded-lg border ${
      isToday ? 'border-primary bg-primary/5' : 'border-border'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          activeSchedule.length > 0 ? 'bg-green-500' : 'bg-gray-300'
        }`} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
              {day}
            </span>
            {isToday && (
              <Badge variant="secondary" className="text-xs">
                Today
              </Badge>
            )}
          </div>
          
          {activeSchedule.length > 0 ? (
            <div className="space-y-1">
              {activeSchedule.map((slot) => (
                <div key={slot.id} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className={`text-xs ${getLocationColor(slot.location_type)}`}>
                    {getLocationIcon(slot.location_type)}
                    <span className="ml-1">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </span>
                  </Badge>
                  {slot.hospital && (
                    <span className="text-muted-foreground">
                      @ {slot.hospital.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unavailable</span>
          )}
        </div>
      </div>

      <div className="flex items-center">
        {activeSchedule.length > 0 ? (
          <IconCheck className="w-4 h-4 text-green-500" />
        ) : (
          <IconX className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}

// Helper functions
const getLocationIcon = (locationType: string) => {
  switch (locationType) {
    case 'TELEHEALTH':
      return <IconVideo className="w-3 h-3" />;
    case 'IN_PERSON':
      return <IconMapPin className="w-3 h-3" />;
    case 'BOTH':
      return <IconStethoscope className="w-3 h-3" />;
    default:
      return <IconMapPin className="w-3 h-3" />;
  }
};

const getLocationColor = (locationType: string) => {
  switch (locationType) {
    case 'TELEHEALTH':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/20';
    case 'IN_PERSON':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/20';
    case 'BOTH':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/20';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800/20';
  }
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

export function AvailabilityCalendar({ doctorId, doctor }: AvailabilityCalendarProps) {
  const { data: availability, isLoading, error } = useDoctorAvailability(doctorId);

  const daysOfWeek = [
    { name: 'Sunday', index: 0 },
    { name: 'Monday', index: 1 },
    { name: 'Tuesday', index: 2 },
    { name: 'Wednesday', index: 3 },
    { name: 'Thursday', index: 4 },
    { name: 'Friday', index: 5 },
    { name: 'Saturday', index: 6 }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="w-5 h-5" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day.name} className="flex justify-between items-center py-3 px-4 rounded-lg border animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="h-4 w-16 bg-gray-300 rounded" />
                </div>
                <div className="h-4 w-4 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group availability by day of week
  const scheduleByDay = daysOfWeek.map(day => {
    const daySchedule = availability?.filter(slot => slot.day_of_week === day.index) || [];
    return {
      ...day,
      schedule: daySchedule
    };
  });

  // Calculate stats
  const availableDays = scheduleByDay.filter(day => day.schedule.some(s => s.is_active)).length;
  const teleHealthSlots = availability?.filter(slot => 
    slot.location_type === 'TELEHEALTH' && slot.is_active
  ).length || 0;
  const inPersonSlots = availability?.filter(slot => 
    slot.location_type === 'IN_PERSON' && slot.is_active
  ).length || 0;
  const totalSlots = availability?.filter(slot => slot.is_active).length || 0;

  // Get next available time slot
  const getNextAvailableSlot = () => {
    const now = new Date();
    const today = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    // Look for slots today after current time, then subsequent days
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today + i) % 7;
      const daySchedule = scheduleByDay.find(d => d.index === dayIndex);
      
      if (daySchedule) {
        const availableSlots = daySchedule.schedule.filter(slot => {
          if (i === 0) { // Today
            return slot.is_active && slot.start_time > currentTime;
          }
          return slot.is_active;
        });

        if (availableSlots.length > 0) {
          const earliestSlot = availableSlots.sort((a, b) => a.start_time.localeCompare(b.start_time))[0];
          return {
            day: daySchedule.name,
            slot: earliestSlot,
            isToday: i === 0
          };
        }
      }
    }
    return null;
  };

  const nextSlot = getNextAvailableSlot();

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="w-5 h-5" />
              Availability
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {availableDays}/7 Days
              </Badge>
              {totalSlots > 0 && (
                <Badge variant="outline" className="text-xs">
                  {totalSlots} Slots
                </Badge>
              )}
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex flex-wrap gap-2">
            {doctor?.is_accepting_new_patients && (
              <Badge variant="default" className="text-xs bg-green-600">
                <IconUser className="w-3 h-3 mr-1" />
                Accepting Patients
              </Badge>
            )}
            {teleHealthSlots > 0 && (
              <Badge variant="outline" className="text-xs text-blue-600">
                <IconVideo className="w-3 h-3 mr-1" />
                Telehealth Available
              </Badge>
            )}
            {inPersonSlots > 0 && (
              <Badge variant="outline" className="text-xs text-green-600">
                <IconMapPin className="w-3 h-3 mr-1" />
                In-Person Available
              </Badge>
            )}
          </div>

          {/* Next Available */}
          {nextSlot && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-xs text-primary font-medium mb-1">Next Available</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {nextSlot.isToday ? 'Today' : nextSlot.day}
                </span>
                <Badge variant="outline" className={`text-xs ${getLocationColor(nextSlot.slot.location_type)}`}>
                  {getLocationIcon(nextSlot.slot.location_type)}
                  <span className="ml-1">
                    {formatTime(nextSlot.slot.start_time)}
                  </span>
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-1">
        {error ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Unable to load availability</p>
          </div>
        ) : totalSlots === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No availability scheduled</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scheduleByDay.map((day) => (
              <AvailabilityItem
                key={day.name}
                day={day.name}
                dayIndex={day.index}
                schedule={day.schedule}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {totalSlots > 0 && doctor?.is_accepting_new_patients && (
          <div className="pt-4 border-t space-y-2">
            <Button className="w-full">
              <IconCalendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <div className="grid grid-cols-2 gap-2">
              {teleHealthSlots > 0 && (
                <Button variant="outline" size="sm">
                  <IconVideo className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
              )}
              <Button variant="outline" size="sm">
                <IconPhone className="w-4 h-4 mr-2" />
                Call Office
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}