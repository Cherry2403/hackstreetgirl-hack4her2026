import Link from "next/link";
import type { Product } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "@/components/Price";
import StarRating from "@/components/StarRating";

export default function CompareProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-lg border border-bol-border bg-white p-4">
      <Link href={`/product/${product.id}`} className="group block">
        <div className="aspect-square overflow-hidden rounded-md border border-bol-border bg-bol-gray">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage(product.id, product.name)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mt-3 line-clamp-2 min-h-10 text-sm font-bold leading-tight text-bol-link group-hover:underline">
          {product.name}
        </h2>
      </Link>

      <div className="mt-2">
        <Price amount={product.price} size="md" className="text-[#e2240f]" />
      </div>

      <div className="mt-2">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>

      <dl className="mt-3 space-y-2 text-sm">
        <ProductFact label="Delivery" value={deliveryLabel(product)} />
        <ProductFact label="Category" value={product.category || "–"} />
        <ProductFact label="Subcategory" value={product.subcategory || "–"} />
        <ProductFact label="Warehouse" value={product.warehouseName || "–"} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/product/${product.id}`}
          className="rounded-full bg-bol-yellow px-4 py-2 text-center text-xs font-bold text-bol-blue hover:bg-bol-yellow-dark"
        >
          View product
        </Link>
      </div>
    </article>
  );
}

function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-semibold text-bol-ink">{value}</dd>
    </div>
  );
}

function deliveryLabel(product: Product): string {
  if (product.sameDay) return "Today";
  if (product.nextDay) return "Tomorrow";
  if (product.normalDelivery) return "2-3 business days";
  return "Check product page";
}
