# Skill Bazaar

A marketplace where people sell their skills (video editing, design, tutoring, writing, social media) and get hired, starting on campus. Prices and samples are upfront, and badges show exactly what was verified.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Supabase keys set, the app runs on the built-in sample listings from `src/lib/seed.ts`.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql` for the sample listings.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from Project Settings → API.

After you edit the sample data, regenerate the seed file with `npm run seed:sql`.

## Deploy on Vercel

Import the repo at [vercel.com/new](https://vercel.com/new), add the two `NEXT_PUBLIC_SUPABASE_*` variables, and deploy. Every pull request gets its own preview link.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 with the Haat design tokens in `src/app/globals.css`
- Supabase for Postgres, auth and file storage, with row level security on every table

## Project layout

| Path | What's there |
|---|---|
| `src/app/page.tsx` | Home: search, categories, listing grid |
| `src/app/l/[id]/page.tsx` | Listing page: packages, seller, badges, contact |
| `src/components/` | Listing card, sample tiles, trust badges |
| `src/lib/data.ts` | Data access: Supabase when configured, sample data otherwise |
| `supabase/migrations/` | Database schema and access policies |
