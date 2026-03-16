"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

interface PendingTransaction {
  id: string;
  type: "earned" | "used" | "donated";
  hours: number;
  description: string | null;
  activity_date: string;
  member_name: string;
}

const typeColors: Record<string, string> = {
  earned: "bg-teal/15 text-teal-deep",
  used: "bg-rose/30 text-rose-dark",
  donated: "bg-mint/30 text-teal-deep",
};

export default function PendingTransactions({
  transactions,
  reviewerId,
}: {
  transactions: PendingTransaction[];
  reviewerId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(
    transactionId: string,
    newStatus: "approved" | "rejected"
  ) {
    setError("");
    setProcessing(transactionId);

    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: newStatus,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    setProcessing(null);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">No pending hours to review.</p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="rounded-2xl bg-white border border-foreground/10 p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground truncate">
                  {tx.member_name}
                </span>
                <span
                  className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeColors[tx.type]}`}
                >
                  {tx.type}
                </span>
              </div>
              <p className="text-sm text-foreground/60">
                {tx.hours} hour{tx.hours !== 1 ? "s" : ""} &middot;{" "}
                {new Date(tx.activity_date + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </p>
              {tx.description && (
                <p className="text-sm text-foreground/50 mt-1">
                  {tx.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(tx.id, "approved")}
                disabled={processing === tx.id}
                className="bg-teal text-white font-semibold rounded-full px-5 py-2 text-sm hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(tx.id, "rejected")}
                disabled={processing === tx.id}
                className="border-2 border-rose text-rose-dark font-semibold rounded-full px-5 py-2 text-sm hover:bg-rose/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
