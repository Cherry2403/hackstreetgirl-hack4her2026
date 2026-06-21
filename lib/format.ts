// Presentation helpers shared across server & client components.

/** Format a EUR amount the bol way: "15,99" or "75,-" for whole euros. */
export function formatEuro(amount: number): { whole: string; fraction: string } {
  const cents = Math.round(amount * 100);
  const whole = Math.floor(cents / 100);
  const frac = cents % 100;
  return {
    whole: whole.toLocaleString("nl-NL"),
    fraction: frac === 0 ? "-" : String(frac).padStart(2, "0"),
  };
}

/** A plain string price, e.g. "€ 15,99". */
export function euroString(amount: number): string {
  const { whole, fraction } = formatEuro(amount);
  return `€ ${whole},${fraction}`;
}

/**
 * Map an eco-label name to its stamp image in /public/eco-labels.
 * Returns null when there is no label (so callers can skip the stamp).
 * Replace the placeholder PNGs in public/eco-labels/ with real artwork later.
 */
export function ecoLabelImage(label: string): string | null {
  const key = label.trim().toLowerCase();
  if (!key) return null;
  const slug = key
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `/eco-labels/${slug}.png`;
}

const PLACEHOLDER_COLORS = [
  ["#dbeafe", "#3b82f6"],
  ["#dcfce7", "#22c55e"],
  ["#fef9c3", "#eab308"],
  ["#fce7f3", "#ec4899"],
  ["#ede9fe", "#8b5cf6"],
  ["#ffedd5", "#f97316"],
  ["#cffafe", "#06b6d4"],
  ["#fee2e2", "#ef4444"],
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * A deterministic inline-SVG data URI used as a product image placeholder.
 * No network needed — works offline at the hackathon.
 */
export function productImage(seed: string, label?: string): string {
  const h = hashCode(seed);
  const [bg, fg] = PLACEHOLDER_COLORS[h % PLACEHOLDER_COLORS.length];
  const initials = (label ?? seed)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bg}"/>
    <circle cx="200" cy="170" r="90" fill="${fg}" opacity="0.18"/>
    <rect x="120" y="250" width="160" height="14" rx="7" fill="${fg}" opacity="0.25"/>
    <rect x="150" y="278" width="100" height="12" rx="6" fill="${fg}" opacity="0.18"/>
    <text x="200" y="190" font-family="Arial, sans-serif" font-size="96" font-weight="700"
      fill="${fg}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
