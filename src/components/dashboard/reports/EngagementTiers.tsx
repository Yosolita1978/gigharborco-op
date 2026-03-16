"use client";

import { useEffect, useState } from "react";

interface TierData {
  label: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export default function EngagementTiers({
  title,
  subtitle,
  tiers,
}: {
  title: string;
  subtitle: string;
  tiers: TierData[];
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground/50 mb-6">{subtitle}</p>

      {/* Pyramid visualization */}
      <div className="flex flex-col items-center gap-2 mb-8">
        {tiers.map((tier, i) => {
          const widthPercent = 30 + i * 18;
          return (
            <div
              key={tier.label}
              className="relative flex items-center justify-center py-3 rounded-xl text-center transition-all duration-700"
              style={{
                width: animated ? `${widthPercent}%` : "10%",
                backgroundColor: tier.color,
                transitionDelay: `${i * 150}ms`,
                minWidth: "120px",
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-white">
                  {tier.count}
                </span>
                <span className="text-xs text-white/80">{tier.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiers.map((tier) => (
          <div key={tier.label} className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0 mt-0.5"
              style={{ backgroundColor: tier.color }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {tier.label}{" "}
                <span className="text-foreground/40">
                  ({tier.percentage}%)
                </span>
              </p>
              <p className="text-xs text-foreground/50">{tier.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
