'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Terminal,
  Play,
  Square,
  RotateCcw,
  Settings,
  Database,
  Webhook,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

interface EmbeddingCliProps {
  className?: string;
}

export function EmbeddingCLI({ className = '' }: EmbeddingCliProps) {
  const [activeTab, setActiveTab] = useState('status');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addOutput = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    setCommandOutput(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  const runCommand = async (command: string, options?: any) => {
    setIsRunning(true);
    addOutput(`Running command: ${command}`);

    try {
      let url = '';
      let method = 'GET';
      let body: any = undefined;

      switch (command) {
        case 'status':
          url = '/api/hospitals/embeddings';
          break;
        case 'start-indexing':
          url = '/api/hospitals/embeddings';
          method = 'POST';
          body = JSON.stringify(options || {});
          break;
        case 'reset-embeddings':
          url = '/api/hospitals/embeddings';
          method = 'DELETE';
          break;
        case 'reindex-specific':
          url = '/api/hospitals/embeddings';
          method = 'PUT';
          body = JSON.stringify({ hospital_ids: options?.hospitalIds || [] });
          break;
        case 'cron-status':
          url = '/api/hospitals/embeddings/cron';
          break;
        case 'webhook-test':
          url = '/api/hospitals/embeddings/webhook';
          break;
        default:
          throw new Error(`Unknown command: ${command}`);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const result = await response.json();

      if (response.ok) {
        addOutput(`Command completed successfully`, 'success');
        addOutput(`Response: ${JSON.stringify(result, null, 2)}`, 'info');
      } else {
        addOutput(`Command failed: ${result.error}`, 'error');
        addOutput(`Details: ${JSON.stringify(result, null, 2)}`, 'error');
      }

    } catch (error: any) {
      addOutput(`Command failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setCommandOutput([]);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(commandOutput.join('\n'));
    toast.success('Output copied to clipboard');
  };

  const commonCommands = [
    {
      name: 'Get Status',
      command: 'status',
      description: 'Check current embedding system status and statistics',
      icon: <Database className="h-4 w-4" />,
    },
    {
      name: 'Start Indexing',
      command: 'start-indexing',
      description: 'Begin embedding generation for hospitals without embeddings',
      icon: <Play className="h-4 w-4" />,
      options: { batchSize: 10, forceRegenerate: false },
    },
    {
      name: 'Reset All',
      command: 'reset-embeddings',
      description: 'Delete all embeddings (requires re-indexing)',
      icon: <RotateCcw className="h-4 w-4" />,
      variant: 'destructive' as const,
    },
    {
      name: 'Cron Health',
      command: 'cron-status',
      description: 'Check cron job health and status',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      name: 'Webhook Test',
      command: 'webhook-test',
      description: 'Test webhook endpoint health',
      icon: <Webhook className="h-4 w-4" />,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Hospital Embedding CLI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Use this interface to monitor and manage the hospital embedding system.
                  All operations are logged and can be monitored in real-time.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonCommands.map((cmd, index) => (
                  <Button
                    key={index}
                    variant={cmd.variant || 'outline'}
                    onClick={() => runCommand(cmd.command, cmd.options)}
                    disabled={isRunning}
                    className="h-auto p-4 flex-col items-start space-y-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {cmd.icon}
                      <span className="font-medium">{cmd.name}</span>
                    </div>
                    <p className="text-xs text-left text-muted-foreground">
                      {cmd.description}
                    </p>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="commands" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Start Indexing with Options</h4>
                    <div className="space-y-2">
                      <Label htmlFor="batch-size">Batch Size</Label>
                      <Input
                        id="batch-size"
                        type="number"
                        min={1}
                        max={50}
                        defaultValue={10}
                        placeholder="Batch size for processing"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const batchSize = parseInt(
                          (document.getElementById('batch-size') as HTMLInputElement)?.value || '10'
                        );
                        runCommand('start-indexing', { batchSize, forceRegenerate: false });
                      }}
                      disabled={isRunning}
                    >
                      Start Indexing
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Reindex Specific Hospitals</h4>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-ids">Hospital IDs</Label>
                      <Textarea
                        id="hospital-ids"
                        placeholder="hospital-id-1, hospital-id-2, ..."
                        className="h-24 resize-none"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const idsText = (document.getElementById('hospital-ids') as HTMLTextAreaElement)?.value || '';
                        const hospitalIds = idsText
                          .split(/[,\n]/)
                          .map(id => id.trim())
                          .filter(id => id.length > 0);
                        
                        if (hospitalIds.length === 0) {
                          addOutput('No hospital IDs provided', 'warning');
                          return;
                        }
                        
                        runCommand('reindex-specific', { hospitalIds });
                      }}
                      disabled={isRunning}
                    >
                      Reindex Selected
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Embedding generation uses OpenAI API credits. 
                    Monitor your usage and ensure you have sufficient quota before running large batches.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Advanced operations for system administration and debugging.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <h4 className="font-medium">API Endpoints</h4>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <Badge variant="outline" className="mr-2">GET</Badge>
                        <code>/api/hospitals/embeddings</code>
                      </div>
                      <div>
                        <Badge variant="outline" className="mr-2">POST</Badge>
                        <code>/api/hospitals/embeddings</code>
                      </div>
                      <div>
                        <Badge variant="outline" className="mr-2">PUT</Badge>
                        <code>/api/hospitals/embeddings</code>
                      </div>
                      <div>
                        <Badge variant="outline" className="mr-2">DELETE</Badge>
                        <code>/api/hospitals/embeddings</code>
                      </div>
                      <div>
                        <Badge variant="outline" className="mr-2">POST</Badge>
                        <code>/api/hospitals/embeddings/cron</code>
                      </div>
                      <div>
                        <Badge variant="outline" className="mr-2">POST</Badge>
                        <code>/api/hospitals/embeddings/webhook</code>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <h4 className="font-medium">Environment Variables</h4>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><code>OPENAI_API_KEY</code> - OpenAI API key</div>
                      <div><code>CRON_SECRET</code> - Cron job authentication</div>
                      <div><code>SUPABASE_WEBHOOK_SECRET</code> - Webhook auth</div>
                      <div><code>NODE_ENV</code> - Environment mode</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Command Output */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Command Output
              {isRunning && <Badge variant="secondary">Running...</Badge>}
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyOutput} disabled={commandOutput.length === 0}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={clearOutput}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded border p-4 bg-slate-950 text-slate-50">
            {commandOutput.length === 0 ? (
              <p className="text-slate-400 text-sm">No output yet. Run a command to see results.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {commandOutput.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap break-all">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}