import type { Category } from "@/lib/types";

// A generated preview of the seller's kind of work, shown until they upload
// real samples. Each category gets the shape its work actually has.
export function SampleTile({
  category,
  caption,
  size = "card",
}: {
  category: Category;
  caption: string;
  size?: "card" | "large";
}) {
  const big = size === "large";
  const frame = "relative aspect-[16/10] w-full overflow-hidden";

  switch (category) {
    case "video":
      return (
        <div className={`${frame} bg-[#101814]`} aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#1f5a43,transparent_60%),radial-gradient(circle_at_80%_70%,#5a1f36,transparent_55%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className={`grid place-items-center rounded-full bg-white/90 ${big ? "size-16" : "size-11"}`}>
              <span className={`ml-1 border-y-transparent border-l-[#101814] ${big ? "border-y-[11px] border-l-[18px]" : "border-y-[8px] border-l-[13px]"}`} />
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 space-y-2">
            <p className={`truncate font-medium text-white/90 ${big ? "text-base" : "text-xs"}`}>{caption}</p>
            <div className="h-1 rounded-full bg-white/25">
              <div className="h-1 w-2/5 rounded-full bg-rose" />
            </div>
          </div>
        </div>
      );
    case "design":
      return (
        <div className={`${frame} bg-marigold`} aria-hidden>
          <div className="absolute -right-6 -bottom-10 size-40 rounded-full bg-rose" />
          <p
            className={`absolute inset-x-4 top-1/2 -translate-y-1/2 font-display font-extrabold uppercase leading-[0.95] text-[#15211b] [font-stretch:75%] ${big ? "text-5xl" : "text-3xl"}`}
          >
            {caption}
          </p>
        </div>
      );
    case "tutoring":
      return (
        <div className={`${frame} graph-paper`} aria-hidden>
          <p className={`absolute inset-0 grid place-items-center font-brush text-indigo ${big ? "text-5xl" : "text-3xl"}`}>
            {caption}
          </p>
          <svg className="absolute right-4 bottom-3 h-1/3 w-1/3 text-rose" viewBox="0 0 60 40" fill="none">
            <path d="M2 38 Q 20 0 30 20 T 58 4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    case "writing":
      return (
        <div className={`${frame} ruled`} aria-hidden>
          <div className="absolute inset-y-0 left-8 w-px bg-rose/60" />
          <p className={`absolute top-5 right-5 left-12 leading-6 text-ink ${big ? "text-xl" : "text-sm"}`}>
            “{caption}”
          </p>
        </div>
      );
    case "social":
      return (
        <div className={`${frame} bg-paper`} aria-hidden>
          <div className="absolute inset-x-4 top-4 bottom-8 grid grid-cols-3 gap-1.5">
            {["bg-bottle", "bg-marigold", "bg-rose", "bg-indigo", "bg-bottle-deep", "bg-marigold/60"].map((c, i) => (
              <div key={i} className={`${c} rounded-sm`} />
            ))}
          </div>
          <p className="absolute right-4 bottom-2 left-4 truncate text-xs font-medium text-ink-soft">{caption}</p>
        </div>
      );
  }
}
