"use client";

import { useState } from "react";

export function CopyNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(number.replace(/\D/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-3 py-2">
      <div>
        <p className="text-[11px] text-ink-soft">bKash number</p>
        <p className="tabular font-semibold select-all">{number}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm font-medium hover:border-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
