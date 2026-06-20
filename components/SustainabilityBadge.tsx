import type { Product } from "@/lib/products";
import { getT } from "@/lib/i18n/server";

function scoreColor(score: number): string {
  if (score >= 70) return "bg-bol-green/10 text-bol-green ring-bol-green/20";
  if (score >= 50) return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-zinc-100 text-zinc-600 ring-zinc-200";
}

/** Compact green sustainability-score chip used on cards. */
export async function SustainabilityScore({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const { t } = await getT();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${scoreColor(
        score,
      )} ${className}`}
      title={`${t("score.tooltip")}: ${score}/100`}
    >
      <LeafIcon className="h-3 w-3" />
      {score}
    </span>
  );
}

/** Row of qualitative sustainability tags derived from a product. */
export async function SustainabilityTags({ product }: { product: Product }) {
  const { t } = await getT();
  const tags: string[] = [];
  if (product.ecoLabel) tags.push(product.ecoLabel);
  if (product.carbonNeutral) tags.push(t("badge.carbonNeutral"));
  if (product.recyclablePct != null && product.recyclablePct >= 60)
    tags.push(`${product.recyclablePct}% ${t("badge.recyclable")}`);
  if (product.packaging.toLowerCase().includes("biodegradable"))
    tags.push(t("badge.biodegradable"));

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded bg-bol-green/10 px-1.5 py-0.5 text-[11px] font-medium text-bol-green"
        >
          <LeafIcon className="h-3 w-3" />
          {tag}
        </span>
      ))}
    </div>
  );
}

/** bol-style green "Good Choice" eco badge shown above qualifying products. */
export async function GoodChoiceBadge({ className = "" }: { className?: string }) {
  const { t } = await getT();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#d4f5e2] px-3 py-1 text-sm font-bold text-bol-green ${className}`}
    >
      <GlobeIcon className="h-4 w-4" />
      {t("badge.goodChoice")}
    </span>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}
