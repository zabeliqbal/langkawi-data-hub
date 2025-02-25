
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

const data = [
  { month: "Jan", occupancy: 68, target: 65 },
  { month: "Feb", occupancy: 74, target: 65 },
  { month: "Mar", occupancy: 82, target: 70 },
  { month: "Apr", occupancy: 79, target: 70 },
  { month: "May", occupancy: 72, target: 65 },
  { month: "Jun", occupancy: 69, target: 65 },
  { month: "Jul", occupancy: 73, target: 65 },
  { month: "Aug", occupancy: 81, target: 70 },
  { month: "Sep", occupancy: 76, target: 70 },
  { month: "Oct", occupancy: 84, target: 75 },
  { month: "Nov", occupancy: 88, target: 75 },
  { month: "Dec", occupancy: 90, target: 80 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{`Occupancy: ${payload[0].value}%`}</p>
        <p className="text-gray-500">{`Target: ${payload[1].value}%`}</p>
      </div>
    );
  }
  return null;
};

const OccupancyChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#94a3b8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
