'use client';

import { useState } from 'react';
import { useHospitals, useSemanticHospitalSearch } from '@/lib/queries/hospitals';
import { 
  useInspiredContentHospitals, 
  useAddHospitalToContent, 
  useRemoveHospitalFromContent,
  useReorderContentHospitals 
} from '@/lib/queries/inspired-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Search, 
  Trash2, 
  GripVertical, 
  Star,
  MapPin,
  Building,
  Users,
  Sparkles
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface HospitalSelectorProps {
  contentId: string;
  readonly?: boolean;
}

export function HospitalSelector({ contentId, readonly = false }: HospitalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  
  const { data: contentHospitals, isLoading } = useInspiredContentHospitals(contentId);
  const { data: allHospitals } = useHospitals({ search: searchTerm });
  const { data: semanticResults } = useSemanticHospitalSearch(
    searchTerm,
    {},
    { enabled: useSemanticSearch && searchTerm.length > 3 }
  );
  const addHospitalMutation = useAddHospitalToContent();
  const removeHospitalMutation = useRemoveHospitalFromContent();
  const reorderMutation = useReorderContentHospitals();

  // Get hospitals that are not already in the content
  const searchHospitals = useSemanticSearch ? semanticResults?.results || [] : allHospitals || [];
  const availableHospitals = searchHospitals.filter(
    (hospital: any) => !contentHospitals?.find(ch => ch.hospital_id === hospital.id)
  );

  const handleAddHospital = async (hospitalId: string) => {
    const nextPosition = Math.max(...(contentHospitals?.map(h => h.position) || [0])) + 1;
    
    await addHospitalMutation.mutateAsync({
      content_id: contentId,
      hospital_id: hospitalId,
      position: nextPosition,
      custom_title: '',
      description: '',
      highlight_text: '',
      custom_image_url: '',
      rating_score: null,
      patient_count: null,
      price_range_min: null,
      price_range_max: null,
    });
    
    setDialogOpen(false);
  };

  const handleRemoveHospital = async (hospitalContentId: string) => {
    await removeHospitalMutation.mutateAsync(hospitalContentId);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || readonly) return;

    const items = Array.from(contentHospitals || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const hospitalOrders = items.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    await reorderMutation.mutateAsync({ contentId, hospitalOrders });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hospital Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading hospitals...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hospital Selection</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {contentHospitals?.length || 0} hospitals selected
            </p>
          </div>
          
          {!readonly && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hospital
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Hospitals</DialogTitle>
                  <DialogDescription>
                    Choose hospitals to add to this content
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder={
                          useSemanticSearch 
                            ? "AI Search: Try 'pediatric cardiology in LA' or 'trauma center with helicopter'"
                            : "Search hospitals..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10" 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="semantic-search"
                        checked={useSemanticSearch}
                        onCheckedChange={setUseSemanticSearch}
                      />
                      <Label htmlFor="semantic-search" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI-powered search
                      </Label>
                      {useSemanticSearch && (
                        <Badge variant="secondary" className="text-xs">
                          Natural Language
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {availableHospitals.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          {searchTerm ? 'No hospitals found' : 'All hospitals have been added'}
                        </p>
                      ) : (
                        availableHospitals.map((hospital: any) => (
                          <Card key={hospital.id} className="cursor-pointer hover:bg-accent transition-colors">
                            <CardContent className="p-4" onClick={() => handleAddHospital(hospital.id)}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{hospital.name}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {hospital.city}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {hospital.type || 'Hospital'}
                                    </span>
                                    {hospital.rating && (
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3" />
                                        {hospital.rating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button size="sm">Add</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!contentHospitals || contentHospitals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hospitals selected yet</p>
            {!readonly && (
              <p className="text-sm">Click "Add Hospital" to get started</p>
            )}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="hospitals">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {contentHospitals
                    .sort((a, b) => a.position - b.position)
                    .map((contentHospital, index) => (
                    <Draggable 
                      key={contentHospital.id} 
                      draggableId={contentHospital.id} 
                      index={index}
                      isDragDisabled={readonly}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'shadow-md' : ''} ${readonly ? '' : 'cursor-move'}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {!readonly && (
                                <div {...provided.dragHandleProps} className="mt-1">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                                  {contentHospital.position}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">
                                    {contentHospital.custom_title || contentHospital.hospital?.name}
                                  </h4>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {contentHospital.hospital?.city}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {contentHospital.hospital?.type || 'Hospital'}
                                    </span>
                                  </div>
                                  
                                  {contentHospital.highlight_text && (
                                    <Badge variant="secondary" className="mt-2">
                                      {contentHospital.highlight_text}
                                    </Badge>
                                  )}
                                  
                                  {contentHospital.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                      {contentHospital.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {!readonly && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {/* Open edit dialog */}}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveHospital(contentHospital.id)}
                                    disabled={removeHospitalMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}