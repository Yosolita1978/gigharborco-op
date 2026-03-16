"use client";

interface YearStats {
  year: number;
  hoursEarned: number;
  hoursUsed: number;
  hoursDonated: number;
  transactions: number;
  activeMembers: number;
}

function TrendArrow({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  const isUp = change >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        isUp ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={isUp ? "" : "rotate-180"}
      >
        <path
          d="M6 2.5L10 7.5H2L6 2.5Z"
          fill="currentColor"
        />
      </svg>
      {Math.abs(Math.round(change))}%
    </span>
  );
}

function StatCard({
  label,
  current,
  previous,
  color,
}: {
  label: string;
  current: number;
  previous: number;
  color: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: color }}>
      <p className="text-xs font-medium text-foreground/50 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">
          {current.toLocaleString()}
        </span>
        <TrendArrow current={current} previous={previous} />
      </div>
      <p className="text-xs text-foreground/40 mt-1">
        vs {previous.toLocaleString()} last year
      </p>
    </div>
  );
}

export default function YearComparison({
  current,
  previous,
}: {
  current: YearStats;
  previous: YearStats;
}) {
  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <h3 className="font-serif text-xl text-foreground mb-2">
        {current.year} vs {previous.year}
      </h3>
      <p className="text-sm text-foreground/50 mb-6">
        How this year compares to last — green arrows mean growth, red arrows mean a decline
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          label="Hours Earned"
          current={Math.round(current.hoursEarned)}
          previous={Math.round(previous.hoursEarned)}
          color="rgba(45, 158, 166, 0.08)"
        />
        <StatCard
          label="Hours Used"
          current={Math.round(current.hoursUsed)}
          previous={Math.round(previous.hoursUsed)}
          color="rgba(230, 201, 206, 0.25)"
        />
        <StatCard
          label="Hours Donated"
          current={Math.round(current.hoursDonated)}
          previous={Math.round(previous.hoursDonated)}
          color="rgba(206, 249, 232, 0.3)"
        />
        <StatCard
          label="Transactions"
          current={current.transactions}
          previous={previous.transactions}
          color="rgba(123, 97, 255, 0.08)"
        />
        <StatCard
          label="Active Members"
          current={current.activeMembers}
          previous={previous.activeMembers}
          color="rgba(246, 166, 35, 0.1)"
        />
      </div>
    </div>
  );
}
