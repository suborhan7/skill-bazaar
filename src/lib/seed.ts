// Sample marketplace data. Used when Supabase is not configured, and turned
// into supabase/seed.sql by `npm run seed:sql`. Every person here is made up.
import type { BadgeType, Category, CampusPulse, Package, SellerLevel } from "./types";

export type SeedSeller = {
  id: string;
  name: string;
  area: string;
  campus: string;
  level: SellerLevel;
  bio: string;
  badges: BadgeType[];
  bkash: string;
  contactUrl: string;
  reviews: { stars: number; hireAgain: boolean }[];
};

export type SeedListing = {
  id: string;
  sellerId: string;
  title: string;
  category: Category;
  description: string;
  deliveryDays: number;
  online: boolean;
  sampleCaption: string;
  packages: Package[];
};

const r = (stars: number[], noAgain = 0) =>
  stars.map((s, i) => ({ stars: s, hireAgain: i >= noAgain }));

export const SEED_SELLERS: SeedSeller[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Tanvir Hasan",
    area: "Mohakhali",
    campus: "Dhaka",
    level: "trusted",
    bio: "I edit YouTube vlogs and reels for small creators. Premiere Pro and CapCut, fast turnaround, clean cuts.",
    badges: ["uni_email", "nid", "portfolio"],
    bkash: "01700-000001",
    contactUrl: "https://m.me/",
    reviews: r([5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 5, 4], 1),
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Nusrat Jahan",
    area: "Badda",
    campus: "Dhaka",
    level: "rising",
    bio: "Thumbnail designer. I study what gets clicked in your niche before I design.",
    badges: ["uni_email", "portfolio"],
    bkash: "01700-000002",
    contactUrl: "https://m.me/",
    reviews: r([5, 5, 5, 4, 5]),
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Arif Rahman",
    area: "Dhanmondi",
    campus: "Dhaka",
    level: "trusted",
    bio: "Physics and Math tutor for O and A Levels. Five years of home and online tuition.",
    badges: ["uni_email", "nid"],
    bkash: "01700-000003",
    contactUrl: "https://wa.me/",
    reviews: r([5, 5, 5, 5, 4, 5, 5, 5, 5], 0),
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "Sadia Islam",
    area: "Gulshan",
    campus: "Dhaka",
    level: "rising",
    bio: "Copywriter for Facebook pages and online shops. English and Bangla.",
    badges: ["uni_email"],
    bkash: "01700-000004",
    contactUrl: "https://m.me/",
    reviews: r([5, 4, 5, 4], 1),
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    name: "Rafid Chowdhury",
    area: "Uttara",
    campus: "Dhaka",
    level: "new",
    bio: "I run Facebook and Instagram pages for local brands: content calendar, posting, replies.",
    badges: ["uni_email"],
    bkash: "01700-000005",
    contactUrl: "https://m.me/",
    reviews: [],
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    name: "Maliha Karim",
    area: "Mirpur",
    campus: "Dhaka",
    level: "rising",
    bio: "Motion graphics and logo animations for channels and events.",
    badges: ["uni_email", "nid", "portfolio"],
    bkash: "01700-000006",
    contactUrl: "https://m.me/",
    reviews: r([5, 5, 4, 5, 5, 5]),
  },
];

const pk = (basic: [number, string], standard?: [number, string], premium?: [number, string]): Package[] =>
  [
    { tier: "basic" as const, priceBdt: basic[0], includes: basic[1] },
    standard && { tier: "standard" as const, priceBdt: standard[0], includes: standard[1] },
    premium && { tier: "premium" as const, priceBdt: premium[0], includes: premium[1] },
  ].filter((p): p is Package => Boolean(p));

export const SEED_LISTINGS: SeedListing[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    sellerId: SEED_SELLERS[0].id,
    title: "YouTube vlog editing with captions and music",
    category: "video",
    description:
      "Send me your raw footage on Google Drive. I cut the dead air, add jump cuts, captions, background music and a simple intro. Two rounds of changes included.",
    deliveryDays: 3,
    online: true,
    sampleCaption: "Dhaka street food vlog · 12:40",
    packages: pk(
      [1500, "Up to 8 min final video, captions, 1 revision"],
      [2800, "Up to 15 min, captions, colour correction, 2 revisions"],
      [4500, "Up to 25 min, motion titles, thumbnail included, 3 revisions"],
    ),
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    sellerId: SEED_SELLERS[0].id,
    title: "Reels and Shorts edit pack, 8 videos a month",
    category: "video",
    description: "Vertical edits with captions and trending-style cuts for Reels, Shorts and TikTok. Monthly pack for regular posting.",
    deliveryDays: 2,
    online: true,
    sampleCaption: "Reel · 0:30 · captions",
    packages: pk([3000, "4 reels up to 45 sec"], [5500, "8 reels up to 60 sec"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    sellerId: SEED_SELLERS[1].id,
    title: "Click-worthy YouTube thumbnails",
    category: "design",
    description: "Bold, readable thumbnails made for your niche. You get two concepts to pick from, then the final in 1280×720.",
    deliveryDays: 1,
    online: true,
    sampleCaption: "I TRIED IT FOR 30 DAYS",
    packages: pk([400, "1 thumbnail, 2 concepts"], [1000, "3 thumbnails"], [2800, "10 thumbnails, monthly"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    sellerId: SEED_SELLERS[2].id,
    title: "A Level Physics tuition, online or home",
    category: "tutoring",
    description: "Edexcel and Cambridge A Level Physics. Past-paper practice every week and a progress note for parents each month.",
    deliveryDays: 30,
    online: false,
    sampleCaption: "v = u + at",
    packages: pk([6000, "8 classes a month, online"], [9000, "8 classes a month, home visit in Dhanmondi area"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    sellerId: SEED_SELLERS[2].id,
    title: "O Level Math crash course before exams",
    category: "tutoring",
    description: "Six intensive sessions on the topics that show up most in past papers, with timed practice.",
    deliveryDays: 14,
    online: true,
    sampleCaption: "x² − 5x + 6 = 0",
    packages: pk([3500, "6 online sessions"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000006",
    sellerId: SEED_SELLERS[3].id,
    title: "Product captions for your Facebook shop",
    category: "writing",
    description: "Short, clear product captions in English or Bangla that answer the questions buyers keep asking in comments.",
    deliveryDays: 2,
    online: true,
    sampleCaption: "Handwoven, soft, made in Tangail.",
    packages: pk([800, "10 captions"], [1800, "25 captions + 5 post ideas"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    sellerId: SEED_SELLERS[3].id,
    title: "Website and About page copy for small brands",
    category: "writing",
    description: "I interview you for 20 minutes, then write a homepage and About page that sound like you.",
    deliveryDays: 5,
    online: true,
    sampleCaption: "We started with one stall in New Market.",
    packages: pk([2500, "Homepage copy"], [4000, "Homepage + About page"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000008",
    sellerId: SEED_SELLERS[4].id,
    title: "Facebook page management for local brands",
    category: "social",
    description: "Content calendar, 3 posts a week, replies to comments and messages during business hours, and a monthly report.",
    deliveryDays: 30,
    online: true,
    sampleCaption: "12 posts · 3 per week",
    packages: pk([5000, "12 posts a month"], [8000, "12 posts + replies + monthly report"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000009",
    sellerId: SEED_SELLERS[5].id,
    title: "Animated logo intro for your channel",
    category: "video",
    description: "A 5 to 8 second logo animation with sound, made from your existing logo.",
    deliveryDays: 4,
    online: true,
    sampleCaption: "Logo reveal · 0:06",
    packages: pk([1200, "Simple reveal"], [2500, "Custom animation + sound design"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000010",
    sellerId: SEED_SELLERS[1].id,
    title: "Event poster and social media banners",
    category: "design",
    description: "Posters for club events and fests, with matching Facebook cover and Instagram story sizes.",
    deliveryDays: 2,
    online: true,
    sampleCaption: "CULTURAL NIGHT · 24 OCT",
    packages: pk([700, "1 poster"], [1500, "Poster + cover + story"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000011",
    sellerId: SEED_SELLERS[5].id,
    title: "Motion graphics for product ads",
    category: "video",
    description: "Short animated ads for Facebook and Instagram, with your products, prices and a clear call to action.",
    deliveryDays: 5,
    online: true,
    sampleCaption: "Eid sale · 0:15",
    packages: pk([2000, "1 ad up to 15 sec"], [3500, "2 ads, square and vertical"]),
  },
  {
    id: "10000000-0000-4000-8000-000000000012",
    sellerId: SEED_SELLERS[4].id,
    title: "Instagram content plan for one month",
    category: "social",
    description: "A month of post ideas, captions and hashtags, planned around your products and local dates.",
    deliveryDays: 4,
    online: true,
    sampleCaption: "30 days · 18 posts",
    packages: pk([1500, "Plan + captions"]),
  },
];

// Placeholder figures until real deals exist. Labelled as sample data in the UI.
export const SEED_PULSE: CampusPulse = { dealsThisWeek: 14, activeSellers: 38, openRequests: 9 };
