import Link from "next/link";
import type { Product } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "@/components/Price";
import StarRating from "@/components/StarRating";
import { getT } from "@/lib/i18n/server";

/**
 * A compare-page suggestion card. Mirrors the product-header card in
 * CompareTable, but its whole surface adds the product to the comparison
 * (links to `addHref`) instead of opening the product — so we don't nest a
 * product <Link> inside another <Link>.
 */
export default async function CompareSuggestionCard({
  product,
  addHref,
}: {
  product: Product;
  addHref: string;
}) {
  const { t } = await getT();
  return (
    <div className="flex flex-col">
      <div className="mb-2 aspect-square overflow-hidden rounded border border-bol-border bg-bol-gray">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImage(product.id, product.name)}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="line-clamp-2 text-sm font-medium text-bol-ink">
        {product.name}
      </p>
      <div className="mt-1">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>
      <div className="mt-1">
        <Price amount={product.price} size="md" className="text-[#e2240f]" />
      </div>
      <Link
        href={addHref}
        className="mt-2 rounded-full border border-bol-blue px-3 py-1.5 text-center text-xs font-bold text-bol-blue hover:bg-bol-blue hover:text-white"
      >
        + {t("compare.add")}
      </Link>
    </div>
  );
}
