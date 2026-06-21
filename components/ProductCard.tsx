import Link from "next/link";
import type { Product } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "./Price";
import StarRating from "./StarRating";
import { SustainabilityScore } from "./SustainabilityBadge";
import { getT } from "@/lib/i18n/server";

interface ProductCardProps {
  product: Product;
  /** Compact layout for horizontal rails. */
  compact?: boolean;
  sponsored?: boolean;
}

export default async function ProductCard({
  product,
  compact = false,
  sponsored = false,
}: ProductCardProps) {
  const { t } = await getT();
  const showSustainabilityGrade =
    product.sustainabilityGrade === "A" || product.sustainabilityGrade === "B";

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group flex flex-col rounded-lg border border-bol-border bg-white p-3 transition-shadow hover:shadow-md ${
        compact ? "w-44 shrink-0" : ""
      }`}
    >
      <div className="relative mb-2 aspect-square overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImage(product.id, product.name)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
        />
        {showSustainabilityGrade && (
          <span className="absolute left-1.5 top-1.5">
            <SustainabilityScore score={product.sustainabilityScore} />
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight text-bol-link group-hover:underline">
        {product.name}
      </h3>

      <div className="mt-1 flex items-center gap-1">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center justify-between gap-2">
          <Price amount={product.price} size="md" />
          {showSustainabilityGrade && (
            <SustainabilityScore score={product.sustainabilityScore} />
          )}
        </div>
        {showSustainabilityGrade && product.sustainabilityScore > 75 && (
          <p className="mt-1 text-[11px] font-bold text-bol-green">🌿 🌍 Future-friendly pick</p>
        )}
        <p className="mt-1 text-[11px] text-zinc-500">
          {product.sameDay
            ? t("card.today")
            : product.nextDay
              ? t("card.tomorrow")
              : t("card.inStock")}
        </p>
        {sponsored && (
          <p className="mt-1 text-[11px] text-zinc-400">{t("card.sponsored")}</p>
        )}
      </div>
    </Link>
  );
}
