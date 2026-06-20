import Link from "next/link";
import {
  type Product,
  productSpecLine,
  productBlurb,
  isGoodChoice,
} from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "./Price";
import StarRating from "./StarRating";
import EnergyLabel from "./EnergyLabel";
import AddToCartButton from "./AddToCartButton";
import CompareCheckbox from "./compare/CompareCheckbox";
import { GoodChoiceBadge, SustainabilityScore } from "./SustainabilityBadge";
import { getT } from "@/lib/i18n/server";

/** bol-style horizontal search-result row. */
export default async function ProductListRow({ product }: { product: Product }) {
  const { t, lang } = await getT();
  const delivery = product.sameDay
    ? t("card.today")
    : product.nextDay
      ? t("buy.deliveryTomorrow")
      : t("buy.deliveryStandard");

  return (
    <article className="grid grid-cols-1 gap-4 border-b border-bol-border py-6 sm:grid-cols-[180px_1fr] lg:grid-cols-[180px_1fr_220px]">
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative block self-start overflow-hidden rounded-lg bg-bol-gray"
      >
        <div className="aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage(product.id, product.name)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
          <HeartIcon className="h-4 w-4 text-zinc-500" />
        </span>
      </Link>

      {/* Middle: info */}
      <div className="min-w-0">
        {isGoodChoice(product) && <GoodChoiceBadge className="mb-2" />}
        <p className="text-sm text-zinc-500">{product.brand}</p>
        <h2 className="mt-0.5">
          <Link
            href={`/product/${product.id}`}
            className="text-lg font-bold leading-snug text-bol-ink hover:text-bol-link hover:underline"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-1 line-clamp-1 text-sm text-zinc-600">
          {productSpecLine(product, lang)}
        </p>
        <div className="mt-1.5">
          <StarRating rating={product.rating} count={product.reviewCount} size="md" />
        </div>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm text-zinc-700">
          {productBlurb(product, lang)}
        </p>
        <div className="mt-3">
          <CompareCheckbox
            item={{
              id: product.id,
              name: product.name,
              price: product.price,
              rating: product.rating,
              reviewCount: product.reviewCount,
            }}
          />
        </div>
      </div>

      {/* Right: price + buy */}
      <div className="flex flex-col items-start gap-2 lg:items-end lg:text-right">
        <div className="flex items-center gap-2 lg:justify-end">
          <Price amount={product.price} size="lg" className="text-[#e2240f]" />
          <SustainabilityScore score={product.sustainabilityScore} />
        </div>
        {product.sustainabilityScore > 75 && (
          <p className="text-xs font-bold text-bol-green">🌿 🌍 Future-friendly pick</p>
        )}
        <EnergyLabel product={product} />
        <p className="flex items-center gap-1 text-sm text-bol-green">
          <ClockIcon className="h-4 w-4" /> {delivery}
        </p>
        <p className="text-xs text-zinc-500">
          {t("common.soldBy")}{" "}
          <span className="text-bol-link">{product.warehouseName || "bol"}</span>
        </p>
        <div className="mt-1">
          <AddToCartButton label={t("common.addToCart")} addedLabel={t("common.added")} />
        </div>
      </div>
    </article>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
