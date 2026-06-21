"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import ProductJourneyCompare from "@/components/ProductJourneyCompare";

interface ComparisonRow {
  label: string;
  values: string[];
}

interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
  custom?: ReactNode;
}

export default function ComparisonTable({ products }: { products: Product[] }) {
  const gridCols = `minmax(150px,1fr) repeat(${products.length}, minmax(0,1fr))`;
  const groups = buildGroups(products);

  return (
    <section className="mt-8 overflow-x-auto">
      <div className="min-w-[680px] rounded-lg border border-bol-border bg-white">
        <div className="border-b border-bol-border bg-bol-gray px-4 py-3">
          <h2 className="text-lg font-bold text-bol-ink">Main comparison</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Normal shopping details first: price, delivery, reviews, and product specs.
          </p>
        </div>

        <div className="divide-y divide-bol-border">
          {groups.map((group) => (
            <ComparisonSection
              key={group.title}
              group={group}
              gridCols={gridCols}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({
  group,
  gridCols,
}: {
  group: ComparisonGroup;
  gridCols: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left hover:bg-bol-gray/70"
      >
        <span className="font-bold text-bol-ink">{group.title}</span>
        <span className="text-xl leading-none text-zinc-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        group.custom ?? (
          <div className="divide-y divide-bol-border">
            {group.rows.map((row, index) => (
              <div
                key={row.label}
                className={`grid gap-3 px-4 py-3 text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-bol-gray/60"
                }`}
                style={{ gridTemplateColumns: gridCols }}
              >
                <span className="font-medium text-zinc-600">{row.label}</span>
                {row.values.map((value, valueIndex) => (
                  <span key={`${row.label}-${valueIndex}`} className="font-semibold text-bol-ink">
                    {value}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

function buildGroups(products: Product[]): ComparisonGroup[] {
  return [
    {
      title: "Price & reviews",
      rows: filterRows([
        { label: "Price", values: products.map((p) => euro(p.price)) },
        {
          label: "Rating",
          values: products.map((p) => `${p.rating.toFixed(1)} (${p.reviewCount} reviews)`),
        },
      ]),
    },
    {
      title: "Delivery",
      rows: filterRows([
        { label: "Delivery", values: products.map(deliveryLabel) },
        { label: "Available today", values: products.map((p) => yesNo(p.sameDay)) },
        { label: "Available tomorrow", values: products.map((p) => yesNo(p.nextDay)) },
      ]),
    },
    {
      title: "Product info",
      rows: filterRows([
        { label: "Brand", values: products.map((p) => p.brand || "–") },
        { label: "Category", values: products.map((p) => p.category || "–") },
        { label: "Subcategory", values: products.map((p) => p.subcategory || "–") },
      ]),
    },
    {
      title: "Sustainability",
      rows: [],
      custom: <ProductJourneyCompare products={products} embedded />,
    },
  ].filter((group) => group.custom || group.rows.length > 0);
}

function filterRows(rows: ComparisonRow[]): ComparisonRow[] {
  return rows.filter((row) => row.values.some((value) => value !== "–"));
}

function deliveryLabel(product: Product): string {
  if (product.sameDay) return "Today";
  if (product.nextDay) return "Tomorrow";
  if (product.normalDelivery) return "2-3 business days";
  return "Check product page";
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

function euro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
