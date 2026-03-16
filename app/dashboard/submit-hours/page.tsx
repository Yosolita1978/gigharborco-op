"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface Category {
  id: string;
  name: string;
}

export default function SubmitHours() {
  const router = useRouter();
  const supabase = createClient();

  const [memberId, setMemberId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form fields
  const [type, setType] = useState<"earned" | "used" | "donated">("earned");
  const [hours, setHours] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: member } = await supabase
        .from("members")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (member) {
        setMemberId(member.id);
      }

      const { data: cats } = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (cats) {
        setCategories(cats);
      }
    }

    loadData();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!memberId) {
      setError("No membership found. Please contact GHWC leadership.");
      return;
    }

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      setError("Please enter a valid number of hours.");
      return;
    }

    setLoading(true);

    const date = new Date(activityDate + "T00:00:00");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const { error: insertError } = await supabase.from("transactions").insert({
      member_id: memberId,
      type,
      hours: hoursNum,
      category_id: categoryId || null,
      description: description.trim() || null,
      activity_date: activityDate,
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      submitted_by: memberId,
      status: "pending",
    });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="bg-mint/20 rounded-2xl p-8 md:p-12">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Hours Submitted!
            </h1>
            <p className="text-foreground/60 mb-8">
              Your hours have been submitted and are pending review by a Time
              Bank manager.
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full bg-teal text-white font-semibold rounded-full px-8 py-3 hover:bg-teal-dark transition-colors text-center"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setHours("");
                  setCategoryId("");
                  setDescription("");
                  setActivityDate(new Date().toISOString().split("T")[0]);
                }}
                className="block w-full text-teal font-semibold rounded-full px-8 py-3 hover:bg-teal/10 transition-colors"
              >
                Submit More Hours
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-md">
        <div className="bg-mint/20 rounded-2xl p-8 md:p-12">
          <h1 className="font-serif text-3xl text-foreground mb-2 text-center">
            Submit Hours
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Log your Time Bank hours for review.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Type
              </label>
              <select
                id="type"
                required
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "earned" | "used" | "donated")
                }
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
              >
                <option value="earned">Earned</option>
                <option value="used">Used</option>
                <option value="donated">Donated</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="hours"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Hours
              </label>
              <input
                id="hours"
                type="number"
                required
                min="0.25"
                step="0.25"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="1.5"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
                placeholder="What did you do?"
              />
            </div>

            <div>
              <label
                htmlFor="activityDate"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Activity Date
              </label>
              <input
                id="activityDate"
                type="date"
                required
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal text-white font-semibold rounded-full px-8 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Hours"}
            </button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            <Link
              href="/dashboard"
              className="text-teal font-medium hover:underline"
            >
              &larr; Back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
