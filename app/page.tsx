import Link from "next/link";
import {
  getCategories,
  sampleProducts,
  searchProducts,
} from "@/lib/products";
import ProductRail from "@/components/ProductRail";
import { LeafIcon } from "@/components/SustainabilityBadge";
import { getT } from "@/lib/i18n/server";

const CATEGORY_EMOJI: Record<string, string> = {
  Fitness: "🏋️",
  "Beauty & Skincare": "💄",
  Baby: "🍼",
  Electronics: "💻",
  "Home & Garden": "🪴",
  Fashion: "👗",
  Pet: "🐾",
  "Eco-Friendly": "♻️",
  "Digital Goods": "💾",
  "Food & Beverage": "🥤",
};

export default async function Home() {
  const { t } = await getT();
  const categories = getCategories();
  const deals = sampleProducts("deals", 8);
  const popular = searchProducts({ sort: "popular", pageSize: 8 }).items;
  const sustainable = searchProducts({
    sort: "sustainability",
    pageSize: 8,
  }).items;
  const alsoViewed = sampleProducts("also-viewed", 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      {/* Hero */}
      <section className="overflow-hidden rounded-xl bg-gradient-to-r from-bol-blue to-bol-blue-dark text-white">
        <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-bol-yellow px-3 py-1 text-xs font-bold text-bol-blue">
              <LeafIcon className="h-3.5 w-3.5" /> {t("home.badge")}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-2 text-white/85">{t("home.heroSub")}</p>
            <Link
              href="/search?sort=sustainability"
              className="mt-4 inline-block rounded-md bg-bol-yellow px-5 py-2.5 font-semibold text-bol-blue transition-colors hover:bg-bol-yellow-dark"
            >
              {t("home.heroCta")}
            </Link>
          </div>
          <div className="hidden text-8xl sm:block">🌱</div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="py-6">
        <h2 className="mb-3 text-lg font-bold">{t("home.shopByCategory")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.value}
              href={`/search?category=${encodeURIComponent(c.value)}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-bol-border bg-white p-4 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{CATEGORY_EMOJI[c.value] ?? "🛍️"}</span>
              <span className="text-sm font-medium leading-tight">{c.value}</span>
              <span className="text-xs text-zinc-500">
                {c.count} {t("home.products")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Rails */}
      <div className="space-y-2">
        <div className="rounded-xl border border-bol-green/30 bg-bol-green/5 px-4">
          <ProductRail
            title={t("home.railSustainable")}
            products={sustainable}
            seeAllHref="/search?sort=sustainability"
          />
        </div>
        <ProductRail
          title={t("home.railPopular")}
          products={popular}
          seeAllHref="/search?sort=popular"
        />
        <ProductRail title={t("home.railDeals")} products={deals} sponsored />
        <ProductRail title={t("home.railAlsoViewed")} products={alsoViewed} />
      </div>
    </div>
  );
}
