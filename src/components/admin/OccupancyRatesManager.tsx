
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOccupancyRates } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

type OccupancyRateFormData = {
  id?: string;
  month: string;
  year: number;
  rate: number;
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const OccupancyRatesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OccupancyRateFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OccupancyRateFormData>();

  const { data: occupancyRates, isLoading, error } = useQuery({
    queryKey: ['occupancy-rates'],
    queryFn: getOccupancyRates,
  });

  const createMutation = useMutation({
    mutationFn: async (data: OccupancyRateFormData) => {
      const { error } = await supabase
        .from('occupancy_rates')
        .insert([data])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupancy-rates'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Occupancy rate has been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add occupancy rate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: OccupancyRateFormData) => {
      if (!data.id) throw new Error('Missing ID');
      
      const { error } = await supabase
        .from('occupancy_rates')
        .update({
          month: data.month,
          year: data.year,
          rate: data.rate,
        })
        .eq('id', data.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupancy-rates'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Occupancy rate has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update occupancy rate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('occupancy_rates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupancy-rates'] });
      toast({
        title: 'Success',
        description: 'Occupancy rate has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete occupancy rate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    reset({
      month: 'Jan',
      year: new Date().getFullYear(),
      rate: 70,
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

  const onSubmit = (data: OccupancyRateFormData) => {
    if (editingRecord) {
      updateMutation.mutate({ ...data, id: editingRecord.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'month', title: 'Month' },
    { key: 'year', title: 'Year' },
    { 
      key: 'rate', 
      title: 'Occupancy Rate',
      render: (value: number) => `${value}%`
    },
  ];

  return (
    <>
      <DataTable
        title="Occupancy Rates"
        description="Manage hotel occupancy rates for Langkawi"
        data={occupancyRates || []}
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
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Occupancy Rate</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the hotel occupancy rate for this period'
                : 'Add new hotel occupancy rate for a specific period'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <select
                    id="month"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('month', { required: 'Month is required' })}
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  {errors.month && (
                    <p className="text-sm text-red-500">{errors.month.message}</p>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Occupancy Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  {...register('rate', { 
                    required: 'Occupancy rate is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: 100, message: 'Cannot exceed 100%' },
                  })}
                />
                {errors.rate && (
                  <p className="text-sm text-red-500">{errors.rate.message}</p>
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

export default OccupancyRatesManager;
