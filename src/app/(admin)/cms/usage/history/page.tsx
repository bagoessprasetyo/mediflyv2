'use client';

import React, { useState } from 'react';
import {
  IconFilter,
  IconDownload,
  IconSearch,
  IconCalendar,
  IconRefresh,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { useUsageHistory, useExportUsage, useCostRates } from '@/lib/queries/usage';
import { UsageFilters } from '@/types/usage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function UsageHistoryPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UsageFilters>({
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data: historyData, isLoading, refetch } = useUsageHistory(filters, page, 25);
  const { data: costRates } = useCostRates();
  const exportUsage = useExportUsage();

  const handleFilterChange = (key: keyof UsageFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
    setPage(1); // Reset to first page when filters change
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportUsage.mutate({ ...filters, format });
  };

  const getActionBadgeVariant = (actionType: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      create: 'default',
      update: 'secondary',
      delete: 'destructive',
      query: 'outline',
      search: 'outline',
    };
    return variants[actionType] || 'secondary';
  };

  const getSuccessBadgeVariant = (success: boolean) => {
    return success ? 'default' : 'destructive';
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Usage History</h1>
              <p className="text-muted-foreground">
                Detailed history of your API calls and token usage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('csv')}
                disabled={exportUsage.isPending}
              >
                <IconDownload className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('json')}
                disabled={exportUsage.isPending}
              >
                <IconDownload className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconFilter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={filters.start_date || ''}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={filters.end_date || ''}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Type</label>
                  <Select 
                    value={filters.action_type || ''} 
                    onValueChange={(value) => handleFilterChange('action_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All actions</SelectItem>
                      <SelectItem value="query">Query</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="generation">Generation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Select 
                    value={filters.model_name || ''} 
                    onValueChange={(value) => handleFilterChange('model_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All models</SelectItem>
                      {costRates?.map((rate) => (
                        <SelectItem key={rate.model_name} value={rate.model_name}>
                          {rate.model_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={filters.success?.toString() || ''} 
                    onValueChange={(value) => handleFilterChange('success', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="true">Success</SelectItem>
                      <SelectItem value="false">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Session ID</label>
                  <Input
                    type="text"
                    placeholder="Filter by session..."
                    value={filters.session_id || ''}
                    onChange={(e) => handleFilterChange('session_id', e.target.value)}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setFilters({
                      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      end_date: new Date().toISOString().split('T')[0],
                    });
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage History Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Usage Records</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {historyData ? (
                    `Showing ${((page - 1) * 25) + 1}-${Math.min(page * 25, historyData.total)} of ${historyData.total} records`
                  ) : (
                    'Loading...'
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date/Time</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Endpoint</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead className="text-right">Tokens</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-right">Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyData?.usage.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No usage records found for the selected filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          historyData?.usage.map((usage) => (
                            <TableRow key={usage.id}>
                              <TableCell className="font-mono text-xs">
                                {new Date(usage.created_at).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getActionBadgeVariant(usage.action_type)}>
                                  {usage.action_type.replace(/_/g, ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs max-w-32 truncate">
                                {usage.endpoint || 'N/A'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {usage.model_name || 'N/A'}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                <div className="space-y-1">
                                  <div>{usage.total_tokens.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {usage.input_tokens}in + {usage.output_tokens}out
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                ${usage.cost_usd.toFixed(6)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {usage.duration_ms ? `${usage.duration_ms}ms` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getSuccessBadgeVariant(usage.success)}>
                                  {usage.success ? 'Success' : 'Failed'}
                                </Badge>
                                {usage.error_message && (
                                  <div className="text-xs text-red-500 mt-1 max-w-32 truncate" title={usage.error_message}>
                                    {usage.error_message}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {historyData && historyData.total_pages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {page} of {historyData.total_pages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={page <= 1}
                        >
                          <IconChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        {/* Page numbers */}
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, historyData.total_pages) }, (_, i) => {
                            let pageNumber: number;
                            if (historyData.total_pages <= 5) {
                              pageNumber = i + 1;
                            } else if (page <= 3) {
                              pageNumber = i + 1;
                            } else if (page >= historyData.total_pages - 2) {
                              pageNumber = historyData.total_pages - 4 + i;
                            } else {
                              pageNumber = page - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === page ? 'default' : 'outline'}
                                size="sm"
                                className="w-8"
                                onClick={() => setPage(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={page >= historyData.total_pages}
                        >
                          Next
                          <IconChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}