
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
  PieChart, LineChart, Map
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
          
          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Statistics</CardTitle>
                <CardDescription>
                  Detailed breakdown of visitors to Langkawi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  More detailed visitor statistics will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accommodation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accommodation Statistics</CardTitle>
                <CardDescription>
                  Hotel occupancy and accommodation data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  More detailed accommodation statistics will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="spending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tourist Spending</CardTitle>
                <CardDescription>
                  Economic impact and spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  More detailed spending statistics will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attractions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Attractions</CardTitle>
                <CardDescription>
                  Most visited places and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  More detailed attraction statistics will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">At a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Total Visitors (2023)</span>
                  </div>
                  <div className="font-medium">4,218,503</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plane className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">International Flights (Weekly)</span>
                  </div>
                  <div className="font-medium">86</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sailboat className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Ferry Arrivals (Daily)</span>
                  </div>
                  <div className="font-medium">124</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Average Occupancy Rate</span>
                  </div>
                  <div className="font-medium">76.3%</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Avg. Spend per Tourist (MYR)</span>
                  </div>
                  <div className="font-medium">2,840</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Beach Activities", percentage: 84 },
                  { name: "Island Hopping", percentage: 71 },
                  { name: "Cable Car & Sky Bridge", percentage: 68 },
                  { name: "Mangrove Tours", percentage: 54 },
                  { name: "Duty Free Shopping", percentage: 47 }
                ].map((activity, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{activity.name}</span>
                      <span className="font-medium">{activity.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          index === 0 ? "bg-blue-500" :
                          index === 1 ? "bg-green-500" :
                          index === 2 ? "bg-purple-500" :
                          index === 3 ? "bg-orange-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${activity.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Seasonal Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { month: "Jan-Mar", status: "High Season", trend: "+12%" },
                  { month: "Apr-Jun", status: "Shoulder Season", trend: "-4%" },
                  { month: "Jul-Sep", status: "Low Season", trend: "-18%" },
                  { month: "Oct-Dec", status: "Peak Season", trend: "+24%" }
                ].map((season, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{season.month}</div>
                      <div className="text-sm text-muted-foreground">{season.status}</div>
                    </div>
                    <Badge 
                      className={cn(
                        "text-xs",
                        season.trend.startsWith("+") 
                          ? "bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700" 
                          : "bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700"
                      )}
                    >
                      {season.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tourism Development Projects</CardTitle>
            <CardDescription>
              Current and upcoming tourism infrastructure projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Project Name</th>
                    <th scope="col" className="px-6 py-3">Location</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Completion</th>
                    <th scope="col" className="px-6 py-3">Investment (MYR)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Langkawi Waterfront Renovation", location: "Kuah", status: "In Progress", completion: "Q3 2024", investment: "18.5M" },
                    { name: "Cenang Beach Extension", location: "Pantai Cenang", status: "Planning", completion: "Q2 2025", investment: "12.7M" },
                    { name: "Eco-Tourism Park", location: "Gunung Raya", status: "Completed", completion: "Q4 2023", investment: "9.2M" },
                    { name: "Cable Car Expansion", location: "Oriental Village", status: "In Progress", completion: "Q1 2025", investment: "15.8M" },
                    { name: "Marina Upgrade", location: "Telaga Harbour", status: "Planning", completion: "Q4 2025", investment: "22.3M" },
                  ].map((project, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">{project.name}</td>
                      <td className="px-6 py-4">{project.location}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={cn(
                            project.status === "Completed" ? "bg-green-100 text-green-700" : 
                            project.status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                            "bg-orange-100 text-orange-700"
                          )}
                        >
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{project.completion}</td>
                      <td className="px-6 py-4">{project.investment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mb-4">
          A collaborative project between the Langkawi Development Authority (LADA) and Tourism Malaysia
        </div>
      </main>
    </div>
  );
};

export default Index;
