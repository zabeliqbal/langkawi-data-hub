
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Plane, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVisitorStats, getOccupancyRates, getTouristSpending } from "@/services/api";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
};

const StatCard = ({ title, value, change, icon, positive = true }: StatCardProps) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-4">
      <div className="rounded-full p-3 bg-gray-100">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <span className={`text-xs px-1.5 py-0.5 rounded-md ${
            positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {change}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsGrid = () => {
  const { data: visitorStats } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: getVisitorStats
  });

  const { data: occupancyRates } = useQuery({
    queryKey: ['occupancyRates'],
    queryFn: getOccupancyRates
  });

  const { data: touristSpending } = useQuery({
    queryKey: ['touristSpending'],
    queryFn: getTouristSpending
  });

  // Calculate statistics from data
  const getCurrentVisitors = () => {
    if (!visitorStats || visitorStats.length === 0) return "0";
    
    // Get the latest month's data
    const latestMonth = visitorStats[visitorStats.length - 1];
    return (latestMonth.domestic_visitors + latestMonth.international_visitors).toLocaleString();
  };

  const getVisitorChange = () => {
    if (!visitorStats || visitorStats.length < 2) return "+0%";
    
    const current = visitorStats[visitorStats.length - 1];
    const previous = visitorStats[visitorStats.length - 2];
    
    const currentTotal = current.domestic_visitors + current.international_visitors;
    const previousTotal = previous.domestic_visitors + previous.international_visitors;
    
    const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    return `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
  };

  const getLatestOccupancy = () => {
    if (!occupancyRates || occupancyRates.length === 0) return "0%";
    
    const latestRate = occupancyRates[occupancyRates.length - 1];
    return `${latestRate.rate.toFixed(1)}%`;
  };

  const getOccupancyChange = () => {
    if (!occupancyRates || occupancyRates.length < 2) return "+0%";
    
    const current = occupancyRates[occupancyRates.length - 1];
    const previous = occupancyRates[occupancyRates.length - 2];
    
    const percentChange = current.rate - previous.rate;
    
    return `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
  };

  const getLatestSpending = () => {
    if (!touristSpending || touristSpending.length === 0) return "RM 0";
    
    const spendingData = touristSpending.filter(item => item.category === 'Overall');
    if (spendingData.length === 0) return "RM 0";
    
    const latestSpending = spendingData[spendingData.length - 1];
    return `RM ${latestSpending.amount}`;
  };

  const getSpendingChange = () => {
    const spendingData = touristSpending?.filter(item => item.category === 'Overall') || [];
    if (spendingData.length < 2) return "+0%";
    
    const current = spendingData[spendingData.length - 1];
    const previous = spendingData[spendingData.length - 2];
    
    const percentChange = ((current.amount - previous.amount) / previous.amount) * 100;
    
    return `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
  };

  const stats = [
    { 
      title: "Daily Visitors", 
      value: getCurrentVisitors(), 
      change: getVisitorChange(), 
      icon: <Users className="h-5 w-5 text-blue-600" />,
      positive: !getVisitorChange().startsWith('-') 
    },
    { 
      title: "Occupancy Rate", 
      value: getLatestOccupancy(), 
      change: getOccupancyChange(), 
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      positive: !getOccupancyChange().startsWith('-') 
    },
    { 
      title: "Flight Arrivals", 
      value: "86", 
      change: "-2.3%", 
      icon: <Plane className="h-5 w-5 text-orange-600" />,
      positive: false 
    },
    { 
      title: "Average Spend", 
      value: getLatestSpending(), 
      change: getSpendingChange(), 
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      positive: !getSpendingChange().startsWith('-') 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
