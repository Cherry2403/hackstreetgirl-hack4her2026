import Link from "next/link";
import type { Product } from "@/lib/products";
import { getGreenerAlternatives } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "@/components/Price";
import { SustainabilityScore } from "@/components/SustainabilityBadge";

export default async function AlternativeProducts({ product }: { product: Product }) {
  const alternatives = getGreenerAlternatives(product, 4);
  if (alternatives.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-bol-green">Greener alternatives</p>
          <h2 className="text-xl font-bold text-bol-ink">Same category, stronger future signals</h2>
        </div>
        <Link
          href={`/compare?ids=${[product.id, alternatives[0].id].join(",")}`}
          className="hidden rounded-full bg-bol-blue px-4 py-2 text-sm font-bold text-white hover:bg-bol-blue-dark sm:inline-flex"
        >
          Compare best option
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {alternatives.map((alt) => (
          <Link
            key={alt.id}
            href={`/product/${alt.id}`}
            className="group rounded-lg border border-bol-border bg-white p-3 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden rounded bg-bol-gray">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImage(alt.id, alt.name)}
                alt={alt.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              />
              <span className="absolute left-2 top-2 rounded-full bg-bol-green px-2 py-1 text-xs font-bold text-white">
                Greener alternative
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-bold text-bol-link group-hover:underline">
              {alt.name}
            </h3>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Price amount={alt.price} size="md" className="text-[#e2240f]" />
              <SustainabilityScore score={alt.sustainabilityScore} />
            </div>
            <ul className="mt-2 space-y-1 text-xs text-zinc-600">
              <li className="font-bold text-bol-green">
                +{alt.sustainabilityScore - product.sustainabilityScore} sustainability points
              </li>
              {alt.lifespanYears != null && product.lifespanYears != null && alt.lifespanYears > product.lifespanYears && (
                <li>Expected to last {Math.round(alt.lifespanYears - product.lifespanYears)} years longer</li>
              )}
              {alt.co2Kg != null && product.co2Kg != null && alt.co2Kg < product.co2Kg && (
                <li>Lower CO2 footprint</li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
