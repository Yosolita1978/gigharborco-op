import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import PendingTransactions from "@/src/components/dashboard/PendingTransactions";
import PendingTasks from "@/src/components/dashboard/PendingTasks";

export default async function Manage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (!member || member.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch pending transactions with member names
  const { data: pendingTx } = await supabase
    .from("transactions")
    .select(
      "id, type, hours, description, activity_date, member:members!transactions_member_id_fkey(first_name, last_name, display_name)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const transactions = (pendingTx || []).map((tx) => {
    const m = Array.isArray(tx.member) ? tx.member[0] : tx.member;
    const memberName = m
      ? m.display_name || `${m.first_name || ""} ${m.last_name || ""}`.trim()
      : "Unknown member";
    return {
      id: tx.id,
      type: tx.type as "earned" | "used" | "donated",
      hours: tx.hours,
      description: tx.description,
      activity_date: tx.activity_date,
      member_name: memberName,
    };
  });

  // Fetch pending tasks with requester names
  const { data: pendingTasks } = await supabase
    .from("tasks")
    .select(
      "id, title, description, urgency, preferred_dates, location, pets_present, children_welcome, mask_required, notes, requester:members!tasks_requested_by_fkey(first_name, last_name, display_name)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const tasks = (pendingTasks || []).map((task) => {
    const r = Array.isArray(task.requester)
      ? task.requester[0]
      : task.requester;
    const requesterName = r
      ? r.display_name || `${r.first_name || ""} ${r.last_name || ""}`.trim()
      : "Unknown member";
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      urgency: task.urgency as "urgent" | "time_bound" | "flexible",
      preferred_dates: task.preferred_dates,
      location: task.location,
      pets_present: task.pets_present,
      children_welcome: task.children_welcome,
      mask_required: task.mask_required,
      notes: task.notes,
      requester_name: requesterName,
    };
  });

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-foreground">Manage</h1>
          <Link
            href="/dashboard"
            className="text-sm text-teal font-medium hover:underline"
          >
            &larr; Dashboard
          </Link>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-4">
              Pending Hours
              {transactions.length > 0 && (
                <span className="ml-2 text-base font-sans text-foreground/50">
                  ({transactions.length})
                </span>
              )}
            </h2>
            <PendingTransactions
              transactions={transactions}
              reviewerId={member.id}
            />
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-4">
              Pending Task Requests
              {tasks.length > 0 && (
                <span className="ml-2 text-base font-sans text-foreground/50">
                  ({tasks.length})
                </span>
              )}
            </h2>
            <PendingTasks tasks={tasks} />
          </div>
        </div>
      </div>
    </section>
  );
}
