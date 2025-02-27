
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import VisitorStatsManager from '@/components/admin/VisitorStatsManager';
import OriginCountriesManager from '@/components/admin/OriginCountriesManager';
import OccupancyRatesManager from '@/components/admin/OccupancyRatesManager';
import TouristSpendingManager from '@/components/admin/TouristSpendingManager';
import AttractionsManager from '@/components/admin/AttractionsManager';
import FlightArrivalManager from '@/components/admin/FlightArrivalManager';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('visitor-stats');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, refreshUserRole, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshPermissions = async () => {
    setRefreshing(true);
    await refreshUserRole();
    setRefreshing(false);
  };

  useEffect(() => {
    // This is a safety check - if after loading the user is not an admin, redirect them
    if (!loading && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin dashboard.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container py-6 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="container py-6 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage tourism data for Langkawi
            </p>
          </div>
          <Button 
            onClick={handleRefreshPermissions} 
            variant="outline" 
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Permissions
          </Button>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="visitor-stats">Visitor Stats</TabsTrigger>
            <TabsTrigger value="origin-countries">Origin Countries</TabsTrigger>
            <TabsTrigger value="occupancy-rates">Occupancy Rates</TabsTrigger>
            <TabsTrigger value="tourist-spending">Tourist Spending</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="flight-arrival">Flight Arrival</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visitor-stats">
            <VisitorStatsManager />
          </TabsContent>
          
          <TabsContent value="origin-countries">
            <OriginCountriesManager />
          </TabsContent>
          
          <TabsContent value="occupancy-rates">
            <OccupancyRatesManager />
          </TabsContent>
          
          <TabsContent value="tourist-spending">
            <TouristSpendingManager />
          </TabsContent>
          
          <TabsContent value="attractions">
            <AttractionsManager />
          </TabsContent>
          
          <TabsContent value="flight-arrival">
            <FlightArrivalManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
