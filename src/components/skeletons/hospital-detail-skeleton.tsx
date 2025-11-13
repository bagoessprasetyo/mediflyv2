'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function HospitalDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="relative pt-8 pb-4 px-6">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-lg" />
            
            {/* Content overlay */}
            <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm relative z-10">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Back button */}
                  <div className="absolute -top-16 left-0 flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Hospital Avatar */}
                  <div className="relative flex-shrink-0">
                    <Skeleton className="w-28 h-28 lg:w-36 lg:h-36 rounded-full" />
                    <Skeleton className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" />
                  </div>

                  {/* Hospital Information */}
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-80" /> {/* Hospital name */}
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-18 rounded-full" />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="text-center">
                            <Skeleton className="h-8 w-12 mx-auto mb-2" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>

                      {/* Location & Contact */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Skeleton className="h-5 w-5 mt-0.5" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 min-w-fit">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-36" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-12">
          {/* Tabs Skeleton */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-1">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 rounded" />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Hospital Information Card */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact info */}
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        ))}
                      </div>

                      {/* Stats grid */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                              <Skeleton className="h-8 w-8 mx-auto mb-2" />
                              <Skeleton className="h-4 w-16 mx-auto" />
                            </div>
                          ))}
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Skeleton className="h-8 w-16 mx-auto mb-2" />
                          <Skeleton className="h-4 w-24 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Team Preview */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <div className="flex gap-1">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Media Gallery */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-28" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="aspect-video w-full rounded-lg" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Schedule Card */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>

                    {/* Hours List */}
                    <div className="space-y-2">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Services */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-36" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HospitalDetailPageSkeleton() {
  return (
    <div className="container mx-auto">
      <HospitalDetailSkeleton />
    </div>
  );
}