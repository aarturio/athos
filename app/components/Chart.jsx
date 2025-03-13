// components/Chart.js
"use client"; // Client Component for Recharts

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Full data object for that date
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{data.date}</p>
        <p>{data.title}</p>
        <p className="text-sm text-gray-600">{data.description}</p>
      </div>
    );
  }
  return null;
};

export default function Chart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      {" "}
      {/* Taller for readability */}
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count" // Number of articles per day
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
