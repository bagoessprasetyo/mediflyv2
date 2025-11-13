'use client';

import { use } from 'react';
import { useInspiredContentItem } from '@/lib/queries/inspired-content';
import { InspiredContentForm } from '@/components/inspired-content/inspired-content-form';
import { HospitalSelector } from '@/components/inspired-content/hospital-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Building2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EditInspiredContentPageProps {
  params: Promise<{ id: string }>;
}

export default function EditInspiredContentPage({ params }: EditInspiredContentPageProps) {
  const { id } = use(params);
  const { data: content, isLoading } = useInspiredContentItem(id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Inspired Content</h1>
          <p className="text-muted-foreground">Loading content...</p>
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">Loading content details...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Content Not Found</h1>
          <p className="text-muted-foreground">
            The inspired content you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit: {content.title}</h1>
          <p className="text-muted-foreground">
            Manage content details and hospital selections
          </p>
        </div>

        <div className="flex gap-2">
          {content.is_published && (
            <Button variant="outline" asChild>
              <Link href={`/inspired/${content.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Public
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Details
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Hospital Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <InspiredContentForm content={content} isEditing />
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Hospital Management</h2>
                <p className="text-muted-foreground">
                  Select and organize hospitals for this content. Drag to reorder.
                </p>
              </div>

              {content.content_type === 'hospital_list' ? (
                <HospitalSelector contentId={content.id} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Hospital Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Hospital selection is only available for "Hospital List" content type.
                      Current type: <strong>{content.content_type}</strong>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}