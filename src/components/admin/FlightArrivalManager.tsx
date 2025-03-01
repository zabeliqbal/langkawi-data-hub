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
      
      const rawData = await response.json();
      console.log("Raw API Response:", rawData); // Log the raw response
      
      // Extract flight data by examining the structure more thoroughly
      let flightsData: any[] = [];
      
      // Try to find arrays at different levels of the response
      if (Array.isArray(rawData)) {
        flightsData = rawData;
        console.log("Found flight data as top-level array");
      } else if (typeof rawData === 'object' && rawData !== null) {
        // Search for arrays in the first level properties
        const possibleArrays = Object.entries(rawData)
          .filter(([_, value]) => Array.isArray(value) && value.length > 0)
          .map(([key, value]) => ({key, value}));
        
        console.log("Possible array properties:", possibleArrays.map(p => p.key));
        
        if (possibleArrays.length > 0) {
          // If we find arrays, use the one that looks most like flight data
          // Typically flight data would have properties like flight_number, origin, etc.
          const likelyFlightData = possibleArrays.find(p => 
            Array.isArray(p.value) && 
            p.value.length > 0 && 
            (p.value[0].flight_number || 
             p.value[0].flightNumber || 
             p.value[0].airline_name || 
             p.value[0].origin)
          );
          
          if (likelyFlightData) {
            flightsData = likelyFlightData.value;
            console.log(`Found flight data in '${likelyFlightData.key}' property`);
          } else {
            // If we couldn't identify flight data by key, just use the first array found
            flightsData = possibleArrays[0].value;
            console.log(`Using first array found in '${possibleArrays[0].key}' property`);
          }
        } else {
          // If we still don't have flight data, log the keys to help debugging
          console.log("No arrays found in the first level. Response keys:", Object.keys(rawData));
          
          // Try to look one level deeper for arrays
          for (const [key, value] of Object.entries(rawData)) {
            if (typeof value === 'object' && value !== null) {
              for (const [nestedKey, nestedValue] of Object.entries(value)) {
                if (Array.isArray(nestedValue) && nestedValue.length > 0) {
                  flightsData = nestedValue;
                  console.log(`Found flight data in nested property '${key}.${nestedKey}'`);
                  break;
                }
              }
              if (flightsData.length > 0) break;
            }
          }
        }
      }
      
      if (flightsData.length === 0) {
        console.error("Could not locate flight data in the response:", rawData);
        throw new Error('Could not locate flight data in the API response');
      }
      
      console.log("Found flight data:", flightsData.slice(0, 2)); // Log first two items for debugging
      
      // Transform the data to match our format
      const transformedData = flightsData.map((flight: any, index: number) => {
        // Try to extract flight info with various possible property names
        const flightNumber = flight.flight_number || flight.flightNumber || flight.flight_id || `UNKNOWN-${index}`;
        
        // Fix airline name mapping - get it from the name property
        const airlineName = flight.name || flight.airline_name || flight.airlineName || flight.airline || 'Unknown Airline';
        
        // Fix origin mapping - get it from origin.city if available
        let originCity = '';
        if (flight.origin && typeof flight.origin === 'object' && flight.origin.city) {
          originCity = flight.origin.city;
        } else {
          originCity = flight.origin || flight.from || flight.departure_airport || '';
        }
        
        return {
          id: flight.id || `live-${flightNumber}-${Date.now()}`,
          airline_code: flight.airline_code || flight.airlineCode || '',
          airline_name: airlineName,
          flight_number: flightNumber,
          origin: originCity,
          scheduled_time: flight.scheduled_time || flight.scheduledTime || flight.std || '',
          estimated_time: flight.estimated_time || flight.estimatedTime || flight.etd || '',
          status: flight.status || 'SCH',
          terminal: flight.terminal || '',
          date: new Date().toISOString().split('T')[0],
        };
      });
      
      console.log("Transformed data:", transformedData.slice(0, 2)); // Log first two transformed items
      
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
