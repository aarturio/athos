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
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm">
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">
          {data.date}
        </p>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
          {data.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
          {data.description}
        </p>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            Count: <span className="ml-1 font-bold">{data.count}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Chart({ data }) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Data Timeline
      </h3>
      <ResponsiveContainer width="100%" height={400} className="mt-2">
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ stroke: "#8884d8", strokeWidth: 2, r: 4, fill: "white" }}
            activeDot={{
              r: 8,
              stroke: "#8884d8",
              strokeWidth: 2,
              fill: "#8884d8",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
