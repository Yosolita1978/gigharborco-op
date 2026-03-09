/**
 * GHWC Data Migration Script
 *
 * Usage:
 *   npx tsx scripts/migrate.ts          # sample data (default)
 *   npx tsx scripts/migrate.ts real      # real data
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in .env.local (or environment variables).
 *
 * The database must already have the schema applied and categories seeded.
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapStatus(raw: string): "active" | "pending" {
  return raw.trim() === "0-Onboarding Complete" ? "active" : "pending";
}

function mapRole(raw: string): "member" | "admin" {
  const r = raw.trim();
  if (["Executive", "Leadership", "Admin", "Advisory Board"].includes(r)) return "admin";
  return "member";
}

function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1),
  };
}

function parseDate(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  const monthNum = parseInt(parts[0], 10);
  const dayNum = parseInt(parts[1], 10);
  let year = parts[2];
  if (year.length === 2) year = `20${year}`;
  const yearNum = parseInt(year, 10);
  // Bail on unparseable month or year
  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 2000) {
    return null;
  }
  // If day is invalid in any way, default to the 1st
  const day = (isNaN(dayNum) || dayNum < 1 || dayNum > 31) ? 1 : dayNum;
  const month = String(monthNum).padStart(2, "0");
  return `${year}-${month}-${String(day).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Migrate Members
// ---------------------------------------------------------------------------

async function migrateMembers(filePath: string): Promise<number> {
  console.log(`\nReading members from ${filePath}...`);
  const csv = readFileSync(filePath, "utf-8");

  // Parse with columns first to detect if duplicate column names exist
  // If so, fall back to index-based parsing for the email column
  const headerRow = parse(csv, {
    to: 1,
    skip_empty_lines: true,
    relax_column_count: true,
  })[0] as string[];

  // Find the FIRST email column index (there may be duplicates)
  const emailColIndex = headerRow.findIndex((h: string) =>
    h.includes("PARTICIPANT EMAIL")
  );
  const nameColIndex = headerRow.findIndex((h: string) =>
    h === "PARTICIPANT NAME"
  );
  const fbNameColIndex = headerRow.findIndex((h: string) =>
    h === "FACEBOOK NAME"
  );
  const statusColIndex = headerRow.findIndex((h: string) =>
    h === "Status Next Steps"
  );
  const roleColIndex = headerRow.findIndex((h: string) => h === "Role");
  const dateColIndex = headerRow.findIndex((h: string) =>
    h === "Date Last Updated"
  );

  // Parse all rows as arrays (not objects) to avoid duplicate column name issues
  const allRows = parse(csv, {
    from: 2,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as string[][];

  interface MemberRow {
    email: string;
    first_name: string;
    last_name: string;
    display_name: string | null;
    status: string;
    role: string;
    onboarded_date: string | null;
  }

  const members: MemberRow[] = [];
  const seenEmails = new Set<string>();
  let skipped = 0;

  for (const row of allRows) {
    const email = (row[emailColIndex] || "").trim().toLowerCase();

    if (!email) {
      skipped++;
      continue;
    }

    if (seenEmails.has(email)) {
      console.warn(`  Duplicate email skipped: ${email}`);
      skipped++;
      continue;
    }
    seenEmails.add(email);

    const name = (row[nameColIndex] || "").trim();
    if (!name) {
      console.warn(`  Row with email ${email} has no name, skipping`);
      skipped++;
      continue;
    }

    const { firstName, lastName } = splitName(name);
    const displayName = (row[fbNameColIndex] || "").trim();

    members.push({
      email,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName || null,
      status: mapStatus(row[statusColIndex] || ""),
      role: mapRole(row[roleColIndex] || ""),
      onboarded_date: parseDate(row[dateColIndex] || ""),
    });
  }

  console.log(`  Parsed ${members.length} members (${skipped} skipped)`);

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("members").insert(batch);
    if (error) {
      console.error(
        `  Error inserting members batch ${i / BATCH_SIZE + 1}:`,
        error.message
      );
      throw error;
    }
    console.log(
      `  Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} rows)`
    );
  }

  console.log(`  Total: ${members.length} members inserted`);
  return members.length;
}

// ---------------------------------------------------------------------------
// Migrate Transactions
// ---------------------------------------------------------------------------

async function migrateTransactions(filePath: string): Promise<number> {
  console.log(`\nReading transactions from ${filePath}...`);
  const csv = readFileSync(filePath, "utf-8");
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  // Build lookup maps from the database
  console.log("  Loading members and categories from database...");

  const { data: dbMembers, error: membersError } = await supabase
    .from("members")
    .select("id, display_name, first_name, last_name");
  if (membersError) throw membersError;

  // Two-key lookup: try display_name first, then first_name + last_name
  const memberByDisplayName = new Map<string, string>();
  const memberByFullName = new Map<string, string>();
  for (const m of dbMembers || []) {
    if (m.display_name) {
      memberByDisplayName.set(m.display_name.trim().toLowerCase(), m.id);
    }
    const fullName = `${m.first_name || ""} ${m.last_name || ""}`.trim();
    if (fullName) {
      memberByFullName.set(fullName.toLowerCase(), m.id);
    }
  }
  console.log(
    `  ${memberByDisplayName.size} members by display name, ${memberByFullName.size} by full name`
  );

  const { data: dbCategories, error: catError } = await supabase
    .from("categories")
    .select("id, name");
  if (catError) throw catError;

  const categoryMap = new Map<string, string>();
  for (const c of dbCategories || []) {
    categoryMap.set(c.name.trim().toLowerCase(), c.id);
  }
  console.log(`  ${categoryMap.size} categories in lookup map`);

  // Parse transactions
  interface TxRow {
    member_id: string;
    type: string;
    hours: number;
    category_id: string | null;
    description: string | null;
    activity_date: string;
    month: string | null;
    year: number | null;
    status: string;
  }

  const transactions: TxRow[] = [];
  const unmatchedMembers = new Set<string>();
  const unmatchedCategories = new Set<string>();
  let skippedRows = 0;

  for (const row of records) {
    const displayName = (row["Facebook Name"] || "").trim();
    const nameKey = displayName.toLowerCase();
    const memberId =
      memberByDisplayName.get(nameKey) || memberByFullName.get(nameKey);

    if (!memberId) {
      unmatchedMembers.add(displayName);
      skippedRows++;
      continue;
    }

    const activityDate = parseDate(row["Date"] || "");
    if (!activityDate) {
      console.warn(
        `  Row for "${displayName}" has invalid date: "${row["Date"]}"`
      );
      skippedRows++;
      continue;
    }

    const categoryName = (row["Category"] || "").trim();
    const categoryId = categoryMap.get(categoryName.toLowerCase()) || null;
    if (categoryName && !categoryId) {
      unmatchedCategories.add(categoryName);
    }

    const description = (row["Description"] || "").trim() || null;
    const month = (row["Month"] || "").trim() || null;
    const yearStr = (row["Year"] || "").trim();
    const year = yearStr ? parseInt(yearStr, 10) : null;

    // Create 1-3 transactions based on which hour columns have values
    const hoursEarned = parseFloat(row["Hours Earned"] || "");
    const hoursUsed = parseFloat(row["Hours Used"] || "");
    const hoursDonated = parseFloat(row["Hours Donated"] || "");

    const base = {
      member_id: memberId,
      category_id: categoryId,
      description,
      activity_date: activityDate,
      month,
      year,
      status: "approved" as const,
    };

    if (!isNaN(hoursEarned) && hoursEarned > 0) {
      transactions.push({ ...base, type: "earned", hours: hoursEarned });
    }
    if (!isNaN(hoursUsed) && hoursUsed > 0) {
      transactions.push({ ...base, type: "used", hours: hoursUsed });
    }
    if (!isNaN(hoursDonated) && hoursDonated > 0) {
      transactions.push({ ...base, type: "donated", hours: hoursDonated });
    }
  }

  // Report warnings
  if (unmatchedMembers.size > 0) {
    console.warn(`\n  WARNING: ${unmatchedMembers.size} unmatched member names (transactions skipped):`);
    for (const name of unmatchedMembers) {
      console.warn(`    - "${name}"`);
    }
  }

  if (unmatchedCategories.size > 0) {
    console.warn(`\n  WARNING: ${unmatchedCategories.size} unmatched categories (inserted without category_id):`);
    for (const name of unmatchedCategories) {
      console.warn(`    - "${name}"`);
    }
  }

  console.log(
    `\n  Parsed ${transactions.length} transactions from ${records.length} CSV rows (${skippedRows} rows skipped)`
  );

  // Insert in batches of 500
  const BATCH_SIZE = 500;
  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("transactions").insert(batch);
    if (error) {
      console.error(
        `  Error inserting transactions batch ${i / BATCH_SIZE + 1}:`,
        error.message
      );
      throw error;
    }
    console.log(
      `  Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} rows)`
    );
  }

  console.log(`  Total: ${transactions.length} transactions inserted`);
  return transactions.length;
}

// ---------------------------------------------------------------------------
// Verify
// ---------------------------------------------------------------------------

async function verify() {
  console.log("\nVerifying...");

  const { count: memberCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });
  console.log(`  Members in database: ${memberCount}`);

  const { count: txCount } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true });
  console.log(`  Transactions in database: ${txCount}`);

  const { data: balances, error } = await supabase
    .from("balances")
    .select("*")
    .limit(5);

  if (error) {
    console.warn("  Could not query balances view:", error.message);
  } else {
    console.log(`\n  Sample balances (first ${balances?.length || 0}):`);
    console.table(balances);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const mode = process.argv[2] || "sample";

  let membersPath: string;
  let transactionsPath: string;

  if (mode === "real") {
    membersPath = "data/real/members.csv";
    transactionsPath = "data/real/transactions.csv";
    console.log("--- REAL DATA MODE ---");
  } else {
    membersPath = "data/sample-members.csv";
    transactionsPath = "data/sample-data.csv";
    console.log("--- SAMPLE DATA MODE ---");
  }

  console.log("=".repeat(50));
  console.log("GHWC Data Migration");
  console.log("=".repeat(50));

  const memberCount = await migrateMembers(membersPath);
  const txCount = await migrateTransactions(transactionsPath);

  await verify();

  console.log("\n" + "=".repeat(50));
  console.log(`Done! ${memberCount} members, ${txCount} transactions`);
  console.log("=".repeat(50));
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});
