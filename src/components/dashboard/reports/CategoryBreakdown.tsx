"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CategoryData {
  name: string;
  hours: number;
}

const COLORS = [
  "#2d9ea6", "#e85d75", "#f6a623", "#7b61ff", "#36b37e",
  "#00b8d9", "#ff5630", "#6554c0", "#ffab00", "#00875a",
  "#0065ff", "#ff8b00",
];

export default function CategoryBreakdown({
  data,
}: {
  data: CategoryData[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No category data available.</p>
    );
  }

  const maxHours = Math.max(...data.map((d) => d.hours));

  const chartData = data
    .slice(0, 10)
    .map((d, i) => ({
      ...d,
      fill: COLORS[i % COLORS.length],
      // Recharts RadialBar needs a value field for the bar length
      value: d.hours,
    }))
    .reverse();

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Hours by Category
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        Where our members spend their time — larger bars mean more hours logged in that category
      </p>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-56 w-56 sm:h-72 sm:w-72 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="15%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={-180}
              barSize={12}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: "rgba(0,0,0,0.03)" }}
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
                formatter={(value) => [
                  `${value} hours`,
                  "",
                ]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {data.slice(0, 10).map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm text-foreground/70 flex-1 truncate">
                {cat.name}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-foreground/5 overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(cat.hours / maxHours) * 100}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-16 text-right">
                  {cat.hours.toLocaleString()}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
