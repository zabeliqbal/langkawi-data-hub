
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOriginCountries } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

type OriginCountryFormData = {
  id?: string;
  country_name: string;
  visitor_count: number;
  percentage: number;
  year: number;
  color?: string;
};

// Default colors for countries
const defaultColors = [
  '#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
  '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#6B7280'
];

const OriginCountriesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OriginCountryFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OriginCountryFormData>();

  const { data: countries, isLoading, error } = useQuery({
    queryKey: ['origin-countries'],
    queryFn: getOriginCountries,
  });

  const createMutation = useMutation({
    mutationFn: async (data: OriginCountryFormData) => {
      const { error } = await supabase
        .from('origin_countries')
        .insert([data])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['origin-countries'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Origin country has been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add origin country: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: OriginCountryFormData) => {
      if (!data.id) throw new Error('Missing ID');
      
      const { error } = await supabase
        .from('origin_countries')
        .update({
          country_name: data.country_name,
          visitor_count: data.visitor_count,
          percentage: data.percentage,
          year: data.year,
          color: data.color,
        })
        .eq('id', data.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['origin-countries'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Origin country has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update origin country: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('origin_countries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['origin-countries'] });
      toast({
        title: 'Success',
        description: 'Origin country has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete origin country: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    // Get a random color from the default colors
    const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];
    
    reset({
      country_name: '',
      visitor_count: 0,
      percentage: 0,
      year: new Date().getFullYear(),
      color: randomColor,
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

  const onSubmit = (data: OriginCountryFormData) => {
    if (editingRecord) {
      updateMutation.mutate({ ...data, id: editingRecord.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'country_name', title: 'Country' },
    { 
      key: 'visitor_count', 
      title: 'Visitors',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'percentage', 
      title: 'Percentage',
      render: (value: number) => `${value}%`
    },
    { key: 'year', title: 'Year' },
    { 
      key: 'color', 
      title: 'Color',
      render: (value: string) => (
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-full mr-2" 
            style={{ backgroundColor: value || '#888888' }}
          ></div>
          {value || 'No color'}
        </div>
      )
    },
  ];

  return (
    <>
      <DataTable
        title="Origin Countries"
        description="Manage countries of origin for Langkawi visitors"
        data={countries || []}
        columns={columns}
        onAddNew={onAddNew}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={isLoading}
        error={error instanceof Error ? error : null}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Origin Country</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the visitor origin country details'
                : 'Add new visitor origin country information'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="country_name">Country Name</Label>
                <Input
                  id="country_name"
                  type="text"
                  {...register('country_name', { 
                    required: 'Country name is required' 
                  })}
                />
                {errors.country_name && (
                  <p className="text-sm text-red-500">{errors.country_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitor_count">Visitor Count</Label>
                <Input
                  id="visitor_count"
                  type="number"
                  {...register('visitor_count', { 
                    required: 'Visitor count is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.visitor_count && (
                  <p className="text-sm text-red-500">{errors.visitor_count.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.1"
                  {...register('percentage', { 
                    required: 'Percentage is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: 100, message: 'Cannot exceed 100%' },
                  })}
                />
                {errors.percentage && (
                  <p className="text-sm text-red-500">{errors.percentage.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { 
                    required: 'Year is required',
                    valueAsNumber: true,
                    min: { value: 2000, message: 'Year must be 2000 or later' },
                    max: { value: 2100, message: 'Year must be 2100 or earlier' },
                  })}
                />
                {errors.year && (
                  <p className="text-sm text-red-500">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color (hex code)</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="text"
                    placeholder="#2563EB"
                    {...register('color')}
                  />
                  <input
                    type="color"
                    id="color-picker"
                    className="h-10 w-10 rounded border border-input cursor-pointer"
                    {...register('color')}
                  />
                </div>
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

export default OriginCountriesManager;
