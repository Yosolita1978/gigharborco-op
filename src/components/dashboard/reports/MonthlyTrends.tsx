"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyData {
  label: string;
  earned: number;
  used: number;
  donated: number;
}

export default function MonthlyTrends({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No monthly data available.</p>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Hours Over Time
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        Monthly breakdown of hours earned, used, and donated — shows how active our community has been recently
      </p>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientEarned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#89c8cd" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#89c8cd" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientUsed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e6c9ce" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#e6c9ce" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientDonated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cef9e8" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#cef9e8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.5)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.5)" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#fefefe",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span style={{ color: "rgba(0,0,0,0.6)", fontSize: "13px" }}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="earned"
              stroke="#89c8cd"
              strokeWidth={2.5}
              fill="url(#gradientEarned)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="used"
              stroke="#d4a8b0"
              strokeWidth={2.5}
              fill="url(#gradientUsed)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="donated"
              stroke="#a8e6cf"
              strokeWidth={2.5}
              fill="url(#gradientDonated)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
