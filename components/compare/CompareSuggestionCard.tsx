import Link from "next/link";
import type { Product } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "@/components/Price";
import StarRating from "@/components/StarRating";
import { getT } from "@/lib/i18n/server";

/**
 * A product card on the compare page whose whole surface adds the product to
 * the comparison (links to `addHref`). Distinct from `ProductCard`, which links
 * to the product detail page — nesting those two would create invalid nested
 * <a> elements.
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
    <Link
      href={addHref}
      className="group flex flex-col rounded-lg border border-bol-border bg-white p-3 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 aspect-square overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImage(product.id, product.name)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight text-bol-ink">
        {product.name}
      </h3>

      <div className="mt-1">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>

      <div className="mt-auto pt-2">
        <Price amount={product.price} size="md" />
        <span className="mt-2 flex items-center justify-center gap-1 rounded-full border border-bol-blue py-1.5 text-xs font-bold text-bol-blue group-hover:bg-bol-blue group-hover:text-white">
          <PlusIcon className="h-4 w-4" />
          {t("compare.add")}
        </span>
      </div>
    </Link>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
