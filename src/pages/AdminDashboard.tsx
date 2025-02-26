
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import VisitorStatsManager from '@/components/admin/VisitorStatsManager';
import OriginCountriesManager from '@/components/admin/OriginCountriesManager';
import OccupancyRatesManager from '@/components/admin/OccupancyRatesManager';
import TouristSpendingManager from '@/components/admin/TouristSpendingManager';
import AttractionsManager from '@/components/admin/AttractionsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('visitor-stats');
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="container py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage tourism data for Langkawi
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="visitor-stats">Visitor Stats</TabsTrigger>
            <TabsTrigger value="origin-countries">Origin Countries</TabsTrigger>
            <TabsTrigger value="occupancy-rates">Occupancy Rates</TabsTrigger>
            <TabsTrigger value="tourist-spending">Tourist Spending</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
