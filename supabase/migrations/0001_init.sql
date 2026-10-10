-- Skill Bazaar: initial schema
-- Run in the Supabase SQL editor, or with `supabase db push`.

create type category as enum ('video', 'design', 'tutoring', 'writing', 'social');
create type seller_level as enum ('new', 'rising', 'trusted');
create type verification_type as enum ('uni_email', 'nid', 'portfolio', 'employer_email');
create type verification_status as enum ('pending', 'approved', 'rejected');
create type package_tier as enum ('basic', 'standard', 'premium');
create type deal_status as enum ('hired', 'in_progress', 'delivered', 'done', 'cancelled');
create type report_status as enum ('open', 'resolved', 'dismissed');

-- One row per user, created on first sign-in.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  bio text,
  area text,
  campus text,
  level seller_level not null default 'new',
  bkash_number text,
  contact_url text,
  created_at timestamptz not null default now()
);

create table verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  type verification_type not null,
  status verification_status not null default 'pending',
  -- What the badge says when tapped, e.g. "University email confirmed".
  detail text,
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (profile_id, type)
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles (id) on delete cascade,
  title text not null check (char_length(title) between 8 and 90),
  category category not null,
  description text not null,
  delivery_days int not null check (delivery_days > 0),
  online boolean not null default true,
  -- Short text shown on the generated sample tile until real images are uploaded.
  sample_caption text,
  sample_urls text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table packages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings (id) on delete cascade,
  tier package_tier not null,
  price_bdt int not null check (price_bdt > 0),
  includes text not null,
  unique (listing_id, tier)
);

create table requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles (id) on delete cascade,
  category category not null,
  title text not null,
  details text not null,
  budget_bdt int,
  needed_by date,
  open boolean not null default true,
  created_at timestamptz not null default now()
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  seller_id uuid not null references profiles (id) on delete cascade,
  price_bdt int not null check (price_bdt > 0),
  message text not null,
  shortlisted boolean not null default false,
  created_at timestamptz not null default now(),
  unique (request_id, seller_id)
);

create table deals (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles (id),
  seller_id uuid not null references profiles (id),
  listing_id uuid references listings (id),
  offer_id uuid references offers (id),
  price_bdt int not null,
  status deal_status not null default 'hired',
  buyer_confirmed_at timestamptz,
  seller_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  check (buyer_id <> seller_id),
  check (listing_id is not null or offer_id is not null)
);

-- A review exists only for a deal both sides confirmed (enforced by policy below).
create table reviews (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null unique references deals (id) on delete cascade,
  reviewer_id uuid not null references profiles (id),
  stars int not null check (stars between 1 and 5),
  comment text,
  would_hire_again boolean not null,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id),
  listing_id uuid references listings (id) on delete cascade,
  profile_id uuid references profiles (id) on delete cascade,
  reason text not null,
  status report_status not null default 'open',
  created_at timestamptz not null default now(),
  check (listing_id is not null or profile_id is not null)
);

create index listings_category_idx on listings (category) where published;
create index packages_listing_idx on packages (listing_id);
create index offers_request_idx on offers (request_id);

-- Card view used by browse: one row per listing with its seller, lowest price,
-- approved badges and review summary.
create view listing_cards with (security_invoker = true) as
select
  l.id,
  l.title,
  l.category,
  l.delivery_days,
  l.online,
  l.sample_caption,
  l.created_at,
  p.id as seller_id,
  p.full_name as seller_name,
  p.level as seller_level,
  p.area as seller_area,
  (select min(pk.price_bdt) from packages pk where pk.listing_id = l.id) as from_price_bdt,
  coalesce((select array_agg(v.type order by v.type) from verifications v
            where v.profile_id = p.id and v.status = 'approved'), '{}') as badges,
  (select count(*) from deals d join reviews r on r.deal_id = d.id where d.seller_id = p.id) as review_count,
  (select round(avg(r.stars)::numeric, 1) from deals d join reviews r on r.deal_id = d.id where d.seller_id = p.id) as rating,
  (select round(100.0 * avg(case when r.would_hire_again then 1 else 0 end)) from deals d join reviews r on r.deal_id = d.id where d.seller_id = p.id) as hire_again_pct
from listings l
join profiles p on p.id = l.seller_id
where l.published;

-- Row level security: public can read the marketplace, users write their own rows.
alter table profiles enable row level security;
alter table verifications enable row level security;
alter table listings enable row level security;
alter table packages enable row level security;
alter table requests enable row level security;
alter table offers enable row level security;
alter table deals enable row level security;
alter table reviews enable row level security;
alter table reports enable row level security;

create policy "profiles are public" on profiles for select using (true);
create policy "users edit own profile" on profiles for update using (auth.uid() = id);
create policy "users create own profile" on profiles for insert with check (auth.uid() = id);

-- Badges are public once approved; owners see their pending ones. Only admins
-- (service role) approve, so there is no update policy.
create policy "approved badges are public" on verifications for select
  using (status = 'approved' or profile_id = auth.uid());
create policy "users request own verification" on verifications for insert
  with check (profile_id = auth.uid() and status = 'pending');

create policy "published listings are public" on listings for select
  using (published or seller_id = auth.uid());
create policy "sellers manage own listings" on listings for all
  using (seller_id = auth.uid()) with check (seller_id = auth.uid());

create policy "packages are public" on packages for select using (true);
create policy "sellers manage own packages" on packages for all
  using (exists (select 1 from listings l where l.id = listing_id and l.seller_id = auth.uid()))
  with check (exists (select 1 from listings l where l.id = listing_id and l.seller_id = auth.uid()));

create policy "requests are public" on requests for select using (true);
create policy "buyers manage own requests" on requests for all
  using (buyer_id = auth.uid()) with check (buyer_id = auth.uid());

create policy "offers visible to both sides" on offers for select
  using (seller_id = auth.uid()
         or exists (select 1 from requests r where r.id = request_id and r.buyer_id = auth.uid()));
create policy "sellers send offers" on offers for insert with check (seller_id = auth.uid());
create policy "buyers shortlist offers" on offers for update
  using (exists (select 1 from requests r where r.id = request_id and r.buyer_id = auth.uid()));

create policy "deals visible to both sides" on deals for select
  using (buyer_id = auth.uid() or seller_id = auth.uid());
create policy "buyers start deals" on deals for insert with check (buyer_id = auth.uid());
create policy "both sides update deals" on deals for update
  using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "reviews are public" on reviews for select using (true);
create policy "buyers review confirmed deals" on reviews for insert with check (
  reviewer_id = auth.uid()
  and exists (
    select 1 from deals d
    where d.id = deal_id
      and d.buyer_id = auth.uid()
      and d.buyer_confirmed_at is not null
      and d.seller_confirmed_at is not null
  )
);

create policy "users file reports" on reports for insert with check (reporter_id = auth.uid());

-- Public counters for the home screen. Deals are private, so the counts are
-- computed here without exposing any rows.
create function campus_pulse()
returns table (deals_this_week bigint, active_sellers bigint, open_requests bigint)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from deals where status = 'done' and created_at > now() - interval '7 days'),
    (select count(distinct seller_id) from listings where published),
    (select count(*) from requests where open);
$$;
grant execute on function campus_pulse() to anon, authenticated;
