"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <section className="py-20 px-6">
        <div className="mx-auto max-w-md">
          <div className="bg-mint/20 rounded-2xl p-8 md:p-12 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Check Your Email
            </h1>
            <p className="text-foreground/60 mb-6">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link in the email to set a new password.
            </p>
            <p className="text-foreground/50 text-sm mb-8">
              Don&apos;t see it? Check your spam folder. The link expires in 1
              hour.
            </p>
            <Link
              href="/login"
              className="text-teal font-medium hover:underline"
            >
              &larr; Back to Login
            </Link>
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
            Reset Password
          </h1>
          <p className="text-foreground/60 text-center mb-8">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                placeholder="you@example.com"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            <Link
              href="/login"
              className="text-teal font-medium hover:underline"
            >
              &larr; Back to Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
