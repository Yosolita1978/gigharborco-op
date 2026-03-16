"use client";

import { useEffect, useMemo, useState } from "react";

interface ActivityData {
  date: string;
  count: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getColor(count: number, max: number): string {
  if (count === 0) return "rgba(0,0,0,0.03)";
  const intensity = Math.min(count / max, 1);
  if (intensity <= 0.25) return "#cef9e8";
  if (intensity <= 0.5) return "#a8e6cf";
  if (intensity <= 0.75) return "#89c8cd";
  return "#4a9aa1";
}

export default function ActivityHeatmap({
  data,
  year,
}: {
  data: ActivityData[];
  year: number;
}) {
  const { weeks, maxCount, monthPositions } = useMemo(() => {
    const activityMap = new Map<string, number>();
    let maxCount = 1;

    data.forEach((d) => {
      activityMap.set(d.date, d.count);
      if (d.count > maxCount) maxCount = d.count;
    });

    const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    const monthPositions: { month: string; weekIndex: number }[] = [];
    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];
    let lastMonth = -1;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const dayOfWeek = d.getDay();
      const month = d.getMonth();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      if (month !== lastMonth) {
        monthPositions.push({
          month: MONTHS[month],
          weekIndex: weeks.length,
        });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
        dayOfWeek,
      });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, maxCount, monthPositions };
  }, [data, year]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cellSize = 14;
  const cellGap = 3;
  const leftPadding = 32;
  const topPadding = 24;

  if (!mounted) {
    return (
      <div className="rounded-2xl bg-white border border-foreground/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl text-foreground">
              Daily Activity — {year}
            </h3>
            <p className="text-sm text-foreground/50 mt-1">
              Each square is a day — darker means more transactions logged that day
            </p>
          </div>
        </div>
        <div className="h-40" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl text-foreground">
            Daily Activity — {year}
          </h3>
          <p className="text-sm text-foreground/50 mt-1">
            Each square is a day — darker means more transactions logged that day
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground/50">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
            <div
              key={intensity}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: getColor(
                  intensity * maxCount,
                  maxCount
                ),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={leftPadding + weeks.length * (cellSize + cellGap) + 10}
          height={topPadding + 7 * (cellSize + cellGap) + 10}
        >
          {/* Month labels */}
          {monthPositions.map(({ month, weekIndex }) => (
            <text
              key={month}
              x={leftPadding + weekIndex * (cellSize + cellGap)}
              y={16}
              fontSize="11"
              fill="rgba(0,0,0,0.4)"
            >
              {month}
            </text>
          ))}

          {/* Day labels */}
          {DAYS.map((day, i) => (
            <text
              key={i}
              x={0}
              y={topPadding + i * (cellSize + cellGap) + 11}
              fontSize="11"
              fill="rgba(0,0,0,0.4)"
            >
              {day}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, weekIndex) =>
            week.map((day) => (
              <rect
                key={day.date}
                x={leftPadding + weekIndex * (cellSize + cellGap)}
                y={topPadding + day.dayOfWeek * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                rx={3}
                fill={getColor(day.count, maxCount)}
              >
                <title>
                  {day.date}: {day.count} transaction{day.count !== 1 ? "s" : ""}
                </title>
              </rect>
            ))
          )}
        </svg>
      </div>
    </div>
  );
}
