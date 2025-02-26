
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttractions } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';

type AttractionFormData = {
  id?: string;
  name: string;
  description?: string;
  location_lat?: number;
  location_lng?: number;
  visitors_count?: number;
  rating?: number;
  image_url?: string;
};

const AttractionsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttractionFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AttractionFormData>();

  const { data: attractions, isLoading, error } = useQuery({
    queryKey: ['attractions'],
    queryFn: getAttractions,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AttractionFormData) => {
      const { error } = await supabase
        .from('attractions')
        .insert([data])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Attraction has been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add attraction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AttractionFormData) => {
      if (!data.id) throw new Error('Missing ID');
      
      const { error } = await supabase
        .from('attractions')
        .update({
          name: data.name,
          description: data.description,
          location_lat: data.location_lat,
          location_lng: data.location_lng,
          visitors_count: data.visitors_count,
          rating: data.rating,
          image_url: data.image_url,
        })
        .eq('id', data.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Attraction has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update attraction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attractions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      toast({
        title: 'Success',
        description: 'Attraction has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete attraction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    reset({
      name: '',
      description: '',
      location_lat: 6.3500,
      location_lng: 99.8000,
      visitors_count: 0,
      rating: 4.5,
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const onEdit = (record: any) => {
    setEditingRecord(record);
    Object.entries(record).forEach(([key, value]) => {
      // @ts-ignore - setValue is correctly typed, but TS doesn't know about the dynamic key
      setValue(key, value);
    });
    setIsModalOpen(true);
  };

  const onDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const onSubmit = (data: AttractionFormData) => {
    if (editingRecord) {
      updateMutation.mutate({ ...data, id: editingRecord.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'name', title: 'Name' },
    { 
      key: 'description', 
      title: 'Description',
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
    },
    { 
      key: 'visitors_count', 
      title: 'Annual Visitors',
      render: (value: number) => value ? value.toLocaleString() : '-'
    },
    { 
      key: 'rating', 
      title: 'Rating',
      render: (value: number) => value ? `${value} / 5` : '-'
    },
    { 
      key: 'image_url', 
      title: 'Image',
      render: (value: string) => value ? (
        <div className="w-10 h-10 overflow-hidden rounded-md">
          <img src={value} alt="Attraction" className="w-full h-full object-cover" />
        </div>
      ) : '-'
    },
  ];

  return (
    <>
      <DataTable
        title="Tourist Attractions"
        description="Manage popular attractions in Langkawi"
        data={attractions || []}
        columns={columns}
        onAddNew={onAddNew}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={isLoading}
        error={error instanceof Error ? error : null}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Attraction</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the tourist attraction details'
                : 'Add new tourist attraction to the database'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Attraction Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register('name', { 
                    required: 'Attraction name is required' 
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_lat">Latitude</Label>
                  <Input
                    id="location_lat"
                    type="number"
                    step="0.0001"
                    {...register('location_lat', { 
                      valueAsNumber: true,
                      min: { value: -90, message: 'Latitude must be between -90 and 90' },
                      max: { value: 90, message: 'Latitude must be between -90 and 90' },
                    })}
                  />
                  {errors.location_lat && (
                    <p className="text-sm text-red-500">{errors.location_lat.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_lng">Longitude</Label>
                  <Input
                    id="location_lng"
                    type="number"
                    step="0.0001"
                    {...register('location_lng', { 
                      valueAsNumber: true,
                      min: { value: -180, message: 'Longitude must be between -180 and 180' },
                      max: { value: 180, message: 'Longitude must be between -180 and 180' },
                    })}
                  />
                  {errors.location_lng && (
                    <p className="text-sm text-red-500">{errors.location_lng.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitors_count">Annual Visitors</Label>
                  <Input
                    id="visitors_count"
                    type="number"
                    {...register('visitors_count', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Cannot be negative' },
                    })}
                  />
                  {errors.visitors_count && (
                    <p className="text-sm text-red-500">{errors.visitors_count.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (out of 5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register('rating', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Rating must be between 0 and 5' },
                      max: { value: 5, message: 'Rating must be between 0 and 5' },
                    })}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-500">{errors.rating.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('image_url')}
                />
                {errors.image_url && (
                  <p className="text-sm text-red-500">{errors.image_url.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingRecord ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttractionsManager;
