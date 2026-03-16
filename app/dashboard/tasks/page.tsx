import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import TaskCard from "@/src/components/dashboard/TaskCard";

export default async function Tasks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!member) {
    return (
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-foreground/60">
            No membership found for {user.email}. Please contact GHWC
            leadership.
          </p>
        </div>
      </section>
    );
  }

  // Fetch approved/posted tasks (RLS handles visibility)
  const { data: tasks } = await supabase
    .from("tasks")
    .select(
      "id, title, description, urgency, preferred_dates, pets_present, children_welcome, mask_required, notes, requested_by, status, created_at"
    )
    .in("status", ["approved", "posted"])
    .order("created_at", { ascending: false });

  // Fetch this member's volunteer records to know which tasks they already signed up for
  const { data: myVolunteers } = await supabase
    .from("task_volunteers")
    .select("task_id")
    .eq("member_id", member.id);

  const volunteeredTaskIds = new Set(
    (myVolunteers || []).map((v) => v.task_id)
  );

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-foreground">
            Community Tasks
          </h1>
          <Link
            href="/dashboard/request-help"
            className="text-sm text-teal font-medium hover:underline"
          >
            Request Help
          </Link>
        </div>

        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground/60 mb-4">
              No tasks posted right now. Check back soon!
            </p>
            <Link
              href="/dashboard"
              className="text-teal font-medium hover:underline"
            >
              &larr; Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  ...task,
                  urgency: task.urgency as
                    | "urgent"
                    | "time_bound"
                    | "flexible",
                }}
                memberId={member.id}
                alreadyVolunteered={volunteeredTaskIds.has(task.id)}
              />
            ))}
          </div>
        )}

        <p className="text-center text-sm text-foreground/60 mt-8">
          <Link
            href="/dashboard"
            className="text-teal font-medium hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </p>
      </div>
    </section>
  );
}
