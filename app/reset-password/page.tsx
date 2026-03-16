"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function ResetPassword() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSession(!!session);
      setChecking(false);
    }
    checkSession();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  }

  if (checking) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </section>
    );
  }

  if (!hasSession) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-md">
          <div className="bg-mint/20 rounded-2xl p-8 md:p-12 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Invalid or Expired Link
            </h1>
            <p className="text-foreground/60 mb-6">
              This password reset link has expired or is invalid. Please request
              a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-teal text-white font-semibold rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-md">
          <div className="bg-mint/20 rounded-2xl p-8 md:p-12 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Password Updated!
            </h1>
            <p className="text-foreground/60 mb-8">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => {
                router.push("/dashboard");
                router.refresh();
              }}
              className="inline-block bg-teal text-white font-semibold rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
            >
              Go to Dashboard
            </button>
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
            Set New Password
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="••••••••"
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
