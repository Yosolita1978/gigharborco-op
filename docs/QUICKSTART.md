# GHWC Web — Quick Start Guide

## Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/) 18 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)
- Git

## Getting Started

### 1. Clone the repo and install dependencies

```bash
git clone <repo-url>
cd gigharborco-op
npm install
```

### 2. Start the local Supabase database

```bash
npx supabase start
```

This starts a local Supabase instance in Docker. It will print out URLs and keys — you'll need these for the next step.

> **Port conflict?** If you see "port is already allocated", another Supabase project is using the same port. Stop it first:
> ```bash
> npx supabase stop --project-id <other-project-name>
> ```
> Then run `npx supabase start` again.

### 3. Set up environment variables

Create a `.env.local` file in the project root with the values from `npx supabase start`:

```bash
touch .env.local
```

Add these three lines (replace the keys with the ones from your `supabase start` output):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Publishable key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<Secret key from supabase start output>
```

> The `.env.local` file is gitignored — it never gets committed.

### 4. Apply the database schema and seed data

```bash
npx supabase db reset
```

This runs all migrations (creates tables, RLS policies, auth trigger) and seeds the categories.

### 5. Load sample data

```bash
npm run migrate:sample
```

This inserts 12 fake members and 15 fake transactions from the sample CSV files. You should see output like:

```
Parsed 562 members (5 skipped)
...
Done! 562 members, 8363 transactions
```

(If running with sample data, you'll see 12 members and 15 transactions instead.)

### 6. Start the development server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### 7. Test the auth flow

1. Go to http://localhost:3000/signup
2. Sign up with an email from the sample data (e.g. `jane@example.com`)
3. Set any password (8+ characters)
4. You should be redirected to the dashboard with balance cards and transaction history

## Local Supabase Services

Once `npx supabase start` is running, you have access to:

| Service | URL |
|---|---|
| Supabase Studio (database UI) | http://127.0.0.1:54323 |
| API | http://127.0.0.1:54321 |
| Mailpit (test emails) | http://127.0.0.1:54324 |
| Database (direct connection) | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

## Common Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run migrate:sample` | Load fake data into the local database |
| `npm run migrate:real` | Load real data (requires CSVs in `data/real/`) |
| `npx supabase start` | Start local Supabase |
| `npx supabase stop` | Stop local Supabase |
| `npx supabase status` | Check if local Supabase is running |
| `npx supabase db reset` | Reset the local database (runs all migrations + seed data) |

## Testing the Database

Open Supabase Studio at http://127.0.0.1:54323 and go to the SQL Editor. Try these queries:

```sql
-- Check counts
SELECT COUNT(*) FROM members;
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM categories;

-- View top balances
SELECT m.first_name, m.last_name, b.*
FROM balances b
JOIN members m ON m.id = b.member_id
ORDER BY b.hours_earned DESC
LIMIT 10;

-- Check a member's transactions
SELECT t.activity_date, c.name AS category, t.description, t.type, t.hours
FROM transactions t
LEFT JOIN categories c ON c.id = t.category_id
JOIN members m ON m.id = t.member_id
WHERE m.email = 'jane@example.com'
ORDER BY t.activity_date DESC;

-- List admin users
SELECT first_name, last_name, email, role
FROM members
WHERE role = 'admin';
```

## Stopping Everything

```bash
# Stop the Next.js dev server
Ctrl + C

# Stop local Supabase
npx supabase stop
```

## Troubleshooting

**"No membership found" on dashboard** — The email you signed up with doesn't match any email in the `members` table. Check spelling or use an email from the sample/real data.

**"Invalid email or password"** — The account doesn't exist (need to sign up first) or wrong password.

**Supabase won't start** — Make sure Docker Desktop is running. Try `docker ps` to verify.

**Port 3000 already in use** — Another dev server is running. Kill it or use `npm run dev -- -p 3001`.
