import Link from "next/link";
import { searchProducts, type SortKey } from "@/lib/products";
import ProductListRow from "@/components/ProductListRow";
import FilterSidebar from "@/components/search/FilterSidebar";
import SortSelect from "@/components/search/SortSelect";
import Pagination from "@/components/search/Pagination";
import FiltersBar from "@/components/FiltersBar";
import ProductRail from "@/components/ProductRail";
import { getT } from "@/lib/i18n/server";
import { translate, type Lang } from "@/lib/i18n/translate";
import type { SustainabilityGrade } from "@/lib/scoring";

const PAGE_SIZE = 24;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const { t, lang } = await getT();

  const q = first(sp.q);
  const category = first(sp.category);
  const subcategory = first(sp.subcategory);
  const ecoLabel = first(sp.ecoLabel);
  const warehouse = first(sp.warehouse);
  const sort = (first(sp.sort) ?? "relevance") as SortKey;
  const page = Number(first(sp.page) ?? "1") || 1;
  const minPrice = first(sp.minPrice) ? Number(first(sp.minPrice)) : undefined;
  const maxPrice = first(sp.maxPrice) ? Number(first(sp.maxPrice)) : undefined;
  const minScore = first(sp.minScore) ? Number(first(sp.minScore)) : undefined;
  const minLifespan = first(sp.minLifespan) ? Number(first(sp.minLifespan)) : undefined;
  const grade = first(sp.grade) as SustainabilityGrade | undefined;
  const valuePerYear = first(sp.valuePerYear) === "best" ? "best" : undefined;
  const carbonNeutral = first(sp.carbonNeutral) === "true" ? true : undefined;
  const sameDay = first(sp.sameDay) === "true" ? true : undefined;

  const result = searchProducts({
    q,
    category,
    subcategory,
    ecoLabel,
    warehouse,
    sort,
    page,
    pageSize: PAGE_SIZE,
    minPrice,
    maxPrice,
    minScore,
    minLifespan,
    grade,
    valuePerYear,
    carbonNeutral,
    sameDay,
  });
  const sustainablePopular = searchProducts({
    category,
    minScore: 75,
    sort: "combined",
    pageSize: 6,
  }).items;

  // params for pagination links (everything except `page`)
  const baseParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "page") continue;
    const val = first(v);
    if (val) baseParams.set(k, val);
  }

  const heading = q
    ? `${t("search.resultsFor")} "${q}"`
    : category
      ? category
      : t("search.allProducts");

  const localeStr = lang === "nl" ? "nl-NL" : "en-GB";

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      {/* Breadcrumb */}
      <nav className="mb-3 text-xs text-zinc-500">
        <Link href="/" className="hover:underline">
          {t("common.home")}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-zinc-700">{heading}</span>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row">
        <FilterSidebar facets={result.facets} />

        <div className="min-w-0 flex-1">
          {/* Result header */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold">{heading}</h1>
              <p className="text-sm text-zinc-500">
                {result.total.toLocaleString(localeStr)} {t("common.results")}
              </p>
            </div>
            <SortSelect current={sort} />
          </div>

          <FiltersBar />

          {sustainablePopular.length > 0 && (
            <div className="mb-5 rounded-xl border border-bol-green/30 bg-bol-green/5 px-4">
              <ProductRail
                title="Most Sustainable Popular Products"
                products={sustainablePopular}
                seeAllHref="/search?minScore=75&sort=combined"
              />
            </div>
          )}

          {result.items.length === 0 ? (
            <EmptyState query={q} lang={lang} />
          ) : (
            <>
              <div className="border-t border-bol-border">
                {result.items.map((p) => (
                  <ProductListRow key={p.id} product={p} />
                ))}
              </div>
              <Pagination
                page={result.page}
                pageCount={result.pageCount}
                baseParams={baseParams}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query, lang }: { query?: string; lang: Lang }) {
  const t = (k: Parameters<typeof translate>[1]) => translate(lang, k);
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-bol-border bg-white py-20 text-center">
      <span className="text-5xl">🔍</span>
      <h2 className="mt-4 text-lg font-bold">{t("search.emptyTitle")}</h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        {query
          ? `${t("search.emptyWithQuery")} "${query}". ${t("search.emptyHint")}`
          : t("search.emptyNoQuery")}
      </p>
      <Link
        href="/search"
        className="mt-4 rounded-md bg-bol-blue px-5 py-2 text-sm font-medium text-white hover:bg-bol-blue-dark"
      >
        {t("search.viewAll")}
      </Link>
    </div>
  );
}
