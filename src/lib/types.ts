export type Category = "video" | "design" | "tutoring" | "writing" | "social";
export type SellerLevel = "new" | "rising" | "trusted";
export type BadgeType = "uni_email" | "nid" | "portfolio" | "employer_email";
export type PackageTier = "basic" | "standard" | "premium";

export const CATEGORIES: { id: Category; label: string; bn: string }[] = [
  { id: "video", label: "Video editing", bn: "ভিডিও এডিটিং" },
  { id: "design", label: "Thumbnails & design", bn: "ডিজাইন" },
  { id: "tutoring", label: "Tutoring", bn: "টিউশন" },
  { id: "writing", label: "Writing", bn: "লেখালেখি" },
  { id: "social", label: "Social media", bn: "সোশ্যাল মিডিয়া" },
];

export const LEVEL_LABEL: Record<SellerLevel, string> = {
  new: "New",
  rising: "Rising",
  trusted: "Trusted",
};

export const BADGE_INFO: Record<BadgeType, { label: string; detail: string }> = {
  uni_email: { label: "Uni email", detail: "University email address confirmed by a one-time code" },
  nid: { label: "NID", detail: "National ID checked by the Skill Bazaar team" },
  portfolio: { label: "Portfolio", detail: "Work samples reviewed by the Skill Bazaar team" },
  employer_email: { label: "Employer", detail: "Work email address confirmed by a one-time code" },
};

export type ListingCard = {
  id: string;
  title: string;
  category: Category;
  deliveryDays: number;
  online: boolean;
  sampleCaption: string;
  sellerId: string;
  sellerName: string;
  sellerLevel: SellerLevel;
  sellerArea: string;
  fromPriceBdt: number;
  badges: BadgeType[];
  reviewCount: number;
  rating: number | null;
  hireAgainPct: number | null;
};

export type Package = {
  tier: PackageTier;
  priceBdt: number;
  includes: string;
};

export type ListingDetail = ListingCard & {
  description: string;
  packages: Package[];
  sellerBio: string;
  bkashNumber: string | null;
  contactUrl: string | null;
};

export type CampusPulse = {
  dealsThisWeek: number;
  activeSellers: number;
  openRequests: number;
};
