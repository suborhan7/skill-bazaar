import { BADGE_INFO, LEVEL_LABEL, type BadgeType, type SellerLevel } from "@/lib/types";

const LEVEL_STYLE: Record<SellerLevel, string> = {
  trusted: "bg-marigold text-[#15211b] border-marigold",
  rising: "bg-bottle text-on-dark border-bottle",
  new: "bg-transparent text-ink-soft border-line",
};

/** Seller level, earned from confirmed deals. */
export function LevelStamp({ level }: { level: SellerLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 ${LEVEL_STYLE[level]}`}
      title={`${LEVEL_LABEL[level]} seller, based on confirmed deals`}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
      <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Compact badge row for cards. */
export function BadgeRow({ badges }: { badges: BadgeType[] }) {
  if (!badges.length) return <p className="text-xs text-ink-soft">Not verified yet</p>;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Verified">
      {badges.map((b) => (
        <li
          key={b}
          className="inline-flex items-center gap-1 rounded-md bg-indigo/10 px-1.5 py-0.5 text-[11px] font-medium text-indigo"
          title={BADGE_INFO[b].detail}
        >
          <Check />
          {BADGE_INFO[b].label}
        </li>
      ))}
    </ul>
  );
}

/** Full badge list for listing pages: says what each badge means. */
export function BadgeList({ badges }: { badges: BadgeType[] }) {
  if (!badges.length) return <p className="text-sm text-ink-soft">This seller hasn&apos;t verified anything yet.</p>;
  return (
    <ul className="space-y-2">
      {badges.map((b) => (
        <li key={b} className="flex gap-2 text-sm">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-indigo text-surface">
            <Check />
          </span>
          <span>
            <span className="font-semibold">{BADGE_INFO[b].label}</span>
            <span className="text-ink-soft">: {BADGE_INFO[b].detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ReviewSummary({
  rating,
  reviewCount,
  hireAgainPct,
}: {
  rating: number | null;
  reviewCount: number;
  hireAgainPct: number | null;
}) {
  if (!reviewCount || rating === null) return <span className="text-xs text-ink-soft">No reviews yet</span>;
  return (
    <span className="tabular flex flex-col text-xs leading-snug text-ink-soft">
      <span>
        <span className="font-semibold text-ink">★ {rating.toFixed(1)}</span> ({reviewCount} reviews)
      </span>
      {hireAgainPct !== null && <span>{hireAgainPct}% would hire again</span>}
    </span>
  );
}
