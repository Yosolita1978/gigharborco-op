"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

interface PendingTask {
  id: string;
  title: string;
  description: string | null;
  urgency: "urgent" | "time_bound" | "flexible";
  preferred_dates: string | null;
  location: string | null;
  pets_present: boolean;
  children_welcome: boolean;
  mask_required: boolean;
  notes: string | null;
  requester_name: string;
}

const urgencyLabels: Record<string, { label: string; style: string }> = {
  urgent: { label: "Urgent", style: "bg-rose/30 text-rose-dark" },
  time_bound: { label: "Time-bound", style: "bg-teal/25 text-teal-deep" },
  flexible: { label: "Flexible", style: "bg-mint/30 text-teal-deep" },
};

export default function PendingTasks({ tasks }: { tasks: PendingTask[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(
    taskId: string,
    newStatus: "posted" | "cancelled"
  ) {
    setError("");
    setProcessing(taskId);

    const { error: updateError } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    setProcessing(null);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.refresh();
  }

  if (tasks.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">
        No pending task requests to review.
      </p>
    );
  }

  const flags = (task: PendingTask) =>
    [
      task.pets_present && "Pets present",
      task.children_welcome && "Children welcome",
      task.mask_required && "Mask required",
    ].filter(Boolean);

  return (
    <div className="space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {tasks.map((task) => {
        const urgency =
          urgencyLabels[task.urgency] || urgencyLabels.flexible;
        const taskFlags = flags(task);

        return (
          <div
            key={task.id}
            className="rounded-2xl bg-white border border-foreground/10 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-foreground">
                  {task.title}
                </h3>
                <p className="text-sm text-foreground/60">
                  Requested by {task.requester_name}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${urgency.style}`}
              >
                {urgency.label}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-foreground/70 mb-2">
                {task.description}
              </p>
            )}

            {task.preferred_dates && (
              <p className="text-sm text-foreground/60 mb-2">
                <span className="font-medium text-foreground/80">When: </span>
                {task.preferred_dates}
              </p>
            )}

            {task.location && (
              <p className="text-sm text-foreground/60 mb-2">
                <span className="font-medium text-foreground/80">
                  Location:{" "}
                </span>
                {task.location}
              </p>
            )}

            {taskFlags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {taskFlags.map((flag) => (
                  <span
                    key={flag as string}
                    className="text-xs bg-foreground/5 text-foreground/60 px-2.5 py-1 rounded-full"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            )}

            {task.notes && (
              <p className="text-sm text-foreground/50 italic mb-3">
                {task.notes}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleAction(task.id, "posted")}
                disabled={processing === task.id}
                className="bg-teal text-white font-semibold rounded-full px-5 py-2 text-sm hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve & Post
              </button>
              <button
                onClick={() => handleAction(task.id, "cancelled")}
                disabled={processing === task.id}
                className="border-2 border-rose text-rose-dark font-semibold rounded-full px-5 py-2 text-sm hover:bg-rose/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
