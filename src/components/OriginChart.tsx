
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getOriginCountries } from "@/services/api";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#94a3b8"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const OriginChart = () => {
  const { data: originCountries, isLoading, error } = useQuery({
    queryKey: ['originCountries'],
    queryFn: getOriginCountries
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[300px]">Loading origin data...</div>;
  }

  if (error || !originCountries) {
    return <div className="flex justify-center items-center h-[300px]">Error loading origin data</div>;
  }

  // Format the data for the chart
  const chartData = originCountries.map(country => ({
    country: country.country_name,
    value: country.percentage,
    color: country.color
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="country"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OriginChart;
