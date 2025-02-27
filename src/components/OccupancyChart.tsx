
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getOccupancyRates } from "@/services/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{`Occupancy: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const OccupancyChart = () => {
  const { data: occupancyRates, isLoading, error } = useQuery({
    queryKey: ['occupancyRates'],
    queryFn: getOccupancyRates
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[300px]">Loading occupancy data...</div>;
  }

  if (error || !occupancyRates) {
    return <div className="flex justify-center items-center h-[300px]">Error loading occupancy data</div>;
  }

  // Format the data for the chart
  const chartData = occupancyRates.map(rate => ({
    month: rate.month,
    occupancy: rate.rate,
    year: rate.year
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="occupancy" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
