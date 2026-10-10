import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { getCampusPulse, getListings, usingSampleData } from "@/lib/data";
import { CATEGORIES, type Category } from "@/lib/types";

type SearchParams = Promise<{ q?: string; cat?: string }>;

function chipHref(cat: Category | null, q: string) {
  const p = new URLSearchParams();
  if (cat) p.set("cat", cat);
  if (q) p.set("q", q);
  const s = p.toString();
  return s ? `/?${s}#browse` : "/#browse";
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", cat } = await searchParams;
  const category = CATEGORIES.find((c) => c.id === cat)?.id;
  const query = q.trim().slice(0, 80);
  const [listings, pulse] = await Promise.all([getListings({ category, query }), getCampusPulse()]);

  return (
    <main>
      <section className="haat-panel text-on-dark">
        <div className="rickshaw-trim" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr] md:items-end md:py-14">
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-extrabold [font-stretch:80%] sm:text-6xl md:text-7xl">
              Editor lagbe?
              <br />
              <span className="text-marigold">Tutor lagbe?</span>
            </h1>
            <p className="max-w-md text-lg text-on-dark/85">
              Find verified people from your campus for editing, design, tuition, writing and social media. Prices and
              samples upfront.
            </p>
            <form action="/" method="get" className="flex max-w-lg gap-2" role="search">
              <label htmlFor="q" className="sr-only">
                What do you need done?
              </label>
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="Try reels editor, A Level physics, thumbnail"
                className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-4 py-3 text-[15px] text-[#15211b] placeholder:text-[#6b7a72]"
              />
              {category && <input type="hidden" name="cat" value={category} />}
              <button
                type="submit"
                className="rounded-lg bg-marigold px-5 py-3 font-semibold text-[#15211b] hover:brightness-105"
              >
                Search
              </button>
            </form>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 md:max-w-sm md:justify-self-end">
            {[
              [pulse.dealsThisWeek, "deals done this week"],
              [pulse.activeSellers, "active sellers"],
              [pulse.openRequests, "open requests"],
            ].map(([n, label]) => (
              <div key={label} className="bg-bottle-deep px-3 py-4">
                <dt className="sr-only">{label}</dt>
                <dd className="tabular font-display text-3xl font-bold leading-none">{n}</dd>
                <dd className="mt-1 text-xs leading-tight text-on-dark/75">{label}</dd>
              </div>
            ))}
            {usingSampleData && (
              <p className="col-span-3 bg-bottle-deep px-3 pb-3 text-[11px] text-on-dark/60">Sample figures until launch</p>
            )}
          </dl>
        </div>
        <div className="rickshaw-trim" />
      </section>

      <section id="browse" className="mx-auto max-w-6xl scroll-mt-4 px-4 pt-8">
        {usingSampleData && (
          <p className="mb-5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft">
            These are sample listings. The people shown are examples while Skill Bazaar gets ready to launch.
          </p>
        )}

        <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 pb-1">
          <ul className="flex w-max gap-2">
            <li>
              <Link
                href={chipHref(null, query)}
                aria-current={!category ? "page" : undefined}
                className="block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-surface"
              >
                All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={chipHref(c.id, query)}
                  aria-current={category === c.id ? "page" : undefined}
                  className="block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium whitespace-nowrap aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-surface"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">
            {query ? `Results for “${query}”` : (CATEGORIES.find((c) => c.id === category)?.label ?? "Fresh on the bazaar")}
          </h2>
          <p className="tabular shrink-0 text-sm text-ink-soft">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </p>
        </div>

        {listings.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((l) => (
              <li key={l.id} className="flex">
                <ListingCard listing={l} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center">
            <p className="font-semibold">No listings match “{query}” yet.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Try a shorter word, or{" "}
              <Link href="/#browse" className="font-medium text-bottle underline underline-offset-2">
                see all listings
              </Link>
              . Posting a request so sellers come to you arrives in the next update.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
