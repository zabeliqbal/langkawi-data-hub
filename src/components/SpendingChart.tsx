
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getTouristSpending } from "@/services/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-green-600">{`RM ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomCategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-green-600">{`RM ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  const { data: touristSpending, isLoading, error } = useQuery({
    queryKey: ['touristSpending'],
    queryFn: getTouristSpending
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[300px]">Loading spending data...</div>;
  }

  if (error || !touristSpending) {
    return <div className="flex justify-center items-center h-[300px]">Error loading spending data</div>;
  }

  // Format the monthly data for the chart
  const monthlyData = touristSpending
    .filter(item => item.category === 'Overall')
    .map(item => ({
      month: item.month,
      amount: item.amount,
      year: item.year
    }));

  // Format the category data
  const categoryData = touristSpending
    .filter(item => item.category !== 'Overall')
    .map(item => ({
      name: item.category,
      amount: item.amount
    }));

  // Check if we should show categories or monthly data
  const showCategories = categoryData.length > 0 && window.location.pathname.includes('spending');

  if (showCategories) {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `RM ${value}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip content={<CustomCategoryTooltip />} />
            <Bar
              dataKey="amount"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `RM ${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            fill="#d1fae5" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
