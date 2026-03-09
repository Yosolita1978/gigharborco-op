import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import BalanceCards from "@/src/components/dashboard/BalanceCards";
import TransactionHistory from "@/src/components/dashboard/TransactionHistory";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("id, first_name, last_name, display_name, role, status")
    .eq("auth_user_id", user.id)
    .single();

  // Fetch balance and transactions only if member exists
  let balance = null;
  let transactions: {
    id: string;
    type: "earned" | "used" | "donated";
    hours: number;
    description: string | null;
    activity_date: string;
    month: string | null;
    year: number | null;
    category: { name: string } | null;
  }[] = [];

  if (member) {
    const { data: balanceData } = await supabase
      .from("balances")
      .select("hours_earned, hours_used, hours_donated, available")
      .eq("member_id", member.id)
      .single();

    balance = balanceData;

    const { data: txData } = await supabase
      .from("transactions")
      .select("id, type, hours, description, activity_date, month, year, category:categories(name)")
      .eq("member_id", member.id)
      .order("activity_date", { ascending: false });

    if (txData) {
      transactions = txData.map((t) => ({
        ...t,
        type: t.type as "earned" | "used" | "donated",
        category: Array.isArray(t.category) ? t.category[0] || null : t.category,
      }));
    }
  }

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">
              Welcome{member?.first_name ? `, ${member.first_name}` : ""}!
            </h1>
            {member ? (
              <p className="text-foreground/60 mt-1">
                {member.role === "admin"
                  ? "Admin"
                  : member.role === "manager"
                    ? "Manager"
                    : "Member"}{" "}
                &middot;{" "}
                {member.status === "active" ? "Active" : "Pending"}
              </p>
            ) : (
              <p className="text-foreground/60 mt-1">
                No membership found for {user.email}. Please contact GHWC
                leadership.
              </p>
            )}
          </div>
          <SignOutButton />
        </div>

        {member && (
          <div className="space-y-8">
            <BalanceCards balance={balance} />
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </div>
    </section>
  );
}
