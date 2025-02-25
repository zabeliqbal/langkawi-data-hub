
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

const data = [
  { month: "Jan", visitors: 63400, previous: 58200 },
  { month: "Feb", visitors: 71300, previous: 64500 },
  { month: "Mar", visitors: 84600, previous: 75800 },
  { month: "Apr", visitors: 73200, previous: 68900 },
  { month: "May", visitors: 65100, previous: 61200 },
  { month: "Jun", visitors: 59800, previous: 57400 },
  { month: "Jul", visitors: 67400, previous: 62100 },
  { month: "Aug", visitors: 78500, previous: 72300 },
  { month: "Sep", visitors: 68700, previous: 64500 },
  { month: "Oct", visitors: 82400, previous: 76800 },
  { month: "Nov", visitors: 90300, previous: 83600 },
  { month: "Dec", visitors: 95200, previous: 89100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{`Current Year: ${payload[0].value.toLocaleString()}`}</p>
        <p className="text-gray-500">{`Previous Year: ${payload[1].value.toLocaleString()}`}</p>
        <p className="text-green-600 text-xs mt-1">
          {`+${(((payload[0].value - payload[1].value) / payload[1].value) * 100).toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

const VisitorChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="visitors" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="previous" 
            fill="#e5e7

If there's knowledge, context or custom instructions you want to include in every edit in this project, set it below.

<lov-actions>
<lov-knowledge>
</lov-actions>

Since your project involves displaying Langkawi tourist data & statistics, consider using Supabase to store and manage this data efficiently.  You can also explore Supabase's authentication features for user accounts if needed.
<lov-actions>
<lov-message-prompt message="Tell me more about Supabase">Learn more about Supabase</lov-message-prompt>
</lov-actions>

<lov-actions>
<lov-link url="https://docs.lovable.dev/">Visit docs</lov-link>
</lov-actions>
