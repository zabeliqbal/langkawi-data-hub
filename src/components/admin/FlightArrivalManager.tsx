
import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadCloud, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

type LiveFlightData = {
  id: string;
  airline_code: string;
  airline_name: string;
  flight_number: string;
  origin: string;
  scheduled_time: string;
  estimated_time: string;
  status: string;
  terminal: string;
  date: string;
};

const FlightArrivalManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FlightArrivalFormData | null>(null);
  const [activeTab, setActiveTab] = useState('managed-flights');
  const [isImporting, setIsImporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveFlights, setLiveFlights] = useState<LiveFlightData[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FlightArrivalFormData>();

  const { data: flightArrivals, isLoading, error, refetch } = useQuery({
    queryKey: ['flightArrivals'],
    queryFn: getFlightArrivals,
    enabled: true,
  });

  const fetchLiveFlightData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        'https://airports-prod-be.myairports.com.my/api/flights/search-flights?code=A&terminal=LGK&key=all&live=true&dayKey=0&value='
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch live flight data');
      }
      
      const data = await response.json();
      
      // Transform the data to match our format
      const transformedData = data.data.map((flight: any) => ({
        id: flight.id || `live-${flight.flight_number}-${Date.now()}`,
        airline_code: flight.airline_code || '',
        airline_name: flight.airline_name || '',
        flight_number: flight.flight_number || '',
        origin: flight.origin || '',
        scheduled_time: flight.scheduled_time || '',
        estimated_time: flight.estimated_time || '',
        status: flight.status || 'Scheduled',
        terminal: flight.terminal || '',
        date: new Date().toISOString().split('T')[0],
      }));
      
      setLiveFlights(transformedData);
      
      toast({
        title: 'Success',
        description: `Fetched ${transformedData.length} live flights`,
      });
    } catch (error) {
      console.error('Error fetching live flight data:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch live flight data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch live flight data when component mounts
    fetchLiveFlightData();
  }, []);

  const importFlight = async (flight: LiveFlightData) => {
    setIsImporting(true);
    try {
      // Convert the live flight data to our format
      const flightData = {
        flight_number: flight.flight_number,
        airline: flight.airline_name,
        origin: flight.origin,
        arrival_time: flight.scheduled_time,
        passengers: Math.floor(Math.random() * 200) + 50, // Random number between 50-250 for demo
        status: mapFlightStatus(flight.status),
        date: flight.date,
      };
      
      await createMutation.mutateAsync(flightData);
      
      toast({
        title: 'Success',
        description: `Flight ${flight.flight_number} imported successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to import flight: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const mapFlightStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'SCH': 'Scheduled',
      'DEL': 'Delayed',
      'CNC': 'Cancelled',
      'ARR': 'Arrived',
      'DEP': 'Departed',
      'DIV': 'Diverted',
      'EXP': 'Expected',
    };
    
    return statusMap[status] || 'Scheduled';
  };

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

  const liveFlightColumns = [
    { key: 'flight_number', title: 'Flight Number' },
    { key: 'airline_name', title: 'Airline' },
    { key: 'origin', title: 'Origin' },
    { key: 'scheduled_time', title: 'Scheduled Time' },
    { key: 'estimated_time', title: 'Estimated Time' },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => {
        const statusColors = {
          'SCH': 'bg-blue-100 text-blue-800',
          'DEL': 'bg-red-100 text-red-800',
          'CNC': 'bg-gray-100 text-gray-800',
          'ARR': 'bg-green-100 text-green-800',
          'DEP': 'bg-yellow-100 text-yellow-800',
          'DIV': 'bg-purple-100 text-purple-800',
          'EXP': 'bg-orange-100 text-orange-800',
        };
        const colorClass = statusColors[value as keyof typeof statusColors] || 'bg-blue-100 text-blue-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (_: any, record: LiveFlightData) => (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => importFlight(record)}
          disabled={isImporting}
        >
          <DownloadCloud className="h-4 w-4 mr-2" />
          Import
        </Button>
      )
    },
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="managed-flights">Managed Flights</TabsTrigger>
          <TabsTrigger value="live-flights">Live Flight Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="managed-flights">
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
        </TabsContent>
        
        <TabsContent value="live-flights">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Live Flight Arrivals</CardTitle>
                  <CardDescription>
                    Live flight data from Langkawi International Airport (LGK)
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchLiveFlightData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isRefreshing ? (
                <div className="py-10 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-muted-foreground">Fetching live flight data...</p>
                </div>
              ) : liveFlights.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <p>No live flight data available.</p>
                  <p>Click "Refresh Data" to fetch the latest flight information.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {liveFlightColumns.map((column) => (
                          <th key={column.key} className="p-3 text-left font-medium text-muted-foreground">
                            {column.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {liveFlights.map((flight, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          {liveFlightColumns.map((column) => (
                            <td key={`${index}-${column.key}`} className="p-3">
                              {column.key === 'actions' 
                                ? column.render?.(null, flight) 
                                : column.render 
                                  ? column.render(flight[column.key as keyof LiveFlightData], flight)
                                  : flight[column.key as keyof LiveFlightData]?.toString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
