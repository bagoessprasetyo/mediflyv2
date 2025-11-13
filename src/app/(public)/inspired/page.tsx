'use client';

import { useState } from 'react';
import { useInspiredContent, useInspiredCategories } from '@/lib/queries/inspired-content';
import { contentTypes, targetCountries } from '@/lib/validations/inspired-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Eye, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function InspiredBrowsePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [countryFilter, setCountryFilter] = useState<string | undefined>();

  const { data: content, isLoading } = useInspiredContent({ 
    search, 
    category_id: categoryFilter,
    content_type: typeFilter as any,
    target_country: countryFilter as any,
    is_published: true 
  });
  
  const { data: categories } = useInspiredCategories();

  const formatLocation = (item: any) => {
    const parts = [];
    if (item.target_city) parts.push(item.target_city);
    if (item.target_country) {
      parts.push(item.target_country.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()));
    }
    return parts.join(', ') || 'Global';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Get Inspired</h1>
            <p className="text-xl text-blue-100">
              Discover curated lists of the best hospitals, treatments, and healthcare destinations. 
              Let our expert recommendations guide your healthcare journey.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search inspiration content..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10" 
              />
            </div>
            
            <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter || 'all'} onValueChange={(value) => setTypeFilter(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={countryFilter || 'all'} onValueChange={(value) => setCountryFilter(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {targetCountries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !content || content.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">No content found</h2>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search terms to find more content.
              </p>
              <Button onClick={() => {
                setSearch('');
                setCategoryFilter(undefined);
                setTypeFilter(undefined);
                setCountryFilter(undefined);
              }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <Link href={`/inspired/${item.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      {item.featured_image_url ? (
                        <Image
                          src={item.featured_image_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <div className="text-4xl font-bold text-gray-400">
                            {item.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.category && (
                          <Badge 
                            variant="secondary" 
                            className="bg-white/90 text-gray-900"
                          >
                            {item.category.name}
                          </Badge>
                        )}
                        
                        {item.is_featured && (
                          <Badge className="bg-yellow-500 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                          <Eye className="h-3 w-3" />
                          {item.view_count || 0}
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {contentTypes.find(t => t.value === item.content_type)?.label || item.content_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                      
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      
                      {item.subtitle && (
                        <CardDescription className="line-clamp-1">
                          {item.subtitle}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{formatLocation(item)}</span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}