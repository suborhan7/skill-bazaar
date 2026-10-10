// Taka amounts use South Asian digit grouping: ৳1,00,000.
const bdt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function taka(amount: number) {
  return `৳${bdt.format(amount)}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function deliveryLabel(days: number) {
  if (days >= 28) return "Monthly";
  return days === 1 ? "1 day delivery" : `${days} day delivery`;
}
