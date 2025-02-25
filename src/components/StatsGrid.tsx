
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Plane, CreditCard } from "lucide-react";

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
  const stats = [
    { 
      title: "Daily Visitors", 
      value: "1,248", 
      change: "+12.5%", 
      icon: <Users className="h-5 w-5 text-blue-600" />,
      positive: true 
    },
    { 
      title: "Monthly Total", 
      value: "38.4K", 
      change: "+5.2%", 
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      positive: true 
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
      value: "RM 980", 
      change: "+8.7%", 
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      positive: true 
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
