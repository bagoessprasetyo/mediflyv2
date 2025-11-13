'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDeleteInspiredContent } from '@/lib/queries/inspired-content';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, ExternalLink, Calendar, Users } from 'lucide-react';

interface InspiredContentTableProps {
  content: any[];
  onViewContent?: (content: any) => void;
}

export function InspiredContentTable({ content, onViewContent }: InspiredContentTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const handleDelete = (content: any) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const handleView = (content: any) => {
    if (onViewContent) {
      onViewContent(content);
    }
  };

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hospital_list: 'bg-blue-100 text-blue-800',
      treatment_guide: 'bg-green-100 text-green-800',
      specialty_guide: 'bg-purple-100 text-purple-800',
      location_guide: 'bg-orange-100 text-orange-800',
      comparison_guide: 'bg-cyan-100 text-cyan-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatContentType = (type: string) => {
    const types: Record<string, string> = {
      hospital_list: 'Hospital List',
      treatment_guide: 'Treatment Guide',
      specialty_guide: 'Specialty Guide',
      location_guide: 'Location Guide',
      comparison_guide: 'Comparison Guide',
    };
    return types[type] || type;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Metrics</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No inspired content found
                </TableCell>
              </TableRow>
            ) : (
              content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[300px]">
                      <p className="font-medium truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">/{item.slug}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary" className={getContentTypeColor(item.content_type)}>
                      {formatContentType(item.content_type)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {item.category ? (
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: item.category.color_code,
                          color: item.category.color_code 
                        }}
                      >
                        {item.category.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No category</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {item.target_country && (
                        <p className="capitalize">{item.target_country.replace('_', ' ')}</p>
                      )}
                      {item.target_city && (
                        <p className="text-muted-foreground">{item.target_city}</p>
                      )}
                      {!item.target_country && !item.target_city && (
                        <span className="text-muted-foreground">Global</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <Badge variant={item.is_published ? "default" : "secondary"}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        {item.is_featured && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {item.published_at && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.published_at)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.view_count || 0}
                      </p>
                      {item.hospitals_count && item.hospitals_count.length > 0 && (
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {item.hospitals_count[0].count} hospitals
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/inspired-content/${item.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        
                        {item.is_published && (
                          <DropdownMenuItem asChild>
                            <Link href={`/inspired/${item.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Public
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedContent && (
        <DeleteContentDialog 
          content={selectedContent} 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen} 
        />
      )}
    </>
  );
}

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function DeleteContentDialog({ content, open, onOpenChange }: { content: any; open: boolean; onOpenChange: (b: boolean) => void }) {
  const router = useRouter();
  const deleteContent = useDeleteInspiredContent();

  const handleDelete = async () => {
    await (deleteContent as any).mutateAsync(content.id);
    onOpenChange(false);
    router.push('/cms/inspired-content');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{content.title}</strong> and all its associated hospital listings. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
            disabled={(deleteContent as any).isPending}
          >
            {(deleteContent as any).isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}