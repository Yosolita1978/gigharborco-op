"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-foreground/60 hover:text-foreground px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
    >
      Sign Out
    </button>
  );
}
