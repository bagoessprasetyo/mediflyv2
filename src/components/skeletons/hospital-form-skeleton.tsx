'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function HospitalFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" /> {/* "Basic Information" title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hospital Name and Slug row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>

          {/* Type and Bed Count row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" /> {/* "Contact Information" title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email, Phone, Website row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" /> {/* "Address" title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Street Address */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* City, State, Zip, Country row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-8" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-10" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>

          {/* Latitude and Longitude row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-18" /> {/* "Settings" title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trauma Level and Established row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>

          <Separator />

          {/* Checkboxes */}
          <div className="flex flex-col space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox */}
                <Skeleton className="h-4 w-32" /> {/* Label */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Section Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" /> {/* "Media & Images" title */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hospital Logo */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8">
              <div className="text-center space-y-3">
                <Skeleton className="h-12 w-12 rounded mx-auto" /> {/* Upload icon */}
                <Skeleton className="h-4 w-32 mx-auto" /> {/* Upload text */}
                <Skeleton className="h-8 w-24 mx-auto" /> {/* Upload button */}
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" /> {/* Label */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8">
              <div className="text-center space-y-3">
                <Skeleton className="h-12 w-12 rounded mx-auto" /> {/* Upload icon */}
                <Skeleton className="h-4 w-48 mx-auto" /> {/* Upload text */}
                <Skeleton className="h-8 w-32 mx-auto" /> {/* Upload button */}
              </div>
            </div>
          </div>

          {/* Virtual Tour URL */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
            <Skeleton className="h-3 w-64" /> {/* Description text */}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Facilities Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" /> {/* "Hospital Facilities" title */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" /> {/* Template title */}
              <Skeleton className="h-8 w-8 rounded" /> {/* Close button */}
            </div>
            <Skeleton className="h-3 w-64" /> {/* Template description */}
            <Skeleton className="h-8 w-32" /> {/* Apply button */}
          </div>

          {/* Selected Facilities */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" /> {/* Selected facilities title */}
              <Skeleton className="h-8 w-20" /> {/* Clear all button */}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-1 px-2 py-1 border rounded">
                  <Skeleton className="h-3 w-3 rounded" /> {/* Icon */}
                  <Skeleton className="h-3 w-16" /> {/* Name */}
                  <Skeleton className="h-3 w-3 rounded" /> {/* Remove X */}
                </div>
              ))}
            </div>
          </div>

          {/* Facility Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" /> {/* Available facilities title */}
              <Skeleton className="h-8 w-20" /> {/* Select all button */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="border-2 border-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" /> {/* Icon */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" /> {/* Name */}
                        <Skeleton className="h-6 w-6 rounded-full" /> {/* Check icon */}
                      </div>
                      <Skeleton className="h-3 w-32" /> {/* Description */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-20" /> {/* Cancel button */}
        <Skeleton className="h-10 w-32" /> {/* Save button */}
      </div>
    </div>
  );
}

export function HospitalFormLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded" /> {/* Back button */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Subtitle */}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      <HospitalFormSkeleton />
    </div>
  );
}