import Link from "next/link";
import { deliveryLabel, initials, taka } from "@/lib/format";
import type { ListingCard as Card } from "@/lib/types";
import { SampleTile } from "./SampleTile";
import { BadgeRow, LevelStamp, ReviewSummary } from "./Trust";

export function ListingCard({ listing }: { listing: Card }) {
  return (
    <Link
      href={`/l/${listing.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-bottle"
    >
      <SampleTile category={listing.category} caption={listing.sampleCaption} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-paper text-[11px] font-semibold text-ink-soft">
            {initials(listing.sellerName)}
          </span>
          <span className="min-w-0 truncate text-sm font-medium">{listing.sellerName}</span>
          <LevelStamp level={listing.sellerLevel} />
        </div>
        <h3 className="line-clamp-2 font-body text-[15px] font-semibold leading-snug group-hover:text-bottle">
          {listing.title}
        </h3>
        <BadgeRow badges={listing.badges} />
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line pt-3">
          <div>
            <p className="text-[11px] text-ink-soft">{deliveryLabel(listing.deliveryDays)}</p>
            <p className="tabular font-display text-xl font-bold leading-tight">
              <span className="font-body text-xs font-normal text-ink-soft">From </span>
              {taka(listing.fromPriceBdt)}
            </p>
          </div>
          <div className="text-right">
            <ReviewSummary rating={listing.rating} reviewCount={listing.reviewCount} hireAgainPct={listing.hireAgainPct} />
          </div>
        </div>
      </div>
    </Link>
  );
}
