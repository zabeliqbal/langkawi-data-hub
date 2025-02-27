
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlightArrivals } from '@/services/api';
import DataTable from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FlightArrivalFormData = {
  id?: string;
  flight_number: string;
  airline: string;
  origin: string;
  arrival_time: string;
  passengers: number;
  status: string;
  date: string;
};

const FlightArrivalManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FlightArrivalFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FlightArrivalFormData>();

  const { data: flightArrivals, isLoading, error } = useQuery({
    queryKey: ['flightArrivals'],
    queryFn: getFlightArrivals,
    enabled: true, // This might be false initially until the API function is properly implemented
  });

  const createMutation = useMutation({
    mutationFn: async (data: FlightArrivalFormData) => {
      const { error } = await supabase
        .from('flight_arrivals')
        .insert([data])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightArrivals'] });
      setIsModalOpen(false);
      reset();
      toast({
        title: 'Success',
        description: 'Flight arrival has been added',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add flight arrival: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FlightArrivalFormData) => {
      if (!data.id) throw new Error('Missing ID');
      
      const { error } = await supabase
        .from('flight_arrivals')
        .update({
          flight_number: data.flight_number,
          airline: data.airline,
          origin: data.origin,
          arrival_time: data.arrival_time,
          passengers: data.passengers,
          status: data.status,
          date: data.date
        })
        .eq('id', data.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightArrivals'] });
      setIsModalOpen(false);
      setEditingRecord(null);
      reset();
      toast({
        title: 'Success',
        description: 'Flight arrival has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update flight arrival: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flight_arrivals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightArrivals'] });
      toast({
        title: 'Success',
        description: 'Flight arrival has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete flight arrival: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onAddNew = () => {
    setEditingRecord(null);
    reset({
      flight_number: '',
      airline: '',
      origin: '',
      arrival_time: '',
      passengers: 0,
      status: 'Scheduled',
      date: new Date().toISOString().split('T')[0],
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

  const onSubmit = (data: FlightArrivalFormData) => {
    if (editingRecord) {
      updateMutation.mutate({ ...data, id: editingRecord.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'flight_number', title: 'Flight Number' },
    { key: 'airline', title: 'Airline' },
    { key: 'origin', title: 'Origin' },
    { key: 'arrival_time', title: 'Arrival Time' },
    { 
      key: 'passengers', 
      title: 'Passengers',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => {
        const statusColors = {
          'Scheduled': 'bg-blue-100 text-blue-800',
          'Departed': 'bg-yellow-100 text-yellow-800',
          'Arrived': 'bg-green-100 text-green-800',
          'Delayed': 'bg-red-100 text-red-800',
          'Cancelled': 'bg-gray-100 text-gray-800'
        };
        const colorClass = statusColors[value as keyof typeof statusColors] || 'bg-blue-100 text-blue-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'date', title: 'Date' },
  ];

  // Placeholder data for initial testing before the API is fully implemented
  const mockData = flightArrivals || [
    {
      id: '1',
      flight_number: 'MH1432',
      airline: 'Malaysia Airlines',
      origin: 'Kuala Lumpur',
      arrival_time: '09:30',
      passengers: 132,
      status: 'Arrived',
      date: '2023-05-15'
    },
    {
      id: '2',
      flight_number: 'AK5642',
      airline: 'AirAsia',
      origin: 'Singapore',
      arrival_time: '11:45',
      passengers: 175,
      status: 'Scheduled',
      date: '2023-05-15'
    },
    {
      id: '3',
      flight_number: 'FD3311',
      airline: 'Thai AirAsia',
      origin: 'Bangkok',
      arrival_time: '14:20',
      passengers: 163,
      status: 'Delayed',
      date: '2023-05-15'
    }
  ];

  return (
    <>
      <DataTable
        title="Flight Arrivals"
        description="Manage flight arrivals to Langkawi International Airport"
        data={mockData}
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
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Flight Arrival</DialogTitle>
            <DialogDescription>
              {editingRecord
                ? 'Update the flight arrival details'
                : 'Add new flight arrival to the database'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flight_number">Flight Number</Label>
                  <Input
                    id="flight_number"
                    type="text"
                    {...register('flight_number', { 
                      required: 'Flight number is required' 
                    })}
                  />
                  {errors.flight_number && (
                    <p className="text-sm text-red-500">{errors.flight_number.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    type="text"
                    {...register('airline', { 
                      required: 'Airline is required' 
                    })}
                  />
                  {errors.airline && (
                    <p className="text-sm text-red-500">{errors.airline.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  type="text"
                  {...register('origin', { 
                    required: 'Origin is required' 
                  })}
                />
                {errors.origin && (
                  <p className="text-sm text-red-500">{errors.origin.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrival_time">Arrival Time</Label>
                  <Input
                    id="arrival_time"
                    type="time"
                    {...register('arrival_time', { 
                      required: 'Arrival time is required' 
                    })}
                  />
                  {errors.arrival_time && (
                    <p className="text-sm text-red-500">{errors.arrival_time.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date', { 
                      required: 'Date is required' 
                    })}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">Number of Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    {...register('passengers', { 
                      required: 'Passenger count is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Cannot be negative' },
                    })}
                  />
                  {errors.passengers && (
                    <p className="text-sm text-red-500">{errors.passengers.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue={editingRecord?.status || "Scheduled"}
                    onValueChange={(value) => setValue('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Departed">Departed</SelectItem>
                      <SelectItem value="Arrived">Arrived</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <input 
                    type="hidden" 
                    {...register('status', { required: 'Status is required' })}
                  />
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status.message}</p>
                  )}
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

export default FlightArrivalManager;
