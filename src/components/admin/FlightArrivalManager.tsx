import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlightArrivals } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Download, Upload } from 'lucide-react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tempFlightData, setTempFlightData] = useState<LiveFlightData[] | null>(null);

  const { data: flightArrivals, isLoading, error, refetch } = useQuery({
    queryKey: ['flightArrivals'],
    queryFn: getFlightArrivals
  });

  const downloadFlightData = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        'https://airports-prod-be.myairports.com.my/api/flights/search-flights?code=A&terminal=LGK&key=all&live=true&dayKey=0&value='
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch live flight data');
      }
      
      const data = await response.json();
      console.log("API Response:", data); // Log the full response to see its structure
      
      // Check if the data exists and properly handle different response structures
      let flightsData = [];
      if (data && Array.isArray(data)) {
        flightsData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        flightsData = data.data;
      } else if (data && data.result && Array.isArray(data.result)) {
        flightsData = data.result;
      } else {
        // If we can't find an array in the response, log it and throw an error
        console.error("Unexpected API response structure:", data);
        throw new Error('Unexpected API response structure');
      }
      
      // Transform the data to match our format
      const transformedData = flightsData.map((flight: any, index: number) => ({
        id: flight.id || `live-${flight.flight_number || index}-${Date.now()}`,
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
      
      setTempFlightData(transformedData);
      
      // Create a Blob containing the flight data
      const blob = new Blob([JSON.stringify(transformedData, null, 2)], { type: 'application/json' });
      
      // Create a download link for the temporary file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flight_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data Downloaded',
        description: `Downloaded ${transformedData.length} flights to temporary file`,
      });
    } catch (error) {
      console.error('Error downloading flight data:', error);
      toast({
        title: 'Error',
        description: `Failed to download flight data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const uploadFlightData = async () => {
    if (!tempFlightData || tempFlightData.length === 0) {
      toast({
        title: 'Error',
        description: 'No flight data available to upload. Please download data first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
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
        .insert(tempFlightData.map(flight => ({
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
        description: `Successfully uploaded ${tempFlightData.length} flights to database`,
      });
      
      // Clear the temporary data after successful upload
      setTempFlightData(null);
    } catch (error) {
      console.error('Error uploading flight data:', error);
      toast({
        title: 'Error',
        description: `Failed to upload flight data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchLiveFlightData = async () => {
    setIsRefreshing(true);
    try {
      // First download the data
      await downloadFlightData();
      
      // Then upload it to the database
      if (tempFlightData && tempFlightData.length > 0) {
        await uploadFlightData();
      }
      
      await refetch();
      
      toast({
        title: 'Success',
        description: 'Flight data refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing flight data:', error);
      toast({
        title: 'Error',
        description: `Failed to refresh flight data: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadFlightData}
              disabled={isDownloading}
            >
              <Download className={`h-4 w-4 mr-2 ${isDownloading ? 'animate-spin' : ''}`} />
              Download Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={uploadFlightData}
              disabled={isUploading || !tempFlightData}
            >
              <Upload className={`h-4 w-4 mr-2 ${isUploading ? 'animate-spin' : ''}`} />
              Upload to Database
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLiveFlightData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || isRefreshing || isDownloading || isUploading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">
              {isRefreshing ? 'Refreshing flight data...' : 
               isDownloading ? 'Downloading flight data...' :
               isUploading ? 'Uploading flight data...' :
               'Loading flight data...'}
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
            <p>Click "Refresh All" to fetch the latest flight information.</p>
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
        
        {tempFlightData && tempFlightData.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 font-medium">
              Temporary data downloaded ({tempFlightData.length} flights)
            </p>
            <p className="text-sm text-yellow-600">
              Click "Upload to Database" to save this data to the database.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightArrivalManager;
