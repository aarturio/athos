"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0].payload;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded shadow-lg max-w-xs md:max-w-md">
      <p className="font-semibold text-gray-700">
        {new Date(label).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Stock price information */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Close:</span> $
          {dataPoint.price?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Open:</span> $
          {dataPoint.open?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">High:</span> $
          {dataPoint.high?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Low:</span> ${dataPoint.low?.toFixed(2)}
        </p>
      </div>

      {/* News information */}
      {dataPoint.newsCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="font-medium text-gray-700 mb-2">
            News ({dataPoint.newsCount})
          </p>
          {dataPoint.news.slice(0, 2).map((article, index) => (
            <div key={index} className="mb-2 pb-2 last:mb-0 last:pb-0">
              <p className="text-sm font-medium text-gray-800">
                {article.title}
              </p>
              <p className="text-xs mt-1 text-gray-600 line-clamp-2">
                {article.description}
              </p>
            </div>
          ))}
          {dataPoint.news.length > 2 && (
            <p className="text-xs mt-1 text-gray-500 italic">
              + {dataPoint.news.length - 2} more articles
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function Chart({ data }) {
  // Make sure data is an array before proceeding
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white">
        No data available
      </div>
    );
  }

  // Sort data by date for proper display
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const prices = sortedData.map((item) => Number(item.price) || 0);
  const minPrice = Math.floor(Math.min(...prices) / 10) * 10 - 20;
  const maxPrice = Math.ceil(Math.max(...prices) / 10) * 10 + 20;

  // Generate ticks for every $10
  const priceTicks = [];
  for (let i = minPrice; i <= maxPrice; i += 10) {
    priceTicks.push(i);
  }

  return (
    <div className="w-full h-[500px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={sortedData}
          margin={{ top: 30, right: 40, left: 25, bottom: 40 }}
          style={{ backgroundColor: "white" }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            }}
            stroke="#888"
            dy={10}
            padding={{ left: 30, right: 30 }}
            angle={-45} // Angle the dates to avoid overlapping
            textAnchor="end" // Align angled text
            height={60} // Provide more space for angled text
          />
          <YAxis
            yAxisId="price"
            domain={[minPrice, maxPrice]}
            ticks={priceTicks}
            tickFormatter={(value) => `$${value}`}
            label={{
              value: "Price",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
              dx: -15,
            }}
            stroke="#888"
            dx={-5}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            label={{
              value: "Volume",
              angle: 90,
              position: "insideRight",
              style: { textAnchor: "middle" },
              dx: 15,
            }}
            stroke="#888"
            dx={5}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="price"
            yAxisId="price"
            name="Stock Price"
            stroke="#ACEDFF"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#ACEDFF" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
