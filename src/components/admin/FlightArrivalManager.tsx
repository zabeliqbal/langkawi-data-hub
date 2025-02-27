
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlightArrivals } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: flightArrivals, isLoading, error, refetch } = useQuery({
    queryKey: ['flightArrivals'],
    queryFn: getFlightArrivals
  });

  const syncFlightData = async (flights: LiveFlightData[]) => {
    try {
      // First, remove existing records for today to avoid duplicates
      const today = new Date().toISOString().split('T')[0];
      const { error: deleteError } = await supabase
        .from('flight_arrivals')
        .delete()
        .eq('date', today);

      if (deleteError) throw deleteError;

      // Insert new flight data
      const { error: insertError } = await supabase
        .from('flight_arrivals')
        .insert(flights.map(flight => ({
          flight_number: flight.flight_number,
          airline_code: flight.airline_code,
          airline_name: flight.airline_name,
          origin: flight.origin,
          scheduled_time: flight.scheduled_time,
          estimated_time: flight.estimated_time,
          status: flight.status,
          terminal: flight.terminal,
          date: flight.date
        })));

      if (insertError) throw insertError;

      await queryClient.invalidateQueries({ queryKey: ['flightArrivals'] });
      
      toast({
        title: 'Success',
        description: `Successfully synced ${flights.length} flights to database`,
      });
    } catch (error) {
      console.error('Error syncing flight data:', error);
      toast({
        title: 'Error',
        description: `Failed to sync flight data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

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
        status: flight.status || 'SCH',
        terminal: flight.terminal || '',
        date: new Date().toISOString().split('T')[0],
      }));

      // Sync the transformed data with our database
      await syncFlightData(transformedData);
      
      await refetch();
      
      toast({
        title: 'Success',
        description: `Fetched and synced ${transformedData.length} live flights`,
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

  const columns = [
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
  ];

  return (
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
        {isLoading || isRefreshing ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">
              {isRefreshing ? 'Fetching live flight data...' : 'Loading flight data...'}
            </p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            <p>Error loading flight data.</p>
            <p className="text-sm">Please try refreshing the data.</p>
          </div>
        ) : !flightArrivals || flightArrivals.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>No flight data available.</p>
            <p>Click "Refresh Data" to fetch the latest flight information.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th key={column.key} className="p-3 text-left font-medium text-muted-foreground">
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flightArrivals.map((flight, index) => (
                  <tr key={flight.id || index} className="border-b hover:bg-muted/50">
                    {columns.map((column) => (
                      <td key={`${flight.id || index}-${column.key}`} className="p-3">
                        {column.render 
                          ? column.render(flight[column.key as keyof typeof flight])
                          : flight[column.key as keyof typeof flight]?.toString()}
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
  );
};

export default FlightArrivalManager;
