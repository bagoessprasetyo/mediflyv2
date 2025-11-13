import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmbeddingManager } from '@/components/hospitals/embedding-manager';
import { SemanticHospitalSearch } from '@/components/hospitals/semantic-search';
import { EmbeddingCLI } from '@/components/hospitals/embedding-cli';
import { 
  Database, 
  Search, 
  Terminal, 
  Sparkles, 
  Info,
  Shield,
  Zap 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hospital Embeddings | MediFly CMS',
  description: 'Manage and test hospital semantic search embeddings',
};

export default function HospitalEmbeddingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Hospital Embeddings & AI Search</h1>
        </div>
        <p className="text-muted-foreground">
          Manage OpenAI embeddings for semantic hospital search and test AI-powered search functionality.
        </p>
      </div>

      {/* Important Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>OpenAI API Required:</strong> This feature requires a valid OpenAI API key to be configured. 
          Embedding generation will consume OpenAI API credits. Monitor your usage in the OpenAI dashboard.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Test
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="cli" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            CLI Tools
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        {/* Semantic Search Testing */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                AI-Powered Hospital Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Try these examples:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>"pediatric cardiology hospital near Los Angeles"</li>
                      <li>"trauma center with helicopter pad and level 1 care"</li>
                      <li>"rehabilitation hospital for stroke patients"</li>
                      <li>"emergency hospital with 24/7 psychiatric services"</li>
                      <li>"teaching hospital with cancer research"</li>
                      <li>"maternity hospital with NICU"</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <SemanticHospitalSearch 
                  showFilters={true}
                  showMetrics={true}
                  placeholder="Try AI search: 'pediatric cardiology in LA' or 'trauma center with helicopter'"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embedding Management */}
        <TabsContent value="management" className="space-y-6">
          <EmbeddingManager />
        </TabsContent>

        {/* CLI Tools */}
        <TabsContent value="cli" className="space-y-6">
          <EmbeddingCLI />
        </TabsContent>

        {/* Documentation */}
        <TabsContent value="docs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Core Components:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>PostgreSQL with pgvector extension</li>
                    <li>OpenAI text-embedding-3-small/large models</li>
                    <li>Hybrid semantic + text search</li>
                    <li>Real-time embedding generation</li>
                    <li>Background processing with cron jobs</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Search Process:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Query embedding generation (OpenAI API)</li>
                    <li>Vector similarity search (cosine distance)</li>
                    <li>Traditional text search (PostgreSQL FTS)</li>
                    <li>Hybrid scoring (70% semantic, 30% text)</li>
                    <li>Relevance ranking and filtering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Performance & Scaling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance & Scaling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Optimizations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>IVFFlat indexing for vector search</li>
                    <li>GIN indexing for text search</li>
                    <li>Batch processing for embeddings</li>
                    <li>Rate limiting for OpenAI API</li>
                    <li>Efficient similarity thresholds</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Monitoring:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Embedding coverage statistics</li>
                    <li>Search performance metrics</li>
                    <li>API usage tracking</li>
                    <li>Error rate monitoring</li>
                    <li>Queue length tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* API Reference */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Search Endpoints:</h4>
                    <div className="space-y-2 font-mono">
                      <div><span className="text-green-600">POST</span> /api/hospitals/search</div>
                      <div><span className="text-blue-600">GET</span> /api/hospitals/[id]/similar</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Management Endpoints:</h4>
                    <div className="space-y-2 font-mono">
                      <div><span className="text-blue-600">GET</span> /api/hospitals/embeddings</div>
                      <div><span className="text-green-600">POST</span> /api/hospitals/embeddings</div>
                      <div><span className="text-yellow-600">PUT</span> /api/hospitals/embeddings</div>
                      <div><span className="text-red-600">DELETE</span> /api/hospitals/embeddings</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Automation:</h4>
                    <div className="space-y-2 font-mono">
                      <div><span className="text-green-600">POST</span> /api/hospitals/embeddings/cron</div>
                      <div><span className="text-green-600">POST</span> /api/hospitals/embeddings/webhook</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Database Functions:</h4>
                    <div className="space-y-2 font-mono text-xs">
                      <div>search_hospitals_comprehensive()</div>
                      <div>find_similar_hospitals()</div>
                      <div>get_hospitals_needing_embeddings()</div>
                      <div>update_hospital_embedding()</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}