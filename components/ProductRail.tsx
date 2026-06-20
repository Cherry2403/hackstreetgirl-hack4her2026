import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import { getT } from "@/lib/i18n/server";

interface ProductRailProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
  sponsored?: boolean;
}

/** Horizontally scrolling product rail ("Others also viewed", etc.). */
export default async function ProductRail({
  title,
  products,
  seeAllHref,
  sponsored = false,
}: ProductRailProps) {
  if (products.length === 0) return null;
  const { t } = await getT();

  return (
    <section className="py-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-bol-ink">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-sm text-bol-link hover:underline">
            {t("rail.seeAll")}
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact sponsored={sponsored} />
        ))}
      </div>
    </section>
  );
}
