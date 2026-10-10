import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyNumber } from "@/components/CopyNumber";
import { SampleTile } from "@/components/SampleTile";
import { BadgeList, LevelStamp, ReviewSummary } from "@/components/Trust";
import { getListing, usingSampleData } from "@/lib/data";
import { deliveryLabel, initials, taka } from "@/lib/format";
import { CATEGORIES, type PackageTier } from "@/lib/types";

type Params = Promise<{ id: string }>;

const TIER_LABEL: Record<PackageTier, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const listing = await getListing((await params).id);
  if (!listing) return { title: "Listing not found · Skill Bazaar" };
  const description = `From ${taka(listing.fromPriceBdt)} by ${listing.sellerName}. ${listing.description}`.slice(0, 160);
  return {
    title: `${listing.title} · Skill Bazaar`,
    description,
    openGraph: { title: listing.title, description, siteName: "Skill Bazaar" },
  };
}

export default async function ListingPage({ params }: { params: Params }) {
  const listing = await getListing((await params).id);
  if (!listing) notFound();
  const category = CATEGORIES.find((c) => c.id === listing.category)!;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/#browse" className="hover:text-ink">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/?cat=${category.id}#browse`} className="hover:text-ink">
          {category.label}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-xl border border-line">
            <SampleTile category={listing.category} caption={listing.sampleCaption} size="large" />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-bold [font-stretch:90%] md:text-5xl">{listing.title}</h1>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
              <span>{deliveryLabel(listing.deliveryDays)}</span>
              <span>{listing.online ? "Online" : `In person, ${listing.sellerArea}`}</span>
              <ReviewSummary rating={listing.rating} reviewCount={listing.reviewCount} hireAgainPct={listing.hireAgainPct} />
            </p>
          </div>
          <p className="max-w-prose text-[17px]">{listing.description}</p>

          <section aria-labelledby="packages" className="space-y-3">
            <h2 id="packages" className="font-display text-2xl font-bold">
              Packages
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {listing.packages.map((p) => (
                <li key={p.tier} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4">
                  <p className="text-sm font-semibold text-ink-soft">{TIER_LABEL[p.tier]}</p>
                  <p className="tabular font-display text-3xl font-bold leading-none">{taka(p.priceBdt)}</p>
                  <p className="text-sm">{p.includes}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper font-semibold text-ink-soft">
                {initials(listing.sellerName)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                  <span className="truncate">{listing.sellerName}</span>
                  <LevelStamp level={listing.sellerLevel} />
                </p>
                <p className="text-sm text-ink-soft">{listing.sellerArea}</p>
              </div>
            </div>
            <p className="text-sm">{listing.sellerBio}</p>
            <div className="space-y-2 border-t border-line pt-4">
              <h2 className="text-sm font-semibold">What we checked</h2>
              <BadgeList badges={listing.badges} />
            </div>
          </section>

          <section className="space-y-3 rounded-xl border-2 border-bottle bg-surface p-5">
            <h2 className="font-display text-xl font-bold">Hire {listing.sellerName.split(" ")[0]}</h2>
            <p className="text-sm text-ink-soft">
              Agree on the package and deadline in chat, then pay the seller directly. Skill Bazaar never holds your
              money.
            </p>
            {listing.contactUrl && (
              <a
                href={listing.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-bottle px-4 py-3 text-center font-semibold text-on-dark hover:brightness-110"
              >
                Message {listing.sellerName.split(" ")[0]}
              </a>
            )}
            {listing.bkashNumber && <CopyNumber number={listing.bkashNumber} />}
            <p className="text-xs text-ink-soft">
              First deal with someone new? Pay half upfront and half on delivery.
              {usingSampleData && " This is a sample listing, so the contact details are placeholders."}
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
