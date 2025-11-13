'use client';

import { IconUsers, IconBuildingHospital, IconStethoscope, IconTrendingUp, IconTrendingDown, IconCalendar } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFacilities } from "@/lib/queries/facilities";
import { useTreatments } from "@/lib/queries/treatments";
import { DashboardCardsSkeleton } from "@/components/skeletons/dashboard-cards-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useMemo } from "react";

export function HealthcareMetricsCards() {
  const { data: facilities, isLoading: facilitiesLoading, error: facilitiesError } = useFacilities();
  const { data: treatments, isLoading: treatmentsLoading, error: treatmentsError } = useTreatments();

  const metrics = useMemo(() => {
    const totalFacilities = facilities?.length || 0;
    const activeFacilities = facilities?.filter((f: any) => f.is_available)?.length || 0;
    const facilityUtilization = totalFacilities > 0 ? (activeFacilities / totalFacilities) * 100 : 0;

    const totalTreatments = treatments?.length || 0;
    const activeTreatments = treatments?.filter((t: any) => t.is_available)?.length || 0;
    const treatmentAvailability = totalTreatments > 0 ? (activeTreatments / totalTreatments) * 100 : 0;

    // Calculate average treatment cost (mock calculation)
    const avgTreatmentCost = treatments?.length ? 
      treatments.reduce((acc: number, t: any) => acc + (Number(t.price_range?.split('-')[0]) || 0), 0) / treatments.length : 0;

    // Calculate facility categories distribution
    const facilityCategories = facilities?.reduce((acc: Record<string, number>, facility: any) => {
      acc[facility.category] = (acc[facility.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const mostCommonFacilityType = Object.entries(facilityCategories)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

    return {
      totalFacilities,
      activeFacilities,
      facilityUtilization,
      totalTreatments,
      activeTreatments,
      treatmentAvailability,
      avgTreatmentCost,
      mostCommonFacilityType,
      facilitiesGrowth: totalFacilities > 0 ? 'up' : 'neutral',
      treatmentsGrowth: totalTreatments > 0 ? 'up' : 'neutral',
    };
  }, [facilities, treatments]);

  // Show loading state
  if (facilitiesLoading || treatmentsLoading) {
    return <DashboardCardsSkeleton />;
  }

  // Show error state
  if (facilitiesError || treatmentsError) {
    return (
      <div className="px-4 lg:px-6">
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load healthcare metrics. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Total Facilities */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Facilities</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalFacilities.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBuildingHospital />
              {metrics.facilityUtilization.toFixed(0)}% Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.activeFacilities} facilities currently available
            <IconBuildingHospital className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Most common: {metrics.mostCommonFacilityType}
          </div>
        </CardFooter>
      </Card>

      {/* Available Treatments */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Treatment Services</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalTreatments.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconStethoscope />
              {metrics.treatmentAvailability.toFixed(0)}% Available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.activeTreatments} treatments currently offered
            <IconStethoscope className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Service availability tracking
          </div>
        </CardFooter>
      </Card>

      {/* Average Treatment Cost */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Treatment Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${metrics.avgTreatmentCost.toFixed(0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Healthcare Pricing
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cost analysis across services
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on available pricing data
          </div>
        </CardFooter>
      </Card>

      {/* System Status */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>System Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {((metrics.facilityUtilization + metrics.treatmentAvailability) / 2).toFixed(0)}%
          </CardTitle>
          <CardAction>
            <Badge variant={metrics.facilityUtilization > 80 ? "default" : "outline"}>
              <IconUsers />
              {metrics.facilityUtilization > 80 ? 'Optimal' : 'Monitoring'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall system performance
            <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Facilities & treatments combined metric
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}