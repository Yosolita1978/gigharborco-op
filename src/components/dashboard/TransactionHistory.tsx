"use client";

import { useState, useMemo } from "react";

interface Transaction {
  id: string;
  type: "earned" | "used" | "donated";
  hours: number;
  description: string | null;
  activity_date: string;
  month: string | null;
  year: number | null;
  category: { name: string } | null;
}

const typeLabels: Record<string, string> = {
  earned: "Earned",
  used: "Used",
  donated: "Donated",
};

const typeColors: Record<string, string> = {
  earned: "bg-teal/15 text-teal-deep",
  used: "bg-rose/30 text-rose-dark",
  donated: "bg-mint/30 text-teal-deep",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [yearFilter, setYearFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const years = useMemo(() => {
    const set = new Set<number>();
    transactions.forEach((t) => {
      if (t.year) set.add(t.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [transactions]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category?.name) set.add(t.category.name);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (yearFilter !== "all" && t.year !== Number(yearFilter)) return false;
      if (
        categoryFilter !== "all" &&
        t.category?.name !== categoryFilter
      )
        return false;
      return true;
    });
  }, [transactions, yearFilter, categoryFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="font-serif text-xl text-foreground">
          Transaction History
        </h2>
        <div className="flex gap-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-sm border border-foreground/20 rounded-lg px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-foreground/20 rounded-lg px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-warm-gray rounded-2xl p-8 text-center">
          <p className="text-foreground/60">No transactions found.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/50 mb-3">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Mobile: card layout */}
          <div className="sm:hidden space-y-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-foreground/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/50">
                    {formatDate(t.activity_date)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[t.type]}`}
                  >
                    {typeLabels[t.type]}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t.category?.name || "—"}
                </p>
                {t.description && (
                  <p className="text-sm text-foreground/60 mt-0.5">
                    {t.description}
                  </p>
                )}
                <p className="text-lg font-bold text-foreground mt-2">
                  {t.hours} hr{t.hours !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-foreground/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-warm-gray text-foreground/70 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-foreground/[0.02]">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(t.activity_date)}
                    </td>
                    <td className="px-4 py-3">
                      {t.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {t.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[t.type]}`}
                      >
                        {typeLabels[t.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {t.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
