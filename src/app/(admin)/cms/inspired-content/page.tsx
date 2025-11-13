'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInspiredContent, useInspiredCategories } from '@/lib/queries/inspired-content';
import { contentTypes, targetCountries } from '@/lib/validations/inspired-content';
import { InspiredContentTable } from '@/components/inspired-content/inspired-content-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  IconFileText, 
  IconGlobe, 
  IconStar, 
  IconEdit, 
  IconSearch, 
  IconFilter,
  IconPlus,
  IconTrendingUp 
} from '@tabler/icons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function InspiredContentPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [countryFilter, setCountryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();

  const { data: content, isLoading } = useInspiredContent({ 
    search, 
    category_id: categoryFilter,
    content_type: typeFilter as any,
    target_country: countryFilter as any,
    is_published: statusFilter 
  });
  
  const { data: categories } = useInspiredCategories();

  // Calculate stats
  const stats = {
    total: content?.length || 0,
    published: content?.filter(c => c.is_published).length || 0,
    featured: content?.filter(c => c.is_featured).length || 0,
    drafts: content?.filter(c => !c.is_published).length || 0,
    publishedPercentage: content?.length ? Math.round((content.filter(c => c.is_published).length / content.length) * 100) : 0,
    featuredPercentage: content?.length ? Math.round((content.filter(c => c.is_featured).length / content.length) * 100) : 0,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspired Content</h1>
          <p className="text-muted-foreground">
            Manage "Get Inspired" content for patients and medical tourists
          </p>
        </div>
        <Button asChild>
          <Link href="/cms/inspired-content/new">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Content
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl:grid-cols-2 @5xl:grid-cols-4">
        
        {/* Total Content */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Content</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconFileText className="w-3 h-3" />
                Content Management
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.total} pieces of content created
              <IconFileText className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Across all content types and categories
            </div>
          </CardFooter>
        </Card>

        {/* Published Content */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Published Content</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.published.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconGlobe className="w-3 h-3" />
                {stats.publishedPercentage}% Live
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.published} articles live to public
              <IconGlobe className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Visible to patients and medical tourists
            </div>
          </CardFooter>
        </Card>

        {/* Featured Content */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Featured Content</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.featured.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconStar className="w-3 h-3" />
                {stats.featuredPercentage}% Featured
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.featured} highlighted in featured sections
              <IconStar className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Premium placement in homepage sections
            </div>
          </CardFooter>
        </Card>

        {/* Draft Content */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Draft Content</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.drafts.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant={stats.drafts > 0 ? "outline" : "secondary"}>
                <IconEdit className="w-3 h-3" />
                {stats.drafts > 0 ? 'In Progress' : 'All Published'}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.drafts} items in draft status
              <IconEdit className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Content pending review and publishing
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search content..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10" 
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value === 'all' ? undefined : value)}>
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
            
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value === 'all' ? undefined : value)}>
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
            
            <Select value={countryFilter} onValueChange={(value) => setCountryFilter(value === 'all' ? undefined : value)}>
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
            
            <Select 
              value={statusFilter?.toString()} 
              onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value === 'true')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading inspired content...</p>
        </div>
      ) : (
        <InspiredContentTable content={content || []} />
      )}
    </div>
  );
}