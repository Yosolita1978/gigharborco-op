"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SeasonalData {
  month: string;
  hours: number;
}

export default function SeasonalRadar({ data }: { data: SeasonalData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No seasonal data available.</p>
    );
  }

  const maxHours = Math.max(...data.map((d) => d.hours));
  const peakMonth = data.reduce((a, b) => (a.hours > b.hours ? a : b));
  const quietMonth = data.reduce((a, b) => (a.hours < b.hours ? a : b));

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Seasonal Rhythm
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        Which months see the most activity across all years — helps plan events and resources around peak times
      </p>
      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(0,0,0,0.08)" />
            <PolarAngleAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.5)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, maxHours]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="hours"
              stroke="#2d9ea6"
              fill="#89c8cd"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: "#2d9ea6", strokeWidth: 0 }}
            />
            <Tooltip
              contentStyle={{
                background: "#fefefe",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                padding: "8px 14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value} hours`, "Activity"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-deep" />
          <span className="text-foreground/60">
            Peak: <span className="font-semibold text-foreground">{peakMonth.month}</span> ({peakMonth.hours.toLocaleString()}h)
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rose" />
          <span className="text-foreground/60">
            Quietest: <span className="font-semibold text-foreground">{quietMonth.month}</span> ({quietMonth.hours.toLocaleString()}h)
          </span>
        </div>
      </div>
    </div>
  );
}
