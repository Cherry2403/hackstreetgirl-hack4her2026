import Link from "next/link";
import { getProductsByIds, getRelatedProducts } from "@/lib/products";
import CompareSuggestionCard from "@/components/compare/CompareSuggestionCard";
import CompareProductCard from "@/components/CompareProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import { getT } from "@/lib/i18n/server";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = { title: "Compare products | bol" };

export default async function ComparePage(props: PageProps<"/compare">) {
  const sp = await props.searchParams;
  const { t } = await getT();
  const idsParam = first(sp.ids) ?? "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  const products = getProductsByIds(ids);
  const comparedProducts = products.slice(0, 4);

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

  // Suggest more products to compare (from the first product's relations,
  // excluding ones already in the comparison).
  const suggestions = getRelatedProducts(products[0], 12)
    .filter((p) => !comparedProducts.some((selected) => selected.id === p.id))
    .slice(0, 6);

  const addHref = (newId: string) =>
    `/compare?ids=${[...comparedProducts.map((p) => p.id), newId].slice(0, 4).join(",")}`;

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
        {comparedProducts.length}{" "}
        {comparedProducts.length === 1
          ? t("compare.selected")
          : t("compare.sideBySide")}
        {comparedProducts.length === 1 && ` — ${t("compare.addOnePrompt")}`}
      </p>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {comparedProducts.map((product) => (
          <CompareProductCard key={product.id} product={product} />
        ))}
      </section>

      <ComparisonTable products={comparedProducts} />

      {/* Add-to-compare suggestions */}
      {suggestions.length > 0 && comparedProducts.length < 4 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold">{t("compare.addMore")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {suggestions.map((p) => (
              <CompareSuggestionCard
                key={p.id}
                product={p}
                addHref={addHref(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
