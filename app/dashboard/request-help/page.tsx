"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function RequestHelp() {
  const router = useRouter();
  const supabase = createClient();

  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"urgent" | "time_bound" | "flexible">(
    "flexible"
  );
  const [preferredDates, setPreferredDates] = useState("");
  const [location, setLocation] = useState("");
  const [petsPresent, setPetsPresent] = useState(false);
  const [childrenWelcome, setChildrenWelcome] = useState(false);
  const [maskRequired, setMaskRequired] = useState(false);
  const [notes, setNotes] = useState("");

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

    setLoading(true);

    const { error: insertError } = await supabase.from("tasks").insert({
      requested_by: memberId,
      title: title.trim(),
      description: description.trim() || null,
      urgency,
      preferred_dates: preferredDates.trim() || null,
      location: location.trim() || null,
      pets_present: petsPresent,
      children_welcome: childrenWelcome,
      mask_required: maskRequired,
      notes: notes.trim() || null,
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
              Request Submitted!
            </h1>
            <p className="text-foreground/60 mb-8">
              Your request has been submitted and is pending approval. A manager
              will review it and post it for volunteers.
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
                  setTitle("");
                  setDescription("");
                  setUrgency("flexible");
                  setPreferredDates("");
                  setLocation("");
                  setPetsPresent(false);
                  setChildrenWelcome(false);
                  setMaskRequired(false);
                  setNotes("");
                }}
                className="block w-full text-teal font-semibold rounded-full px-8 py-3 hover:bg-teal/10 transition-colors"
              >
                Submit Another Request
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
            Request Help
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Let our community know how we can help you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                What do you need help with?
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="e.g., Help moving furniture"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Details
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
                placeholder="Any details that would help a volunteer understand what's needed"
              />
            </div>

            <div>
              <label
                htmlFor="urgency"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Urgency
              </label>
              <select
                id="urgency"
                required
                value={urgency}
                onChange={(e) =>
                  setUrgency(
                    e.target.value as "urgent" | "time_bound" | "flexible"
                  )
                }
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
              >
                <option value="flexible">Flexible — no rush</option>
                <option value="time_bound">Time-bound — by a specific date</option>
                <option value="urgent">Urgent — as soon as possible</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="preferredDates"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Preferred Dates
              </label>
              <input
                id="preferredDates"
                type="text"
                value={preferredDates}
                onChange={(e) => setPreferredDates(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="e.g., Any weekday afternoon, or March 20–22"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="Your address or meeting point"
              />
              <p className="text-xs text-foreground/50 mt-1">
                Only visible to managers and admins — never shared publicly.
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground mb-1">
                Good to know
              </legend>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={petsPresent}
                  onChange={(e) => setPetsPresent(e.target.checked)}
                  className="h-5 w-5 rounded border-foreground/20 text-teal focus:ring-teal/50"
                />
                <span className="text-sm text-foreground">
                  Pets will be present
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={childrenWelcome}
                  onChange={(e) => setChildrenWelcome(e.target.checked)}
                  className="h-5 w-5 rounded border-foreground/20 text-teal focus:ring-teal/50"
                />
                <span className="text-sm text-foreground">
                  Children are welcome
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maskRequired}
                  onChange={(e) => setMaskRequired(e.target.checked)}
                  className="h-5 w-5 rounded border-foreground/20 text-teal focus:ring-teal/50"
                />
                <span className="text-sm text-foreground">
                  Mask required
                </span>
              </label>
            </fieldset>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
                placeholder="Anything else volunteers should know"
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
              {loading ? "Submitting..." : "Submit Request"}
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
