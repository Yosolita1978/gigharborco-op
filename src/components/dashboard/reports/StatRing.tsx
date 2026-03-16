"use client";

import { useEffect, useState } from "react";

interface StatRingProps {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}

export default function StatRing({
  label,
  value,
  max,
  color,
  suffix = "",
}: StatRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const eased = 1 - Math.pow(1 - current / steps, 3); // ease-out cubic
      setAnimatedValue(Math.round(value * eased));
      setAnimatedProgress(progress * eased);
      if (current >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, progress]);

  const strokeDashoffset =
    circumference - animatedProgress * circumference;

  return (
    <div className="flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl bg-white border border-foreground/10">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-foreground/5"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-bold text-foreground">
            {animatedValue.toLocaleString()}
          </span>
          {suffix && (
            <span className="text-xs text-foreground/50">{suffix}</span>
          )}
        </div>
      </div>
      <p className="text-sm font-medium text-foreground/70 text-center">
        {label}
      </p>
    </div>
  );
}
