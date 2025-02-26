
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTouristSpending } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

type TouristSpendingFormData = {
  id?: string;
  month: string;
  year: number;
  amount: number;
  category?: string;
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  '2023' // For annual category data
];

const categories = [
  'Overall',
  'Accommodation',
  'Food and Dining',
  'Shopping',
  'Activities and Tours',
  'Transportation',
  'Others'
];

const TouristSpendingManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TouristSpendingFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TouristSpendingFormData>();

  const selectedCategory = watch('category');

  const { data: spendingData, isLoading, error } = useQuery({
    queryKey: ['tourist-spending'],
    queryFn: getTouristSpending,
  });

  const createMutation = useMutation({
    mutationFn: async (data: TouristSpendingFormData) => {
      const { error } = await supabase
        .from('tourist_spending')
        .insert([data])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourist-spending'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Tourist spending data has been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add tourist spending data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TouristSpendingFormData) => {
      if (!data.id) throw new Error('Missing ID');
      
      const { error } = await supabase
        .from('tourist_spending')
        .update({
          month: data.month,
          year: data.year,
          amount: data.amount,
          category: data.category,
        })
        .eq('id', data.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourist-spending'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Tourist spending data has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update tourist spending data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tourist_spending')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourist-spending'] });
      toast({
        title: 'Success',
        description: 'Tourist spending data has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete tourist spending data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    reset({
      month: 'Jan',
      year: new Date().getFullYear(),
      amount: 0,
      category: 'Overall',
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

  const onSubmit = (data: TouristSpendingFormData) => {
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
      key: 'amount', 
      title: 'Average Spending (MYR)',
      render: (value: number) => `MYR ${value}`
    },
    { key: 'category', title: 'Category' },
  ];

  return (
    <>
      <DataTable
        title="Tourist Spending"
        description="Manage tourist spending data for Langkawi"
        data={spendingData || []}
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
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Tourist Spending</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the tourist spending data for this period'
                : 'Add new tourist spending data for a specific period'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('category')}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month/Period</Label>
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
                <Label htmlFor="amount">
                  {selectedCategory === 'Overall' 
                    ? 'Average Spending (MYR)'
                    : 'Spending Amount (MYR)'}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register('amount', { 
                    required: 'Amount is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
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

export default TouristSpendingManager;
