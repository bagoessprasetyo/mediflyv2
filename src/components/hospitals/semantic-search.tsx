'use client';

import { useState, useMemo } from 'react';
import { useSemanticHospitalSearch } from '@/lib/queries/hospitals';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search,
  MapPin,
  Building,
  Star,
  Clock,
  Shield,
  ChevronDown,
  Sparkles,
  Target,
  BarChart3,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface SemanticSearchProps {
  onHospitalSelect?: (hospital: any) => void;
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  showMetrics?: boolean;
}

export function SemanticHospitalSearch({
  onHospitalSelect,
  className = '',
  placeholder = 'Search hospitals with AI (e.g., "pediatric cardiology in Los Angeles")',
  showFilters = true,
  showMetrics = true,
}: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: '',
    emergency_services: undefined as boolean | undefined,
    is_verified: undefined as boolean | undefined,
    trauma_level: '',
  });
  const [options, setOptions] = useState({
    semantic_weight: 0.7,
    text_weight: 0.3,
    similarity_threshold: 0.6,
    limit: 20,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSemanticHospitalSearch(
    query.trim(),
    Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
    ),
    options
  );

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      type: '',
      emergency_services: undefined,
      is_verified: undefined,
      trauma_level: '',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== undefined);
  }, [filters]);

  const handleSearch = () => {
    if (query.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <Target className="h-3 w-3" />;
    if (score >= 0.6) return <Sparkles className="h-3 w-3" />;
    return <BarChart3 className="h-3 w-3" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-20"
        />
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                Advanced Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(filters).filter(v => v !== '' && v !== undefined).length}
                  </Badge>
                )}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
                <Input
                  placeholder="State"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hospital Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="SPECIALTY">Specialty</SelectItem>
                    <SelectItem value="TEACHING">Teaching</SelectItem>
                    <SelectItem value="CLINIC">Clinic</SelectItem>
                    <SelectItem value="URGENT_CARE">Urgent Care</SelectItem>
                    <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
                    <SelectItem value="PSYCHIATRIC">Psychiatric</SelectItem>
                    <SelectItem value="CHILDRENS">Children's</SelectItem>
                    <SelectItem value="MATERNITY">Maternity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Features</label>
                <Select
                  value={filters.emergency_services?.toString() || ''}
                  onValueChange={(value) =>
                    setFilters(prev => ({
                      ...prev,
                      emergency_services: value === '' ? undefined : value === 'true'
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Emergency Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">With Emergency</SelectItem>
                    <SelectItem value="false">Without Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.is_verified?.toString() || ''}
                  onValueChange={(value) =>
                    setFilters(prev => ({
                      ...prev,
                      is_verified: value === '' ? undefined : value === 'true'
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">Verified Only</SelectItem>
                    <SelectItem value="false">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                Clear Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Search Metrics */}
      {showMetrics && searchResults?.metadata && (
        <Collapsible open={metricsOpen} onOpenChange={setMetricsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Search Analytics
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Results</span>
                    <p className="font-medium">{searchResults.metadata.total_results}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Search Type</span>
                    <p className="font-medium">
                      {searchResults.metadata.has_semantic_search ? 'AI + Text' : 'Text Only'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Semantic Weight</span>
                    <p className="font-medium">{(options.semantic_weight * 100)}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Threshold</span>
                    <p className="font-medium">{options.similarity_threshold}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <p className="text-destructive text-sm">
              Search failed: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {searchResults && (
        <div className="space-y-4">
          {searchResults.results.length === 0 ? (
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-muted-foreground">
                  No hospitals found matching your search criteria.
                  {query && ' Try adjusting your search terms or filters.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Found {searchResults.results.length} hospitals
                </h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Search
                </Badge>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3 pr-4">
                  {searchResults.results.map((hospital: any) => (
                    <Card
                      key={hospital.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onHospitalSelect?.(hospital)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium truncate">{hospital.name}</h4>
                                {hospital.is_verified && (
                                  <Shield className="h-4 w-4 text-blue-600" />
                                )}
                                {hospital.is_featured && (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {hospital.city}, {hospital.state}
                              </p>
                            </div>

                            {/* Scores */}
                            <div className="flex flex-col gap-1 text-xs">
                              <div className={`flex items-center gap-1 ${getScoreColor(hospital.combined_score)}`}>
                                {getScoreIcon(hospital.combined_score)}
                                <span className="font-mono">
                                  {(hospital.combined_score * 100).toFixed(0)}%
                                </span>
                              </div>
                              {showMetrics && (
                                <div className="text-muted-foreground">
                                  <div>S: {(hospital.similarity_score * 100).toFixed(0)}%</div>
                                  <div>T: {(hospital.text_score * 100).toFixed(0)}%</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {hospital.type?.replace('_', ' ')}
                            </span>
                            {hospital.emergency_services && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Emergency
                              </span>
                            )}
                            {hospital.trauma_level && (
                              <Badge variant="outline" className="text-xs">
                                Trauma Level {hospital.trauma_level}
                              </Badge>
                            )}
                          </div>

                          {/* Description */}
                          {hospital.description && (
                            <>
                              <Separator />
                              <p className="text-sm line-clamp-2">{hospital.description}</p>
                            </>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button size="sm" asChild>
                              <Link href={`/cms/hospitals/${hospital.id}`}>
                                View Details
                              </Link>
                            </Button>
                            {onHospitalSelect && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onHospitalSelect(hospital);
                                }}
                              >
                                Select
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </div>
  );
}