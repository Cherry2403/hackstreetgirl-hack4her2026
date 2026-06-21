"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { productImage } from "@/lib/format";
import Price from "@/components/Price";
import StarRating from "@/components/StarRating";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface CompareRow {
  label: string;
  values: string[];
}

interface CompareGroup {
  title: string;
  rows: CompareRow[];
}

export default function CompareTable({
  products,
  groups,
}: {
  products: Product[];
  groups: CompareGroup[];
}) {
  const { t } = useLanguage();
  const [onlyDiff, setOnlyDiff] = useState(false);

  const cols = products.length;
  const gridCols = `minmax(140px,1fr) repeat(${cols}, minmax(0,1fr))`;

  const isDiff = (row: CompareRow) =>
    new Set(row.values).size > 1;

  return (
    <div className="overflow-x-auto">
      {/* Toggle */}
      <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={onlyDiff}
          onChange={(e) => setOnlyDiff(e.target.checked)}
          className="h-4 w-4 accent-bol-blue"
        />
        {t("compare.onlyDiff")}
      </label>

      <div className="min-w-[640px]">
        {/* Header row: product cards (sticky) */}
        <div
          className="sticky top-[124px] z-10 grid items-end gap-3 border-b-2 border-bol-border bg-white pb-4 pt-2"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div className="flex items-end text-sm font-bold text-zinc-500">
            {products.length} {t("home.products")}
          </div>
          {products.map((p) => (
            <div key={p.id} className="flex flex-col">
              <Link href={`/product/${p.id}`} className="group">
                <div className="mb-2 aspect-square overflow-hidden rounded border border-bol-border bg-bol-gray">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImage(p.id, p.name)}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="line-clamp-2 text-sm font-medium text-bol-link group-hover:underline">
                  {p.name}
                </p>
              </Link>
              <div className="mt-1">
                <StarRating rating={p.rating} count={p.reviewCount} />
              </div>
              <div className="mt-1">
                <Price amount={p.price} size="md" className="text-[#e2240f]" />
              </div>
              <a
                href="#product-journeys"
                className="mt-2 rounded-full border border-bol-border px-3 py-1.5 text-center text-xs font-bold text-bol-blue hover:border-bol-blue"
              >
                See product journey
              </a>
              <Link
                href={`/product/${p.id}`}
                className="mt-2 rounded-full bg-bol-yellow px-3 py-1.5 text-center text-xs font-bold text-bol-blue hover:bg-bol-yellow-dark"
              >
                {t("compare.viewProduct")}
              </Link>
            </div>
          ))}
        </div>

        {/* Spec groups */}
        {groups.map((group) => {
          const rows = onlyDiff ? group.rows.filter(isDiff) : group.rows;
          if (rows.length === 0) return null;
          return (
            <div key={group.title}>
              <h3 className="mt-6 mb-1 text-sm font-bold text-bol-ink">
                {group.title}
              </h3>
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid gap-3 px-2 py-2 text-sm ${
                    i % 2 === 0 ? "bg-white" : "bg-bol-gray"
                  } ${isDiff(row) ? "ring-1 ring-inset ring-bol-yellow/40" : ""}`}
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <span className="text-zinc-500">{row.label}</span>
                  {row.values.map((v, j) => (
                    <span key={j} className="font-medium text-bol-ink">
                      {v}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
