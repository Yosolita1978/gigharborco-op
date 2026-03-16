import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import ImpactHero from "@/src/components/dashboard/reports/ImpactHero";
import StatRing from "@/src/components/dashboard/reports/StatRing";
import MonthlyTrends from "@/src/components/dashboard/reports/MonthlyTrends";
import CategoryBreakdown from "@/src/components/dashboard/reports/CategoryBreakdown";
import TopContributors from "@/src/components/dashboard/reports/TopContributors";
import ActivityHeatmap from "@/src/components/dashboard/reports/ActivityHeatmap";
import MemberDonut from "@/src/components/dashboard/reports/MemberDonut";
import MemberGrowth from "@/src/components/dashboard/reports/MemberGrowth";
import EngagementTiers from "@/src/components/dashboard/reports/EngagementTiers";
import SeasonalRadar from "@/src/components/dashboard/reports/SeasonalRadar";
import YearComparison from "@/src/components/dashboard/reports/YearComparison";
import TimeBankHealth from "@/src/components/dashboard/reports/TimeBankHealth";

export default async function Reports() {
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

  if (!member || !["manager", "admin"].includes(member.role)) {
    redirect("/dashboard");
  }

  // --- Fetch all data ---

  // Members with onboarded dates
  const { data: allMembers } = await supabase
    .from("members")
    .select("status, onboarded_date");

  const memberStats = { active: 0, pending: 0, inactive: 0 };
  (allMembers || []).forEach((m) => {
    if (m.status === "active") memberStats.active++;
    else if (m.status === "pending") memberStats.pending++;
    else memberStats.inactive++;
  });

  // All approved transactions
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select(
      "type, hours, activity_date, month, year, member_id, category:categories(name), member:members!transactions_member_id_fkey(first_name, last_name, display_name)"
    )
    .eq("status", "approved");

  const transactions = (allTransactions || []).map((t) => ({
    type: t.type as "earned" | "used" | "donated",
    hours: t.hours as number,
    activity_date: t.activity_date as string,
    month: t.month as string | null,
    year: t.year as number | null,
    member_id: t.member_id as string,
    category: Array.isArray(t.category) ? t.category[0] : t.category,
    member: Array.isArray(t.member) ? t.member[0] : t.member,
  }));

  // Active categories count
  const { count: categoriesActive } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Total hours
  let totalEarned = 0;
  let totalUsed = 0;
  let totalDonated = 0;

  transactions.forEach((t) => {
    if (t.type === "earned") totalEarned += t.hours;
    else if (t.type === "used") totalUsed += t.hours;
    else if (t.type === "donated") totalDonated += t.hours;
  });

  const totalHours = totalEarned + totalUsed + totalDonated;

  // Pending counts
  const { count: pendingHours } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: pendingTasks } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  // --- Member Growth ---
  const growthMap = new Map<string, number>();
  (allMembers || []).forEach((m) => {
    if (!m.onboarded_date) return;
    const d = new Date(m.onboarded_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    growthMap.set(key, (growthMap.get(key) || 0) + 1);
  });

  const growthKeys = Array.from(growthMap.keys()).sort();
  let cumulative = 0;
  const memberGrowthData = growthKeys.map((key) => {
    const newMembers = growthMap.get(key) || 0;
    cumulative += newMembers;
    const [y, m] = key.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      label: `${monthNames[parseInt(m) - 1]} ${y.slice(2)}`,
      total: cumulative,
      newMembers,
    };
  });

  // --- Monthly Trends ---
  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const monthlyMap = new Map<string, { earned: number; used: number; donated: number }>();
  transactions.forEach((t) => {
    if (!t.year || !t.month) return;
    const key = `${t.year}-${t.month}`;
    const existing = monthlyMap.get(key) || { earned: 0, used: 0, donated: 0 };
    existing[t.type] += t.hours;
    monthlyMap.set(key, existing);
  });

  const monthlyData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => {
      const [yearA, monthA] = a.split("-");
      const [yearB, monthB] = b.split("-");
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    })
    .slice(-12)
    .map(([key, values]) => {
      const [, month] = key.split("-");
      return {
        label: month.slice(0, 3),
        earned: Math.round(values.earned * 100) / 100,
        used: Math.round(values.used * 100) / 100,
        donated: Math.round(values.donated * 100) / 100,
      };
    });

  // --- Category Breakdown ---
  const categoryMap = new Map<string, number>();
  transactions.forEach((t) => {
    const catName = t.category?.name || "Uncategorized";
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + t.hours);
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([name, hours]) => ({ name, hours: Math.round(hours * 100) / 100 }))
    .sort((a, b) => b.hours - a.hours);

  // --- Top Contributors ---
  const contributorMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.type !== "earned") return;
    const name = t.member
      ? t.member.display_name ||
        `${t.member.first_name || ""} ${t.member.last_name || ""}`.trim()
      : "Unknown";
    contributorMap.set(name, (contributorMap.get(name) || 0) + t.hours);
  });

  const topContributors = Array.from(contributorMap.entries())
    .map(([name, hours]) => ({ name, hours: Math.round(hours * 100) / 100 }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);

  // --- Engagement Tiers ---
  const totalActiveMembers = memberStats.active + memberStats.pending;

  // Lifetime engagement
  const lifetimeHoursMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.type !== "earned") return;
    lifetimeHoursMap.set(
      t.member_id,
      (lifetimeHoursMap.get(t.member_id) || 0) + t.hours
    );
  });

  let ltSuperActive = 0;
  let ltActive = 0;
  let ltOccasional = 0;

  lifetimeHoursMap.forEach((hours) => {
    if (hours >= 20) ltSuperActive++;
    else if (hours >= 5) ltActive++;
    else ltOccasional++;
  });

  const ltNeverLogged = Math.max(0, totalActiveMembers - ltSuperActive - ltActive - ltOccasional);

  const lifetimeTiers = [
    {
      label: "Champions",
      count: ltSuperActive,
      percentage: totalActiveMembers > 0 ? Math.round((ltSuperActive / totalActiveMembers) * 100) : 0,
      color: "#2d9ea6",
      description: "20+ hours earned across all time",
    },
    {
      label: "Contributors",
      count: ltActive,
      percentage: totalActiveMembers > 0 ? Math.round((ltActive / totalActiveMembers) * 100) : 0,
      color: "#36b37e",
      description: "5–20 hours earned across all time",
    },
    {
      label: "Getting Started",
      count: ltOccasional,
      percentage: totalActiveMembers > 0 ? Math.round((ltOccasional / totalActiveMembers) * 100) : 0,
      color: "#f6a623",
      description: "Under 5 hours earned — just getting involved",
    },
    {
      label: "Haven't Logged Yet",
      count: ltNeverLogged,
      percentage: totalActiveMembers > 0 ? Math.round((ltNeverLogged / totalActiveMembers) * 100) : 0,
      color: "#e0e0e0",
      description: "Onboarded but no hours logged yet — potential to engage",
    },
  ];

  // Recent engagement (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentCutoff = sixMonthsAgo.toISOString().split("T")[0];

  const recentHoursMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.type !== "earned" || t.activity_date < recentCutoff) return;
    recentHoursMap.set(
      t.member_id,
      (recentHoursMap.get(t.member_id) || 0) + t.hours
    );
  });

  let rcSuperActive = 0;
  let rcActive = 0;
  let rcOccasional = 0;

  recentHoursMap.forEach((hours) => {
    if (hours >= 10) rcSuperActive++;
    else if (hours >= 3) rcActive++;
    else rcOccasional++;
  });

  const rcInactive = Math.max(0, totalActiveMembers - rcSuperActive - rcActive - rcOccasional);

  const recentTiers = [
    {
      label: "Very Active",
      count: rcSuperActive,
      percentage: totalActiveMembers > 0 ? Math.round((rcSuperActive / totalActiveMembers) * 100) : 0,
      color: "#2d9ea6",
      description: "10+ hours in the last 6 months",
    },
    {
      label: "Active",
      count: rcActive,
      percentage: totalActiveMembers > 0 ? Math.round((rcActive / totalActiveMembers) * 100) : 0,
      color: "#36b37e",
      description: "3–10 hours in the last 6 months",
    },
    {
      label: "Light Activity",
      count: rcOccasional,
      percentage: totalActiveMembers > 0 ? Math.round((rcOccasional / totalActiveMembers) * 100) : 0,
      color: "#f6a623",
      description: "Under 3 hours in the last 6 months",
    },
    {
      label: "Inactive Recently",
      count: rcInactive,
      percentage: totalActiveMembers > 0 ? Math.round((rcInactive / totalActiveMembers) * 100) : 0,
      color: "#e0e0e0",
      description: "No hours in the last 6 months — may need re-engagement",
    },
  ];

  // --- Seasonal Radar ---
  const seasonalMap = new Map<string, number>();
  monthOrder.forEach((m) => seasonalMap.set(m.slice(0, 3), 0));

  transactions.forEach((t) => {
    if (!t.month) return;
    const short = t.month.slice(0, 3);
    seasonalMap.set(short, (seasonalMap.get(short) || 0) + t.hours);
  });

  const seasonalData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ].map((m) => ({
    month: m,
    hours: Math.round(seasonalMap.get(m) || 0),
  }));

  // --- Year over Year ---
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  function getYearStats(year: number) {
    const yearTx = transactions.filter((t) => t.year === year);
    const activeMemberIds = new Set(yearTx.map((t) => t.member_id));
    return {
      year,
      hoursEarned: yearTx.filter((t) => t.type === "earned").reduce((s, t) => s + t.hours, 0),
      hoursUsed: yearTx.filter((t) => t.type === "used").reduce((s, t) => s + t.hours, 0),
      hoursDonated: yearTx.filter((t) => t.type === "donated").reduce((s, t) => s + t.hours, 0),
      transactions: yearTx.length,
      activeMembers: activeMemberIds.size,
    };
  }

  const currentYearStats = getYearStats(currentYear);
  const previousYearStats = getYearStats(previousYear);

  // --- Activity Heatmap ---
  const activityMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.activity_date.startsWith(String(currentYear))) {
      activityMap.set(t.activity_date, (activityMap.get(t.activity_date) || 0) + 1);
    }
  });

  const prevActivityMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.activity_date.startsWith(String(previousYear))) {
      prevActivityMap.set(t.activity_date, (prevActivityMap.get(t.activity_date) || 0) + 1);
    }
  });

  const heatmapYear = activityMap.size >= prevActivityMap.size ? currentYear : previousYear;
  const heatmapData = Array.from(
    heatmapYear === currentYear ? activityMap : prevActivityMap
  ).map(([date, count]) => ({ date, count }));

  // --- Years active (from earliest onboarded_date) ---
  const onboardedDates = (allMembers || [])
    .filter((m) => m.onboarded_date)
    .map((m) => new Date(m.onboarded_date));
  const earliestDate = onboardedDates.length > 0
    ? new Date(Math.min(...onboardedDates.map((d) => d.getTime())))
    : new Date();
  const yearsFounded = Math.max(1, currentYear - earliestDate.getFullYear());

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Reports</h1>
            <p className="text-foreground/60 mt-1">
              How our community is doing
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-teal font-medium hover:underline"
          >
            &larr; Dashboard
          </Link>
        </div>

        {/* Impact Hero Banner */}
        <div className="mb-8">
          <ImpactHero
            data={{
              totalMembers: (allMembers || []).length,
              totalHoursServed: Math.round(totalHours),
              categoriesActive: categoriesActive || 0,
              yearsFounded,
            }}
          />
        </div>

        {/* Year over Year + Time Bank Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <YearComparison current={currentYearStats} previous={previousYearStats} />
          <TimeBankHealth
            data={{
              totalEarned: Math.round(totalEarned),
              totalUsed: Math.round(totalUsed),
              totalDonated: Math.round(totalDonated),
            }}
          />
        </div>

        {/* Stat Rings */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatRing
            label="Hours Earned"
            value={Math.round(totalEarned)}
            max={Math.round(totalHours)}
            color="#2d9ea6"
            suffix="hours"
          />
          <StatRing
            label="Hours Used"
            value={Math.round(totalUsed)}
            max={Math.round(totalEarned)}
            color="#e85d75"
            suffix="hours"
          />
          <StatRing
            label="Hours Donated"
            value={Math.round(totalDonated)}
            max={Math.round(totalEarned)}
            color="#f6a623"
            suffix="hours"
          />
          <StatRing
            label="Pending Review"
            value={(pendingHours || 0) + (pendingTasks || 0)}
            max={Math.max((pendingHours || 0) + (pendingTasks || 0), 10)}
            color="#7b61ff"
            suffix="items"
          />
        </div>

        {/* Monthly Trends */}
        <div className="mb-8">
          <MonthlyTrends data={monthlyData} />
        </div>

        {/* Member Growth */}
        <div className="mb-8">
          <MemberGrowth data={memberGrowthData} />
        </div>

        {/* Engagement — Lifetime vs Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EngagementTiers
            title="Lifetime Engagement"
            subtitle="How engaged our members have been since they joined — shows the full picture of participation across all time"
            tiers={lifetimeTiers}
          />
          <EngagementTiers
            title="Recent Activity"
            subtitle="What engagement looks like in the last 6 months — helps identify who is active now and who might need outreach"
            tiers={recentTiers}
          />
        </div>

        {/* Seasonal Radar */}
        <div className="mb-8">
          <SeasonalRadar data={seasonalData} />
        </div>

        {/* Category + Members side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <CategoryBreakdown data={categoryData} />
          </div>
          <div>
            <MemberDonut stats={memberStats} />
          </div>
        </div>

        {/* Top Contributors */}
        <div className="mb-8">
          <TopContributors data={topContributors} />
        </div>

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap data={heatmapData} year={heatmapYear} />
        </div>
      </div>
    </section>
  );
}
