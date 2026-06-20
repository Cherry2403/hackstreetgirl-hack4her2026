import Link from "next/link";
import { getProductsByIds, getRelatedProducts, type Product } from "@/lib/products";
import { analogyBetweenProducts } from "@/lib/analogy";
import { buildSpecGroups, buildSpecMap } from "@/lib/specs";
import CompareTable from "@/components/compare/CompareTable";
import CompareSuggestionCard from "@/components/compare/CompareSuggestionCard";
import ComparisonTimeline from "@/components/ComparisonTimeline";
import ImpactAnalogy from "@/components/ImpactAnalogy";
import { euroString } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import type { TranslationKey } from "@/lib/i18n/translate";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "Compare products | bol" };

export default async function ComparePage(props: PageProps<"/compare">) {
  const sp = await props.searchParams;
  const { t, lang } = await getT();
  const idsParam = first(sp.ids) ?? "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  const products = getProductsByIds(ids);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <span className="text-5xl">⚖️</span>
        <h1 className="mt-4 text-xl font-bold">{t("compare.emptyTitle")}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t("compare.emptyHint")}</p>
        <Link
          href="/search"
          className="mt-4 inline-block rounded-md bg-bol-blue px-5 py-2 text-sm font-medium text-white hover:bg-bol-blue-dark"
        >
          {t("compare.viewProducts")}
        </Link>
      </div>
    );
  }

  // Build the union of spec labels across all products, grouped.
  const template = buildSpecGroups(products[0], lang);
  const maps = products.map((p) => buildSpecMap(p, lang));
  const groups = template.map((group) => ({
    title: group.title,
    rows: group.rows.map((row) => ({
      label: row.label,
      values: maps.map((m) => m.get(row.label) ?? "–"),
    })),
  }));

  // Suggest more products to compare (from the first product's relations,
  // excluding ones already in the comparison).
  const suggestions = getRelatedProducts(products[0], 12)
    .filter((p) => !ids.includes(p.id))
    .slice(0, 6);

  const addHref = (newId: string) =>
    `/compare?ids=${[...ids, newId].join(",")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <nav className="mb-3 text-xs text-zinc-500">
        <Link href="/" className="hover:underline">
          {t("common.home")}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-zinc-700">{t("compare.breadcrumb")}</span>
      </nav>

      <h1 className="mb-1 text-2xl font-bold">{t("compare.pageTitle")}</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {products.length}{" "}
        {products.length === 1 ? t("compare.selected") : t("compare.sideBySide")}
        {products.length === 1 && ` — ${t("compare.addOnePrompt")}`}
      </p>

      {products.length >= 2 && (
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <GreenScoreLine a={products[0]} b={products[1]} />
          <ImpactAnalogy analogy={analogyBetweenProducts(products[0], products[1])} />
        </div>
      )}

      <PriceLifespanValue products={products} t={t} />

      <CompareTable products={products} groups={groups} />

      <ComparisonTimeline products={products.slice(0, 2)} />

      {/* Add-to-compare suggestions */}
      {suggestions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold">{t("compare.addMore")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {suggestions.map((p) => (
              <CompareSuggestionCard key={p.id} product={p} addHref={addHref(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PriceLifespanValue({
  products,
  t,
}: {
  products: Product[];
  t: (key: TranslationKey) => string;
}) {
  const values = products
    .map((product) => product.valuePerYear)
    .filter((value): value is number => value != null);
  const bestValue = values.length ? Math.min(...values) : null;
  const worstValue = values.length ? Math.max(...values) : null;

  return (
    <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-bol-ink">{t("compare.valueTitle")}</h2>
          <p className="mt-1 text-sm text-zinc-600">{t("compare.valueSubtitle")}</p>
        </div>
        <p className="text-xs font-medium text-zinc-500">{t("spec.pricePerLifeYear")}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => {
          const value = product.valuePerYear;
          const isBest = value != null && value === bestValue;
          const range = bestValue != null && worstValue != null ? worstValue - bestValue : 0;
          const score =
            value == null
              ? 0
              : range === 0
                ? 100
                : 35 + ((worstValue! - value) / range) * 65;

          return (
            <article
              key={product.id}
              className={`rounded-lg border p-4 ${
                isBest ? "border-bol-green bg-bol-green/5" : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-sm font-bold text-bol-ink">{product.name}</h3>
                {isBest && (
                  <span className="shrink-0 rounded-full bg-bol-green px-2 py-1 text-[11px] font-bold text-white">
                    {t("compare.bestValue")}
                  </span>
                )}
              </div>

              <p className="mt-4 text-2xl font-black text-[#e2240f]">
                {value != null ? `${euroString(value)} / ${t("spec.year")}` : "–"}
              </p>

              <div className="mt-3 h-2 rounded-full bg-white">
                <div
                  className={`h-2 rounded-full ${isBest ? "bg-bol-green" : "bg-bol-blue"}`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-zinc-500">{t("compare.priceLabel")}</dt>
                  <dd className="font-bold text-bol-ink">{euroString(product.price)}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">{t("compare.lifespanLabel")}</dt>
                  <dd className="font-bold text-bol-ink">
                    {product.lifespanYears != null
                      ? `${product.lifespanYears} ${t("spec.year")}`
                      : "–"}
                  </dd>
                </div>
              </dl>

              {value == null && (
                <p className="mt-3 text-xs text-zinc-500">{t("compare.valueUnavailable")}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GreenScoreLine({
  a,
  b,
}: {
  a: { name: string; sustainabilityScore: number };
  b: { name: string; sustainabilityScore: number };
}) {
  const better = a.sustainabilityScore >= b.sustainabilityScore ? a : b;
  return (
    <section className="rounded-xl border border-bol-green/30 bg-white p-5">
      <p className="text-sm font-bold text-bol-green">Sustainability difference</p>
      <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="max-w-40 text-sm font-bold text-bol-ink">
          <p className="line-clamp-2">{a.name}</p>
          <p className="text-bol-green">{a.sustainabilityScore}</p>
        </div>
        <div className="relative h-3 rounded-full bg-zinc-100">
          <div className="absolute inset-y-0 left-0 rounded-full bg-bol-green/25" style={{ width: `${a.sustainabilityScore}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-bol-green" style={{ width: `${b.sustainabilityScore}%` }} />
        </div>
        <div className="max-w-40 text-right text-sm font-bold text-bol-ink">
          <p className="line-clamp-2">{b.name}</p>
          <p className="text-bol-green">{b.sustainabilityScore}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-700">
        {better.name} is highlighted as the more sustainable option in this comparison.
      </p>
    </section>
  );
}
