"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MemberStats {
  active: number;
  pending: number;
  inactive: number;
}

const STATUS_CONFIG = [
  { key: "active", label: "Active", color: "#89c8cd" },
  { key: "pending", label: "Pending", color: "#f5d6a8" },
  { key: "inactive", label: "Inactive", color: "#e6c9ce" },
] as const;

export default function MemberDonut({ stats }: { stats: MemberStats }) {
  const total = stats.active + stats.pending + stats.inactive;

  const chartData = STATUS_CONFIG.map((s) => ({
    name: s.label,
    value: stats[s.key],
    color: s.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">Members</h3>
      <p className="text-sm text-foreground/50 mb-6">
        Current membership status — active members can log hours and volunteer
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-52 w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                cornerRadius={4}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fefefe",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "8px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  `${value} members`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-foreground/50">total</span>
          </div>
        </div>

        <div className="flex gap-6">
          {STATUS_CONFIG.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm text-foreground/60">
                {stats[s.key]} {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
