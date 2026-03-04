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
cd ghwc-web
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

### 4. Start the development server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

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
| `npx supabase start` | Start local Supabase |
| `npx supabase stop` | Stop local Supabase |
| `npx supabase status` | Check if local Supabase is running |
| `npx supabase db reset` | Reset the local database (runs all migrations + seed data) |

## Stopping Everything

```bash
# Stop the Next.js dev server
Ctrl + C

# Stop local Supabase
npx supabase stop
```
