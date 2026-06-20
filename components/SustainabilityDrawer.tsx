"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import type { ImpactAnalogy as ImpactAnalogyValue } from "@/lib/analogy";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import ProductTimeMachine from "@/components/ProductTimeMachine";
import ImpactAnalogy from "@/components/ImpactAnalogy";

export default function SustainabilityDrawer({
  product,
  analogy,
}: {
  product: Product;
  analogy: ImpactAnalogyValue;
}) {
  const [open, setOpen] = useState(false);
  const result = product.sustainability;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-bol-green px-3 py-1.5 text-sm font-bold text-white shadow-sm hover:bg-bol-green/90"
        aria-label="Open sustainability details"
      >
        <LeafIcon className="h-4 w-4" />
        {result.score}/100 · Grade {result.grade}
        {result.isSustainable && <span aria-hidden>🌍</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sustainability details"
            className="absolute inset-0 bg-black/35"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-bol-border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-bol-green">See the future before you buy</p>
                  <h2 className="mt-1 text-2xl font-bold text-bol-ink">{product.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-bol-border px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-bol-gray"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                <div className="flex flex-col items-center justify-center rounded-xl bg-bol-green p-5 text-white">
                  <span className="text-5xl font-black leading-none">{result.score}</span>
                  <span className="mt-1 text-sm font-bold">Grade {result.grade}</span>
                  <span className="mt-2 rounded-full bg-white/20 px-2 py-1 text-xs">
                    {result.confidence}% confidence
                  </span>
                </div>
                <div className="rounded-xl border border-bol-border p-4">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-zinc-500">Eco label</dt>
                      <dd className="font-bold text-bol-ink">{product.ecoLabel || "Unknown"}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Carbon neutral</dt>
                      <dd className="font-bold text-bol-ink">{product.carbonNeutral ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">CO2 footprint</dt>
                      <dd className="font-bold text-bol-ink">
                        {product.co2Kg != null ? `${product.co2Kg} kg` : "Unknown"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Expected lifespan</dt>
                      <dd className="font-bold text-bol-ink">
                        {product.lifespanYears != null ? `${product.lifespanYears} years` : "Unknown"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <InsightList title="What scores well" items={result.strengths} empty="No strong signals yet." />
                <InsightList title="What to check" items={result.warnings} empty="No major warnings in available data." />
              </div>

              <ImpactAnalogy analogy={analogy} />

              <section>
                <h3 className="mb-3 text-lg font-bold text-bol-ink">Product time machine</h3>
                <ProductTimeMachine product={product} />
              </section>

              <section className="rounded-xl border border-bol-border p-4">
                <h3 className="text-lg font-bold text-bol-ink">How the score is calculated</h3>
                <div className="mt-3 space-y-2">
                  {result.strengths.slice(0, 3).map((item) => (
                    <p key={item} className="rounded-lg bg-bol-green/10 px-3 py-2 text-sm text-bol-green">
                      {item}
                    </p>
                  ))}
                  {result.missingFields.length > 0 && (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      Some data is missing, so confidence is {result.confidence}%.
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <ScoreBreakdown result={result} />
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function InsightList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-bol-border p-4">
      <h3 className="text-sm font-bold text-bol-ink">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-zinc-700">
        {(items.length ? items : [empty]).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-bol-green" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
