"use client";

import { useEffect, useState } from "react";

interface Contributor {
  name: string;
  hours: number;
}

const MEDALS = [
  { bg: "bg-amber-400/20", border: "border-amber-400", text: "text-amber-600", icon: "🥇" },
  { bg: "bg-gray-300/20", border: "border-gray-400", text: "text-gray-500", icon: "🥈" },
  { bg: "bg-orange-300/20", border: "border-orange-400", text: "text-orange-600", icon: "🥉" },
];

const BAR_COLORS = [
  "#f6a623", "#c0c0c0", "#cd7f32", "#2d9ea6", "#e85d75",
  "#7b61ff", "#36b37e", "#00b8d9", "#ff5630", "#6554c0",
];

export default function TopContributors({
  data,
}: {
  data: Contributor[];
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (data.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No contributor data yet.</p>
    );
  }

  const maxHours = data[0]?.hours || 1;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Top Contributors
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        Members who have earned the most hours across all time — our community champions
      </p>

      {/* Podium — Top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Reorder: 2nd, 1st, 3rd for podium effect */}
          {[top3[1], top3[0], top3[2]].map((contributor, displayIndex) => {
            if (!contributor) return <div key={displayIndex} />;
            const actualRank = displayIndex === 1 ? 0 : displayIndex === 0 ? 1 : 2;
            const medal = MEDALS[actualRank];
            const isFirst = actualRank === 0;

            return (
              <div
                key={contributor.name}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 sm:p-5 transition-all duration-700 ${medal.bg} ${medal.border} ${isFirst ? "sm:-mt-4" : "mt-2 sm:mt-0"}`}
                style={{
                  opacity: animated ? 1 : 0,
                  transform: animated ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${actualRank * 150}ms`,
                }}
              >
                <span className="text-3xl sm:text-4xl">{medal.icon}</span>
                <span className="text-sm sm:text-base font-semibold text-foreground text-center leading-tight">
                  {contributor.name}
                </span>
                <span className={`text-xl sm:text-2xl font-bold ${medal.text}`}>
                  {contributor.hours.toLocaleString()}h
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Rest — Bar chart */}
      {rest.length > 0 && (
        <div className="space-y-3">
          {rest.map((contributor, i) => {
            const widthPercent = (contributor.hours / maxHours) * 100;
            const rank = i + 4;

            return (
              <div key={contributor.name} className="flex items-center gap-3">
                <div className="w-7 text-center shrink-0">
                  <span className="text-sm font-bold text-foreground/30">
                    {rank}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {contributor.name}
                    </span>
                    <span className="text-sm font-bold ml-2 shrink-0" style={{ color: BAR_COLORS[i + 3] }}>
                      {contributor.hours.toLocaleString()}h
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: animated ? `${widthPercent}%` : "0%",
                        backgroundColor: BAR_COLORS[i + 3],
                        transition: `width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(i + 3) * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
