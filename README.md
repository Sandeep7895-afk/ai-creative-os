# AI Creative OS

**Create • Automate • Publish**

A production-architecture SaaS app for generating AI video/image/voice/PDF content, managing it through a prompt library, and publishing it to YouTube and Instagram — with a plugin system so new destinations and providers can be added without touching the rest of the app.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Radix primitives (shadcn-style) · Supabase (Postgres + Auth + RLS) · React Hook Form + Zod · Recharts

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase project URL + anon key
```

1. Create a [Supabase](https://supabase.com) project.
2. Run the schema: `supabase/migrations/0001_init.sql` (via the Supabase SQL editor, or `supabase db push` with the CLI).
3. Enable **Email** and **Google** providers under Authentication → Providers. For Google, follow Supabase's social-login guide.
4. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in `.env.local`.
5. `npm run dev` and sign up — the first login has no workspace yet, so you'll land on **Settings → Workspace** to create one.
6. (Optional) `supabase/seed.sql` adds a few example workspaces for local dev. Read the comments at the top before running it.

## What's wired end-to-end

- **Auth** — email/password + Google OAuth, forgot-password flow, role-aware route protection (`proxy.ts`, Next 16's renamed middleware convention), auto-provisioned profile on signup.
- **Multi-workspace** — every prompt, job, asset, and publish account is scoped to a workspace via Postgres RLS, not just app-level filtering.
- **Prompt Library** — full CRUD, search, category/status filters, CSV/Excel bulk import.
- **AI Video / Image / Voice / PDF-eBook** — shared generation workflow (prompt → queue → live status → mandatory preview → download → publish). Nothing auto-publishes.
- **Publish** — plugin architecture (`services/publish/registry.ts`). YouTube and Instagram providers implement a shared `PublishProvider` interface; adding a new platform means writing one file and registering it.
- **Notifications** — Supabase Realtime-backed, with per-type quick actions (Preview/Post/Retry/Delete).
- **Analytics** — real aggregate queries against `generation_jobs` / `publish_jobs` / `analytics_daily`, not fabricated numbers. New installs correctly show zeros/empty states until content exists.
- **Admin** — API Manager (masked keys, RLS-enforced admin-only access) and System Logs, both hidden from non-admins in the UI *and* blocked at the database and route level.

## What needs your own credentials before it does real work

This is a scaffold, not a demo with fake success states — so anything that requires a third-party account simply won't have data until you connect one:

- **AI generation providers** (Runway, Flux, ElevenLabs, etc.) — `services/generation-service.ts` queues jobs; wire a background worker (cron job, queue consumer, or Supabase Edge Function) that watches `generation_jobs` and calls your chosen provider's API, then writes `result_url` back.
- **YouTube / Instagram OAuth** — `services/publish/youtube-provider.ts` and `instagram-provider.ts` call the real Data/Graph API endpoints once an account has a valid `access_token`; the OAuth *connect* flow itself (redirecting through Google/Meta consent) still needs to be implemented against your app's registered OAuth client.
- **API Manager encryption** — credentials are stored as entered; swap the insert in `services/admin-service.ts` for your KMS/secret-manager envelope before production use.

## Project structure

```
app/            routes (App Router), grouped by (auth) and (dashboard)
components/ui/  design-system primitives (button, card, dialog, table…)
components/layout/  sidebar, topbar, notification center, generate popup
features/       page-level feature components, grouped by domain
services/       server actions — all Supabase reads/writes live here
hooks/          client hooks (realtime notifications, etc.)
providers/      React context (session/workspace)
lib/            supabase clients, mappers, validation schemas, utils
types/          shared domain types
supabase/       SQL migration + optional dev seed
```
