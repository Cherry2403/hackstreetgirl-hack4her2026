"use client";

import type { Product } from "@/lib/products";

export default function FutureImpactDetails({ products }: { products: Product[] }) {
  const gridCols = `minmax(150px,1fr) repeat(${products.length}, minmax(0,1fr))`;
  const rows = [
    {
      label: "Sustainability score",
      values: products.map((p) => `${p.sustainabilityScore}/100`),
    },
    {
      label: "Confidence",
      values: products.map((p) => `${p.sustainabilityConfidence}%`),
    },
    {
      label: "Lifespan",
      values: products.map((p) => (p.lifespanYears != null ? `${p.lifespanYears} years` : "–")),
    },
    {
      label: "Repairability",
      values: products.map((p) =>
        p.repairability != null ? `${p.repairability}/${p.repairability <= 5 ? 5 : 10}` : "–",
      ),
    },
    {
      label: "Packaging",
      values: products.map((p) => p.packaging || "–"),
    },
    {
      label: "Recyclability",
      values: products.map((p) => (p.recyclablePct != null ? `${p.recyclablePct}%` : "–")),
    },
    {
      label: "CO₂ footprint",
      values: products.map((p) => (p.co2Kg != null ? `${p.co2Kg} kg` : "–")),
    },
    {
      label: "Eco-label",
      values: products.map((p) => p.ecoLabel || "–"),
    },
    {
      label: "Missing data",
      values: products.map((p) =>
        p.sustainability.missingFields.length
          ? p.sustainability.missingFields.join(", ")
          : "No major gaps",
      ),
      missing: true,
    },
  ];

  return (
    <div className="border-t border-bol-green/20 bg-bol-green/5 p-3">
      <p className="mb-3 text-sm leading-relaxed text-zinc-700">
        Sustainability is one lens, not the whole decision. Compare price, delivery,
        reviews, and future impact together.
      </p>
      <div className="space-y-1">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid gap-3 rounded-md px-3 py-2 text-sm ${
              index % 2 === 0 ? "bg-white" : "bg-white/60"
            }`}
            style={{ gridTemplateColumns: gridCols }}
          >
            <span className="font-medium text-zinc-600">{row.label}</span>
            {row.values.map((value, valueIndex) => (
              <span
                key={`${row.label}-${valueIndex}`}
                className={`font-semibold ${
                  row.missing && value !== "No major gaps"
                    ? "text-amber-700"
                    : "text-bol-ink"
                }`}
              >
                {value}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
