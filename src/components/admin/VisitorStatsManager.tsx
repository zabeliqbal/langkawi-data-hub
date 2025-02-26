
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitorStats, addVisitorStat, updateVisitorStat, deleteVisitorStat } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

type VisitorStatFormData = {
  id?: string;
  month: string;
  year: number;
  domestic_visitors: number;
  international_visitors: number;
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const VisitorStatsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VisitorStatFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VisitorStatFormData>();

  const { data: visitorStats, isLoading, error } = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: getVisitorStats,
  });

  const createMutation = useMutation({
    mutationFn: (data: VisitorStatFormData) => addVisitorStat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitor-stats'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Visitor statistics have been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add visitor statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: VisitorStatFormData) => {
      if (!data.id) throw new Error('Missing ID');
      return updateVisitorStat(data.id, {
        month: data.month,
        year: data.year,
        domestic_visitors: data.domestic_visitors,
        international_visitors: data.international_visitors,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitor-stats'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Visitor statistics have been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update visitor statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVisitorStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitor-stats'] });
      toast({
        title: 'Success',
        description: 'Visitor statistics have been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete visitor statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    reset({
      month: 'Jan',
      year: new Date().getFullYear(),
      domestic_visitors: 0,
      international_visitors: 0,
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

  const onSubmit = (data: VisitorStatFormData) => {
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
      key: 'domestic_visitors', 
      title: 'Domestic Visitors',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'international_visitors', 
      title: 'International Visitors',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'total', 
      title: 'Total Visitors',
      render: (_: any, record: any) => (record.domestic_visitors + record.international_visitors).toLocaleString()
    },
  ];

  return (
    <>
      <DataTable
        title="Visitor Statistics"
        description="Manage monthly visitor statistics for Langkawi"
        data={visitorStats || []}
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
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Visitor Statistics</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the visitor statistics for this period'
                : 'Add new visitor statistics for a specific period'}
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
                <Label htmlFor="domestic_visitors">Domestic Visitors</Label>
                <Input
                  id="domestic_visitors"
                  type="number"
                  {...register('domestic_visitors', { 
                    required: 'Domestic visitors is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.domestic_visitors && (
                  <p className="text-sm text-red-500">{errors.domestic_visitors.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="international_visitors">International Visitors</Label>
                <Input
                  id="international_visitors"
                  type="number"
                  {...register('international_visitors', { 
                    required: 'International visitors is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.international_visitors && (
                  <p className="text-sm text-red-500">{errors.international_visitors.message}</p>
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

export default VisitorStatsManager;
