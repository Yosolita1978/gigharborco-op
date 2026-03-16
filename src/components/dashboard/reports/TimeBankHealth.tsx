"use client";

import { useEffect, useState } from "react";

interface HealthData {
  totalEarned: number;
  totalUsed: number;
  totalDonated: number;
}

export default function TimeBankHealth({ data }: { data: HealthData }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const total = data.totalEarned + data.totalUsed + data.totalDonated;
  const earnedPct = total > 0 ? (data.totalEarned / total) * 100 : 0;
  const usedPct = total > 0 ? (data.totalUsed / total) * 100 : 0;
  const donatedPct = total > 0 ? (data.totalDonated / total) * 100 : 0;

  const ratio = data.totalUsed > 0
    ? (data.totalEarned / data.totalUsed).toFixed(1)
    : "∞";

  // Health score: ratio of earned to used.
  // >3:1 = amazing, 2-3:1 = healthy, 1-2:1 = ok, <1:1 = concerning
  const ratioNum = data.totalUsed > 0 ? data.totalEarned / data.totalUsed : 10;
  const healthLabel =
    ratioNum >= 3 ? "Thriving" :
    ratioNum >= 2 ? "Healthy" :
    ratioNum >= 1 ? "Balanced" :
    "Needs Attention";
  const healthColor =
    ratioNum >= 3 ? "#2d9ea6" :
    ratioNum >= 2 ? "#36b37e" :
    ratioNum >= 1 ? "#f6a623" :
    "#e85d75";

  // Gauge angle: map ratio 0-5 to 0-180 degrees
  const gaugeAngle = Math.min((ratioNum / 5) * 180, 180);

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        Time Bank Health
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        The ratio of hours earned vs hours used — a higher ratio means members are giving more than they&apos;re requesting, which shows a generous community
      </p>

      <div className="flex flex-col items-center gap-6">
        {/* Gauge */}
        <div className="relative w-48 h-28 sm:w-56 sm:h-32">
          <svg className="w-full h-full" viewBox="0 0 200 110">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={healthColor}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="251.3"
              strokeDashoffset={animated ? 251.3 - (gaugeAngle / 180) * 251.3 : 251.3}
              style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
            />
            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.cos(Math.PI - (animated ? gaugeAngle : 0) * (Math.PI / 180))}
              y2={100 - 60 * Math.sin(Math.PI - (animated ? gaugeAngle : 0) * (Math.PI / 180))}
              stroke="#333"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ transition: "all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
            />
            <circle cx="100" cy="100" r="5" fill="#333" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <p className="text-2xl font-bold" style={{ color: healthColor }}>
              {ratio}:1
            </p>
          </div>
        </div>

        <p className="text-lg font-semibold" style={{ color: healthColor }}>
          {healthLabel}
        </p>

        {/* Distribution bar */}
        <div className="w-full">
          <div className="h-4 rounded-full overflow-hidden flex">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: animated ? `${earnedPct}%` : "0%",
                backgroundColor: "#2d9ea6",
              }}
            />
            <div
              className="h-full transition-all duration-1000 delay-200"
              style={{
                width: animated ? `${usedPct}%` : "0%",
                backgroundColor: "#e85d75",
              }}
            />
            <div
              className="h-full transition-all duration-1000 delay-300"
              style={{
                width: animated ? `${donatedPct}%` : "0%",
                backgroundColor: "#f6a623",
              }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-foreground/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#2d9ea6" }} />
              Earned ({Math.round(earnedPct)}%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#e85d75" }} />
              Used ({Math.round(usedPct)}%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f6a623" }} />
              Donated ({Math.round(donatedPct)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
