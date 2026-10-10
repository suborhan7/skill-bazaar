import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Galada, Hind_Siliguri } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const anek = Anek_Bangla({
  variable: "--font-anek",
  subsets: ["latin", "bengali"],
  axes: ["wdth"],
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600"],
});

const galada = Galada({
  variable: "--font-galada",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Skill Bazaar",
  description: "Find verified people for video editing, design, tutoring, writing and social media, with prices upfront.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#08402c" },
    { media: "(prefers-color-scheme: dark)", color: "#0a3324" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anek.variable} ${hind.variable} ${galada.variable}`}>
      <body className="min-h-dvh">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-brush text-2xl leading-none text-bottle" aria-label="Skill Bazaar home">
              Skill Bazaar
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium">
              <Link href="/#browse" className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-paper hover:text-ink">
                Browse
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-ink-soft">
            <span>Skill Bazaar, launching on campus first</span>
            <span>No platform fees while we launch</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
