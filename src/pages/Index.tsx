
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Users, MapPin, Plane, Sailboat, Utensils, Bed, 
  DollarSign, CreditCard, CalendarDays, BarChart3,
  PieChart, LineChart, Map, ArrowUpRight, DownloadCloud,
  Calendar, Filter, ArrowRight, Percent, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import VisitorChart from "@/components/VisitorChart";
import OriginChart from "@/components/OriginChart";
import OccupancyChart from "@/components/OccupancyChart";
import SpendingChart from "@/components/SpendingChart";
import AttractionMap from "@/components/AttractionMap";
import StatsGrid from "@/components/StatsGrid";
import Header from "@/components/Header";

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<string>("6months");
  
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Langkawi Tourism Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                The official data hub for Langkawi Island tourism statistics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
                  <span>Live Data</span>
                </div>
              </Badge>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString("en-MY", { 
                  day: "numeric", 
                  month: "short", 
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <StatsGrid />
          
          <Card className="md:w-64">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="text-xs font-medium mb-2">Filter by Time</div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs font-medium mb-2">Filter by Category</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Visitors
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Bed className="mr-2 h-4 w-4" />
                    Hotels
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px] mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Monthly Visitors</CardTitle>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Total visitors by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <VisitorChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Visitor Origin</CardTitle>
                    <Button variant="outline" size="sm">
                      <PieChart className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Top countries of origin
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <OriginChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Hotel Occupancy Rate</CardTitle>
                    <Button variant="outline" size="sm">
                      <LineChart className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Percentage of occupied rooms
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <OccupancyChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Tourist Spending</CardTitle>
                    <Button variant="outline" size="sm">
                      <LineChart className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Average spending per tourist (MYR)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SpendingChart />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Popular Attractions</CardTitle>
                  <Button variant="outline" size="sm">
                    <Map className="h-4 w-4 mr-2" />
                    Full Map
                  </Button>
                </div>
                <CardDescription>
                  Most visited locations in Langkawi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttractionMap />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visitors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Visitor Statistics</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <DownloadCloud className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors (2023)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">4,218,503</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +12.4%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Compared to 3,751,982 visitors in 2022</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">International Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">1,845,129</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +23.8%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">43.7% of total visitors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Domestic Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">2,373,374</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +5.2%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">56.3% of total visitors</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Visitor Trends (2023)</CardTitle>
                  <CardDescription>
                    Monthly breakdown of international vs. domestic visitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <VisitorChart />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Demographics</CardTitle>
                  <CardDescription>
                    Age group and gender distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Age Groups</div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { group: "18-24", percentage: 14, color: "bg-blue-500" },
                          { group: "25-34", percentage: 32, color: "bg-purple-500" },
                          { group: "35-44", percentage: 28, color: "bg-orange-500" },
                          { group: "45-54", percentage: 16, color: "bg-green-500" },
                          { group: "55+", percentage: 10, color: "bg-red-500" },
                        ].map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.group}</span>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full">
                              <div 
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Gender Distribution</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">51%</div>
                          <div className="text-sm text-muted-foreground">Male</div>
                        </div>
                        <div className="text-center p-3 bg-pink-50 rounded-lg">
                          <div className="text-lg font-bold text-pink-600">49%</div>
                          <div className="text-sm text-muted-foreground">Female</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries of Origin</CardTitle>
                  <CardDescription>
                    International visitor countries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <OriginChart />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="text-sm font-medium">Top 5 Countries</div>
                      {[
                        { country: "China", visitors: 425680, change: "+42%" },
                        { country: "Singapore", visitors: 287305, change: "+18%" },
                        { country: "Thailand", visitors: 164820, change: "+15%" },
                        { country: "United Kingdom", visitors: 134520, change: "+22%" },
                        { country: "Australia", visitors: 95460, change: "+28%" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full ${
                              index === 0 ? "bg-blue-500" :
                              index === 1 ? "bg-green-500" :
                              index === 2 ? "bg-purple-500" :
                              index === 3 ? "bg-orange-500" :
                              "bg-red-500"
                            } mr-2`}></div>
                            <span>{item.country}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium mr-2">{item.visitors.toLocaleString()}</span>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {item.change}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Visitor Entry Points</CardTitle>
                <CardDescription>
                  How visitors are arriving to Langkawi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Plane className="h-4 w-4 mr-2 text-blue-500" />
                        <div className="text-base font-medium">By Air</div>
                      </div>
                      <div className="text-lg font-bold">2,573,287</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: "61%" }}
                        />
                      </div>
                      <div className="text-xs text-center text-muted-foreground">61% of total visitors</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sailboat className="h-4 w-4 mr-2 text-green-500" />
                        <div className="text-base font-medium">By Ferry</div>
                      </div>
                      <div className="text-lg font-bold">1,581,938</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full rounded-full bg-green-500"
                          style={{ width: "37.5%" }}
                        />
                      </div>
                      <div className="text-xs text-center text-muted-foreground">37.5% of total visitors</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sailboat className="h-4 w-4 mr-2 text-purple-500" />
                        <div className="text-base font-medium">Cruise Ships</div>
                      </div>
                      <div className="text-lg font-bold">63,278</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: "1.5%" }}
                        />
                      </div>
                      <div className="text-xs text-center text-muted-foreground">1.5% of total visitors</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accommodation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Accommodation Statistics</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <DownloadCloud className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">76.3%</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +5.8%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Up from 70.5% in 2022</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Hotel Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">7,856</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +320
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Across 124 hotels and resorts</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Length of Stay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">3.8 days</div>
                    <Badge className="bg-green-100 text-green-700">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> 
                      +0.4
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Increased from 3.4 days in 2022</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Occupancy Rates (2023)</CardTitle>
                  <CardDescription>
                    Percentage of rooms occupied each month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <OccupancyChart />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accommodation Categories</CardTitle>
                  <CardDescription>
                    Distribution by hotel ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "5-Star Luxury", rooms: 2845, hotels: 18, rate: 85.2, color: "bg-purple-500" },
                      { category: "4-Star", rooms: 2510, hotels: 32, rate: 79.4, color: "bg-blue-500" },
                      { category: "3-Star", rooms: 1680, hotels: 43, rate: 72.6, color: "bg-green-500" },
                      { category: "Budget", rooms: 821, hotels: 31, rate: 68.8, color: "bg-orange-500" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">{item.category}</div>
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{item.rate}% occupancy</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${(item.rooms / 7856) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.hotels} properties</span>
                          <span>{item.rooms} rooms ({Math.round((item.rooms / 7856) * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Areas</CardTitle>
                  <CardDescription>
                    Accommodation distribution by location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { area: "Pantai Cenang", hotels: 42, rate: 88 },
                        { area: "Pantai Tengah", hotels: 28, rate: 82 },
                        { area: "Kuah Town", hotels: 35, rate: 70 },
                        { area: "Pantai Kok", hotels: 12, rate: 76 },
                      ].map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-lg font-bold">{item.area}</div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{item.hotels} hotels</span>
                            <span>{item.rate}% occ.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="text-sm font-medium mb-4">Accommodation Types</div>
                      <div className="space-y-3">
                        {[
                          { type: "Hotels & Resorts", percentage: 68 },
                          { type: "Guesthouses", percentage: 18 },
                          { type: "Vacation Rentals", percentage: 12 },
                          { type: "Homestays", percentage: 2 },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-1/2 text-sm">{item.type}</div>
                            <div className="w-1/2">
                              <div className="w-full h-2 bg-gray-100 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${
                                    index === 0 ? "bg-blue-500" :
                                    index === 1 ? "bg-green-500" :
                                    index === 2 ? "bg-purple-500" :
                                    "bg-orange-500"
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-right mt-1">{item.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>New Developments</CardTitle>
                <CardDescription>
                  Upcoming and recent accommodation projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Property Name</th>
                        <th scope="col" className="px-6 py-3">Location</th>
                        <th scope="col" className="px-6 py-3">Rooms</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Grand Langkawi Resort & Spa", location: "Tanjung Rhu", rooms: 210, category: "5-Star", status: "Construction", completion: "Q3 2024" },
                        { name: "Cenang Bay Villas", location: "Pantai Cenang", rooms: 84, category: "4-Star", status: "Planning", completion: "Q1 2025" },
                        { name: "The Orient Langkawi", location: "Kuah", rooms: 156, category: "5-Star", status: "Construction", completion: "Q4 2024" },
                        { name: "Rainforest Retreat", location: "Gunung Raya", rooms: 42, category: "Boutique", status: "Completed", completion: "Q4 2023" },
                      