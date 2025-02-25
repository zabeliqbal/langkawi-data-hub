
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", domestic: 680, international: 1240 },
  { month: "Feb", domestic: 720, international: 1320 },
  { month: "Mar", domestic: 790, international: 1480 },
  { month: "Apr", domestic: 740, international: 1380 },
  { month: "May", domestic: 710, international: 1290 },
  { month: "Jun", domestic: 690, international: 1260 },
  { month: "Jul", domestic: 730, international: 1350 },
  { month: "Aug", domestic: 780, international: 1420 },
  { month: "Sep", domestic: 750, international: 1360 },
  { month: "Oct", domestic: 810, international: 1510 },
  { month: "Nov", domestic: 850, international: 1580 },
  { month: "Dec", domestic: 890, international: 1640 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-green-600">{`International: RM ${payload[1].value}`}</p>
        <p className="text-blue-600">{`Domestic: RM ${payload[0].value}`}</p>
        <p className="text-gray-500 text-xs mt-1">
          {`Average: RM ${Math.round((payload[0].value + payload[1].value) / 2)}`}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            tickFormatter={(value) => `RM ${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="domestic" 
            stackId="1"
            stroke="#3b82f6" 
            fill="#93c5fd" 
          />
          <Area 
            type="monotone" 
            dataKey="international" 
            stackId="1"
            stroke="#10b981" 
            fill="#6ee7b7" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
