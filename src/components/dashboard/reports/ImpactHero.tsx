"use client";

import { useEffect, useState } from "react";

interface ImpactData {
  totalMembers: number;
  totalHoursServed: number;
  categoriesActive: number;
  yearsFounded: number;
}

function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const steps = 80;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const eased = 1 - Math.pow(1 - current / steps, 4);
      setDisplay(Math.round(value * eased));
      if (current >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ImpactHero({ data }: { data: ImpactData }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-teal via-teal-dark to-teal-deep p-8 sm:p-12 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/3 rounded-full" />

      <div className="relative">
        <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">
          Community Impact
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl mb-8">
          Together, we&apos;re making a difference
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <p className="text-4xl sm:text-5xl font-bold mb-1">
              <AnimatedCounter value={data.totalHoursServed} suffix="+" />
            </p>
            <p className="text-white/60 text-sm">Hours of Service</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold mb-1">
              <AnimatedCounter value={data.totalMembers} />
            </p>
            <p className="text-white/60 text-sm">Members Strong</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold mb-1">
              <AnimatedCounter value={data.categoriesActive} />
            </p>
            <p className="text-white/60 text-sm">Ways to Help</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-bold mb-1">
              <AnimatedCounter value={data.yearsFounded} suffix=" yrs" />
            </p>
            <p className="text-white/60 text-sm">Serving Gig Harbor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
