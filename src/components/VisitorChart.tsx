
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getVisitorStats } from "@/services/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{`International: ${payload[0].value.toLocaleString()}`}</p>
        <p className="text-green-600">{`Domestic: ${payload[1].value.toLocaleString()}`}</p>
        <p className="text-gray-500 text-xs mt-1">
          {`Total: ${(payload[0].value + payload[1].value).toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const VisitorChart = () => {
  const { data: visitorStats, isLoading, error } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: getVisitorStats
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[300px]">Loading visitor data...</div>;
  }

  if (error || !visitorStats) {
    return <div className="flex justify-center items-center h-[300px]">Error loading visitor data</div>;
  }

  // Format the data for the chart
  const chartData = visitorStats.map((stat) => ({
    month: stat.month,
    international: stat.international_visitors,
    domestic: stat.domestic_visitors,
    year: stat.year
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="international" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="domestic" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorChart;
