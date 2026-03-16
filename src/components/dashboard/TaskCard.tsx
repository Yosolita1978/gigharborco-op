"use client";

import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  urgency: "urgent" | "time_bound" | "flexible";
  preferred_dates: string | null;
  pets_present: boolean;
  children_welcome: boolean;
  mask_required: boolean;
  notes: string | null;
  requested_by: string;
}

const urgencyLabels: Record<string, { label: string; style: string }> = {
  urgent: { label: "Urgent", style: "bg-rose/30 text-rose-dark" },
  time_bound: { label: "Time-bound", style: "bg-teal/25 text-teal-deep" },
  flexible: { label: "Flexible", style: "bg-mint/30 text-teal-deep" },
};

export default function TaskCard({
  task,
  memberId,
  alreadyVolunteered,
}: {
  task: Task;
  memberId: string;
  alreadyVolunteered: boolean;
}) {
  const supabase = createClient();
  const [volunteered, setVolunteered] = useState(alreadyVolunteered);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwnTask = task.requested_by === memberId;
  const urgency = urgencyLabels[task.urgency] || urgencyLabels.flexible;

  async function handleVolunteer() {
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase
      .from("task_volunteers")
      .insert({
        task_id: task.id,
        member_id: memberId,
        status: "confirmed",
      });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setVolunteered(true);
  }

  const flags = [
    task.pets_present && "Pets present",
    task.children_welcome && "Children welcome",
    task.mask_required && "Mask required",
  ].filter(Boolean);

  return (
    <div className="rounded-2xl bg-white border border-foreground/10 p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-xl text-foreground">{task.title}</h3>
        <span
          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${urgency.style}`}
        >
          {urgency.label}
        </span>
      </div>

      {task.description && (
        <p className="text-foreground/70 mb-3">{task.description}</p>
      )}

      {task.preferred_dates && (
        <p className="text-sm text-foreground/60 mb-2">
          <span className="font-medium text-foreground/80">When: </span>
          {task.preferred_dates}
        </p>
      )}

      {flags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {flags.map((flag) => (
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
        <p className="text-sm text-foreground/50 italic mb-4">{task.notes}</p>
      )}

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {isOwnTask ? (
        <p className="text-sm text-foreground/50">Your request</p>
      ) : volunteered ? (
        <p className="text-sm text-teal font-medium">You volunteered</p>
      ) : (
        <button
          onClick={handleVolunteer}
          disabled={loading}
          className="bg-teal text-white font-semibold rounded-full px-6 py-2.5 text-sm hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Volunteer"}
        </button>
      )}
    </div>
  );
}
