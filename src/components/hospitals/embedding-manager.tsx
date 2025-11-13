'use client';

import { useState } from 'react';
import {
  useEmbeddingStatus,
  useStartEmbeddingIndexing,
  useResetEmbeddings,
  useReindexHospitals,
} from '@/lib/queries/hospitals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Database,
  Play,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  BarChart3,
  Clock,
  Target,
  Info,
} from 'lucide-react';

interface EmbeddingManagerProps {
  className?: string;
}

export function EmbeddingManager({ className = '' }: EmbeddingManagerProps) {
  const [indexingOptions, setIndexingOptions] = useState({
    batchSize: 10,
    forceRegenerate: false,
  });
  const [reindexDialogOpen, setReindexDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [reindexIds, setReindexIds] = useState('');

  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useEmbeddingStatus();
  const startIndexingMutation = useStartEmbeddingIndexing();
  const resetEmbeddingsMutation = useResetEmbeddings();
  const reindexMutation = useReindexHospitals();

  const handleStartIndexing = () => {
    startIndexingMutation.mutate(indexingOptions);
  };

  const handleReindexHospitals = () => {
    const ids = reindexIds
      .split(/[,\n]/)
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    if (ids.length === 0) return;

    reindexMutation.mutate(ids, {
      onSuccess: () => {
        setReindexDialogOpen(false);
        setReindexIds('');
      }
    });
  };

  const handleResetEmbeddings = () => {
    resetEmbeddingsMutation.mutate(undefined, {
      onSuccess: () => setResetDialogOpen(false)
    });
  };

  if (statusLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Failed to load embedding status</p>
        </CardContent>
      </Card>
    );
  }

  const isIndexing = status.is_indexing;
  const progress = status.progress;
  const stats = status.stats;

  const progressPercentage = progress?.total > 0 ? (progress.processed / progress.total) * 100 : 0;
  const indexedPercentage = stats?.totalHospitals > 0 ? (stats.indexedHospitals / stats.totalHospitals) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Hospital Embedding System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                {isIndexing ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="font-medium">
                {isIndexing ? 'Indexing in Progress' : 'Ready'}
              </p>
            </div>

            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Indexed Hospitals</p>
              <p className="font-medium">
                {stats?.indexedHospitals || 0} / {stats?.totalHospitals || 0}
                <span className="text-sm text-muted-foreground ml-1">
                  ({indexedPercentage.toFixed(1)}%)
                </span>
              </p>
            </div>

            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium text-xs">
                {stats?.lastIndexed
                  ? new Date(stats.lastIndexed).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Coverage</span>
              <span className="text-sm text-muted-foreground">
                {indexedPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={indexedPercentage} className="h-2" />
          </div>

          {stats?.pendingHospitals > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {stats.pendingHospitals} hospitals need embeddings to enable semantic search.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Current Indexing Progress */}
      {isIndexing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Indexing Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Processed</span>
                <p className="font-medium">{progress?.processed || 0}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Successful</span>
                <p className="font-medium text-green-600">{progress?.successful || 0}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Failed</span>
                <p className="font-medium text-red-600">{progress?.failed || 0}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Batch</span>
                <p className="font-medium">
                  {progress?.currentBatch || 0} / {progress?.totalBatches || 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {progress?.errors && progress.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Recent Errors</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {progress.errors.slice(-3).map((error: any, index: number) => (
                    <div key={index} className="text-xs p-2 bg-red-50 rounded">
                      <span className="font-medium">{error.hospitalName}:</span>{' '}
                      <span className="text-red-700">{error.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Embedding Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Index Settings */}
            <div className="space-y-3">
              <h4 className="font-medium">Indexing Options</h4>
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  type="number"
                  min={1}
                  max={50}
                  value={indexingOptions.batchSize}
                  onChange={(e) =>
                    setIndexingOptions(prev => ({
                      ...prev,
                      batchSize: parseInt(e.target.value) || 10
                    }))
                  }
                  disabled={isIndexing}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-regenerate"
                  checked={indexingOptions.forceRegenerate}
                  onChange={(e) =>
                    setIndexingOptions(prev => ({
                      ...prev,
                      forceRegenerate: e.target.checked
                    }))
                  }
                  disabled={isIndexing}
                />
                <Label htmlFor="force-regenerate" className="text-sm">
                  Force regenerate existing embeddings
                </Label>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h4 className="font-medium">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>{' '}
                  <span className="font-medium">{stats?.totalHospitals || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Indexed:</span>{' '}
                  <span className="font-medium">{stats?.indexedHospitals || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pending:</span>{' '}
                  <span className="font-medium">{stats?.pendingHospitals || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleStartIndexing}
              disabled={isIndexing || startIndexingMutation.isPending}
              className="flex items-center gap-2"
            >
              {startIndexingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Start Indexing
            </Button>

            <Dialog open={reindexDialogOpen} onOpenChange={setReindexDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isIndexing}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reindex Specific
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reindex Specific Hospitals</DialogTitle>
                  <DialogDescription>
                    Enter hospital IDs (comma or newline separated) to regenerate their embeddings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hospital-ids">Hospital IDs</Label>
                    <textarea
                      id="hospital-ids"
                      value={reindexIds}
                      onChange={(e) => setReindexIds(e.target.value)}
                      placeholder="hospital-id-1, hospital-id-2, ..."
                      className="w-full h-32 px-3 py-2 text-sm border rounded-md resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setReindexDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReindexHospitals}
                    disabled={!reindexIds.trim() || reindexMutation.isPending}
                  >
                    {reindexMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Reindex
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isIndexing}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Embeddings</DialogTitle>
                  <DialogDescription>
                    This will delete all embeddings and require complete reindexing.
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will affect semantic search functionality until reindexing is complete.
                  </AlertDescription>
                </Alert>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResetDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetEmbeddings}
                    disabled={resetEmbeddingsMutation.isPending}
                  >
                    {resetEmbeddingsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Reset All Embeddings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => refetchStatus()}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Search Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Semantic Search Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Test semantic search functionality. Examples: "pediatric cardiology near LA", 
              "trauma center with helicopter pad", "rehabilitation hospital for stroke patients".
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}