import "server-only";
import { SEED_LISTINGS, SEED_PULSE, SEED_SELLERS, type SeedListing } from "./seed";
import { createClient, isSupabaseConfigured } from "./supabase/server";
import type { BadgeType, CampusPulse, Category, ListingCard, ListingDetail, PackageTier } from "./types";

export type ListingFilter = { category?: Category; query?: string };

/** True when pages are showing the built-in sample data instead of the database. */
export const usingSampleData = !isSupabaseConfigured();

const TIER_ORDER: PackageTier[] = ["basic", "standard", "premium"];

function seedCard(l: SeedListing): ListingCard {
  const s = SEED_SELLERS.find((x) => x.id === l.sellerId)!;
  const n = s.reviews.length;
  return {
    id: l.id,
    title: l.title,
    category: l.category,
    deliveryDays: l.deliveryDays,
    online: l.online,
    sampleCaption: l.sampleCaption,
    sellerId: s.id,
    sellerName: s.name,
    sellerLevel: s.level,
    sellerArea: s.area,
    fromPriceBdt: Math.min(...l.packages.map((p) => p.priceBdt)),
    badges: s.badges,
    reviewCount: n,
    rating: n ? Math.round((s.reviews.reduce((a, b) => a + b.stars, 0) / n) * 10) / 10 : null,
    hireAgainPct: n ? Math.round((100 * s.reviews.filter((x) => x.hireAgain).length) / n) : null,
  };
}

function matches(card: ListingCard, { category, query }: ListingFilter) {
  if (category && card.category !== category) return false;
  if (query) {
    const q = query.toLowerCase();
    return card.title.toLowerCase().includes(q) || card.sellerName.toLowerCase().includes(q);
  }
  return true;
}

type CardRow = {
  id: string;
  title: string;
  category: Category;
  delivery_days: number;
  online: boolean;
  sample_caption: string | null;
  seller_id: string;
  seller_name: string;
  seller_level: ListingCard["sellerLevel"];
  seller_area: string | null;
  from_price_bdt: number;
  badges: BadgeType[];
  review_count: number;
  rating: number | null;
  hire_again_pct: number | null;
};

function rowToCard(r: CardRow): ListingCard {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    deliveryDays: r.delivery_days,
    online: r.online,
    sampleCaption: r.sample_caption ?? "",
    sellerId: r.seller_id,
    sellerName: r.seller_name,
    sellerLevel: r.seller_level,
    sellerArea: r.seller_area ?? "",
    fromPriceBdt: r.from_price_bdt,
    badges: r.badges,
    reviewCount: Number(r.review_count),
    rating: r.rating === null ? null : Number(r.rating),
    hireAgainPct: r.hire_again_pct === null ? null : Number(r.hire_again_pct),
  };
}

export async function getListings(filter: ListingFilter = {}): Promise<ListingCard[]> {
  if (usingSampleData) return SEED_LISTINGS.map(seedCard).filter((c) => matches(c, filter));

  const supabase = await createClient();
  let q = supabase.from("listing_cards").select("*").order("created_at", { ascending: false });
  if (filter.category) q = q.eq("category", filter.category);
  if (filter.query) q = q.ilike("title", `%${filter.query.replace(/[%_]/g, "")}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data as CardRow[]).map(rowToCard);
}

export async function getListing(id: string): Promise<ListingDetail | null> {
  if (usingSampleData) {
    const l = SEED_LISTINGS.find((x) => x.id === id);
    if (!l) return null;
    const s = SEED_SELLERS.find((x) => x.id === l.sellerId)!;
    return {
      ...seedCard(l),
      description: l.description,
      packages: l.packages,
      sellerBio: s.bio,
      bkashNumber: s.bkash,
      contactUrl: s.contactUrl,
    };
  }

  const supabase = await createClient();
  const [{ data: card }, { data: listing }] = await Promise.all([
    supabase.from("listing_cards").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("listings")
      .select("description, packages(tier, price_bdt, includes), profiles(bio, bkash_number, contact_url)")
      .eq("id", id)
      .maybeSingle(),
  ]);
  if (!card || !listing) return null;
  const seller = listing.profiles as unknown as { bio: string | null; bkash_number: string | null; contact_url: string | null };
  const packages = (listing.packages as { tier: PackageTier; price_bdt: number; includes: string }[])
    .map((p) => ({ tier: p.tier, priceBdt: p.price_bdt, includes: p.includes }))
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
  return {
    ...rowToCard(card as CardRow),
    description: listing.description,
    packages,
    sellerBio: seller?.bio ?? "",
    bkashNumber: seller?.bkash_number ?? null,
    contactUrl: seller?.contact_url ?? null,
  };
}

export async function getCampusPulse(): Promise<CampusPulse> {
  if (usingSampleData) return SEED_PULSE;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("campus_pulse").single();
  if (error) throw error;
  const row = data as { deals_this_week: number; active_sellers: number; open_requests: number };
  return {
    dealsThisWeek: Number(row.deals_this_week),
    activeSellers: Number(row.active_sellers),
    openRequests: Number(row.open_requests),
  };
}
