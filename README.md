# GHWC Web — Gig Harbor Women's Co-Op

Website and member portal for the Gig Harbor Women's Co-op, a 501(c)(3) nonprofit that empowers women through mutual aid and time banking.

**Live site:** https://gigharborco-op.vercel.app

## What This Project Does

- **Public website** — 10 pages: Home, About Us, Our Story, Orientation, Volunteer Opportunities, Events, Newsletters, Contact, Login, Signup
- **Member authentication** — Email/password signup and login via Supabase Auth
- **Member dashboard** — Logged-in members see their Time Bank balance (hours earned, used, donated, available) and full transaction history with filters

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (mobile-first) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password) |
| Hosting | Vercel (auto-deploys from `main`) |
| Package manager | npm |

## Project Structure

```
app/                          # Next.js pages (App Router)
  page.tsx                    # Home page
  layout.tsx                  # Root layout (fonts, header, footer)
  globals.css                 # Tailwind v4 theme (brand colors)
  login/page.tsx              # Login form
  signup/page.tsx             # Signup form
  dashboard/                  # Protected — requires auth
    page.tsx                  # Balance cards + transaction history
    SignOutButton.tsx          # Client component
  about-us/page.tsx
  our-story/page.tsx
  orientation/page.tsx
  volunteer-opportunities/page.tsx
  events/page.tsx
  newsletters/page.tsx
  contact/page.tsx

src/
  components/
    layout/                   # Header, Footer, MobileMenu, ShopDropdown
    dashboard/                # BalanceCards, TransactionHistory
    ui/                       # ContactForm
  lib/supabase/
    client.ts                 # Browser client (client components)
    server.ts                 # Server client (server components)
    middleware.ts             # Auth session refresh + route protection

proxy.ts                      # Next.js 16 proxy (auth middleware entry point)

supabase/
  config.toml                 # Supabase CLI config
  migrations/
    20260304204609_initial_schema.sql   # Tables, RLS, indexes
    20260309000000_auth_trigger.sql     # Links auth.users → members
  seed.sql                    # Category seed data (18 categories)

scripts/
  migrate.ts                  # CSV → Supabase data migration

data/
  sample-members.csv          # 12 fake members (safe to commit)
  sample-data.csv             # 15 fake transactions (safe to commit)
  real/                       # Real CSVs (gitignored, never committed)

docs/
  QUICKSTART.md               # Local dev setup guide
  DATA_MAPPING.md             # Google Sheets → Supabase column mapping
  CONTENT.md                  # Website content source
```

## Quick Start (Local Development)

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for full setup instructions. Summary:

### Prerequisites

- Node.js 18+
- Docker Desktop (running)
- Git

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd gigharborco-op
npm install

# 2. Start local Supabase (requires Docker)
npx supabase start

# 3. Create .env.local with keys from supabase start output
#    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start>
#    SUPABASE_SERVICE_ROLE_KEY=<from supabase start>

# 4. Reset database (applies migrations + seed data)
npx supabase db reset

# 5. Load sample data
npm run migrate:sample

# 6. Start dev server
npm run dev
```

Site runs at http://localhost:3000. Supabase Studio at http://127.0.0.1:54323.

### Testing Auth Locally

After loading sample data, sign up at http://localhost:3000/signup with any email from `data/sample-members.csv` (e.g. `jane@example.com`). The auth trigger links your account to the member record, and you'll see the dashboard with balance and transactions.

## Database

### Schema Overview

```
members ──────────── The people. 562 imported from Google Sheets.
  ├─ auth_user_id    Links to Supabase auth.users (set on signup)
  ├─ email           Unique, used for matching on signup
  ├─ role            member | manager | admin
  └─ status          active | pending | inactive

categories ───────── 18 types of activity (Orientation, Time Bank Request, etc.)

transactions ─────── Every hour earned, used, or donated. 8,363 imported.
  ├─ member_id       Who
  ├─ type            earned | used | donated
  ├─ hours           Always positive (type indicates direction)
  ├─ category_id     What kind of activity
  ├─ activity_date   When
  └─ status          pending | approved | rejected

balances (VIEW) ──── Calculated from transactions. Not a table.
  └─ available = earned - used - donated

tasks ────────────── Schema only (Phase 2 — not used yet)
task_volunteers ──── Schema only (Phase 2 — not used yet)
```

### Row Level Security (RLS)

All tables have RLS enabled. No data leaks between members.

- **Members** see only their own row
- **Admins** see all members
- **Transactions** — members see their own, managers/admins see all
- **Categories** — all authenticated users can read active categories
- **No deletes** — records are set to `inactive`, never deleted

### Auth Flow

1. User signs up with email/password → Supabase creates `auth.users` row
2. Database trigger `on_auth_user_created` fires → finds `members` row with matching email → sets `auth_user_id`
3. User is now linked — RLS policies use `auth_user_id` to scope queries
4. Dashboard queries `members`, `transactions`, and `balances` view — all scoped by RLS

### Helper Functions

```sql
get_member_role()  -- Returns 'member', 'manager', or 'admin' for the current user
get_member_id()    -- Returns the members.id UUID for the current user
```

Used in RLS policies to avoid repeated subqueries.

## Data Migration

### Source Data

Member and transaction data was migrated from two Google Sheets:

| Sheet | Target | Mapping |
|---|---|---|
| Participants Review | `members` table | See [docs/DATA_MAPPING.md](docs/DATA_MAPPING.md) |
| Time Bank Master → "Co-op time bank" tab | `transactions` table | See [docs/DATA_MAPPING.md](docs/DATA_MAPPING.md) |

### Migration Script

`scripts/migrate.ts` handles the import:

```bash
npm run migrate:sample    # Uses data/sample-members.csv + data/sample-data.csv
npm run migrate:real      # Uses data/real/members.csv + data/real/transactions.csv
```

**What it does:**

1. **Reads members CSV** → extracts email, name, display name, status, role, onboarded date
2. **Splits names** → `PARTICIPANT NAME` becomes `first_name` + `last_name`
3. **Maps status** → `0-Onboarding Complete` → `active`, everything else → `pending`
4. **Maps role** → `Executive`/`Leadership`/`Advisory Board` → `admin`, everything else → `member`
5. **Inserts members** in batches of 100
6. **Reads transactions CSV** → looks up each member by display name (Facebook Name), falls back to full name (first + last)
7. **Looks up categories** by name
8. **Creates 1-3 transaction records per CSV row** — one for each of Hours Earned, Hours Used, Hours Donated that has a value
9. **Handles bad dates** — invalid day values default to the 1st of that month
10. **Reports** unmatched members and categories as warnings

**Key decisions:**
- The members CSV had duplicate `PARTICIPANT EMAIL` columns — the script parses by column index to use the first one (which has all 562 emails)
- The two-key member lookup (display name + full name) reduced unmatched transactions from 218 to 20
- All imported transactions have `status = 'approved'` (they're historical, already verified)
- `Hours Available` column is ignored — recalculated by the `balances` view

### Migration Results (Production)

| Metric | Count |
|---|---|
| Members imported | 562 |
| Members skipped (no email or duplicate) | 5 |
| Transactions imported | 8,363 |
| Transaction rows skipped | 92 |
| Unmatched member names | 20 |
| Categories | 18 |

The 20 unmatched names are mostly former members with `(X)` markers, names with special characters, or bookkeeping rows like `DONATED HOURS UPDATE`.

## Environments

| Environment | Supabase | Vercel | Branch |
|---|---|---|---|
| Local dev | Supabase CLI (Docker) | localhost:3000 | any branch |
| Production | Cloud project `oxjbochnfvzlntbafmdt` | gigharborco-op.vercel.app | `main` |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase API URL (public, safe for frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Publishable key (public, safe for frontend)
SUPABASE_SERVICE_ROLE_KEY      # Secret key (server-side only, NEVER in frontend)
```

- Local: `.env.local` (gitignored)
- Production: Set in Vercel dashboard → Settings → Environment Variables

## Testing the Database

### From Supabase Studio (local)

After `npx supabase start`, open http://127.0.0.1:54323 and use the SQL Editor:

```sql
-- Check member count
SELECT COUNT(*) FROM members;

-- Check transaction count
SELECT COUNT(*) FROM transactions;

-- View balances for all members (top 10 by hours earned)
SELECT m.first_name, m.last_name, b.*
FROM balances b
JOIN members m ON m.id = b.member_id
ORDER BY b.hours_earned DESC
LIMIT 10;

-- Check a specific member's transactions
SELECT t.activity_date, c.name AS category, t.description, t.type, t.hours
FROM transactions t
LEFT JOIN categories c ON c.id = t.category_id
JOIN members m ON m.id = t.member_id
WHERE m.email = 'jane@example.com'
ORDER BY t.activity_date DESC;

-- Verify RLS helper functions
SELECT get_member_role();   -- Returns NULL if not authenticated
SELECT get_member_id();     -- Returns NULL if not authenticated

-- Check categories
SELECT name, status FROM categories ORDER BY name;

-- Find members by role
SELECT first_name, last_name, email, role, status
FROM members
WHERE role = 'admin'
ORDER BY last_name;
```

### Testing Auth Flow

1. Reset and seed: `npx supabase db reset`
2. Load data: `npm run migrate:sample`
3. Start dev server: `npm run dev`
4. Go to http://localhost:3000/signup
5. Sign up with `jane@example.com` (from sample data)
6. You should see the dashboard with Jane's balance and transactions
7. Sign out, try signing up with an email NOT in the sample data
8. You should see "No membership found" on the dashboard

### Testing RLS

After signing up as a regular member, open the browser console and run:

```js
// This should only return YOUR transactions, not anyone else's
const { data } = await supabase.from('transactions').select('*')
console.log(data.length) // Should be a small number, not 8000+
```

## Brand

| Color | Hex | Usage |
|---|---|---|
| Teal | `#89c8cd` | Primary — buttons, links, headings |
| Mint | `#cef9e8` | Secondary — highlights, success |
| Dusty Rose | `#e6c9ce` | Accent — hover states, badges |
| Off-White | `#fefefe` | Background |
| Black | `#000000` | Text |

**Fonts:** DM Serif Display (headings) + DM Sans (body)

## What's Next (Phase 2)

- Hours submission form (replace Google Form)
- Task request system
- Approval workflows for managers
- Reporting and KPI dashboard

## Data Privacy

**This project handles real member data.** Never commit real names, emails, or personal info.

- Real data files go in `data/real/` (gitignored)
- Use `data/sample-*.csv` (fake data) for development
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — never use it in frontend code
- Location fields in `tasks` table are private — never expose to non-admin users
