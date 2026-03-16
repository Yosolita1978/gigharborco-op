"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  label: string;
  total: number;
  newMembers: number;
}

export default function MemberGrowth({ data }: { data: GrowthData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No growth data available.</p>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Member Growth
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        How our community has grown since the beginning — each point shows the total number of onboarded members by that month
      </p>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d9ea6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2d9ea6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "rgba(0,0,0,0.5)" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(0,0,0,0.5)" }}
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
              formatter={(value, name) => [
                value,
                name === "total" ? "Total Members" : "New Members",
              ]}
              labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2d9ea6"
              strokeWidth={2.5}
              fill="url(#gradientGrowth)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
