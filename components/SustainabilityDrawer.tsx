"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import type { ImpactAnalogy as ImpactAnalogyValue } from "@/lib/analogy";
import { ecoLabelImage } from "@/lib/format";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import ProductTimeMachine from "@/components/ProductTimeMachine";
import ImpactAnalogy from "@/components/ImpactAnalogy";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-bol-green",
  B: "bg-bol-green",
  C: "bg-amber-500",
  D: "bg-orange-500",
  E: "bg-red-500",
};

export default function SustainabilityDrawer({
  product,
  analogy,
}: {
  product: Product;
  analogy: ImpactAnalogyValue;
}) {
  const [open, setOpen] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const result = product.sustainability;
  const ecoImg = ecoLabelImage(product.ecoLabel);
  const showScore = result.grade === "A" || result.grade === "B";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="View sustainability details"
        className="inline-flex items-center gap-2 rounded-full bg-bol-green px-3 py-1.5 text-sm font-bold text-white hover:bg-bol-green/90"
      >
        {showScore ? (
          `${result.score}/100 · ${result.grade}`
        ) : (
          <div className="flex flex-row gap-1">
            <LeafIcon className="h-5 w-5" />
            <p>Details</p>
          </div>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/35"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-1/2 flex-col overflow-y-auto bg-bol-gray shadow-2xl">
            {/* Header — bol blue bar */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-bol-blue px-5 py-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Sustainability
                </p>
                <h2 className="mt-0.5 line-clamp-2 text-lg font-bold">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-sm font-medium hover:bg-white/25"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* Score + key facts */}
              <section className="rounded-xl border border-bol-border bg-white p-4">
                {showScore && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-black text-bol-ink">
                          {result.score}
                          <span className="text-base font-bold text-zinc-400">
                            /100
                          </span>
                        </p>
                        <div className="relative flex items-center gap-1">
                          <p className="text-sm text-zinc-500">
                            Sustainability score
                          </p>
                          <button
                            type="button"
                            aria-label="Show scoring formula"
                            onClick={() => setShowFormula((v) => !v)}
                            className="text-zinc-400 hover:text-bol-blue"
                          >
                            <InfoIcon className="h-4 w-4" />
                          </button>
                          {showFormula && (
                            <div className="absolute left-0 top-6 z-20 w-72 rounded-xl border border-bol-border bg-white p-4 shadow-lg text-xs text-zinc-700">
                              <p className="font-bold text-bol-ink mb-2">
                                How the score is calculated
                              </p>
                              <p className="mb-2 text-zinc-500">
                                Score = Σ (component × weight) ÷ Σ (active
                                weights)
                              </p>
                              <table className="w-full mb-3">
                                <thead>
                                  <tr className="text-zinc-400 border-b border-zinc-100">
                                    <th className="text-left pb-1 font-medium">
                                      Component
                                    </th>
                                    <th className="text-right pb-1 font-medium">
                                      Weight
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result.calculationBreakdown.map((item) => (
                                    <tr
                                      key={item.key}
                                      className="border-b border-zinc-50"
                                    >
                                      <td className="py-0.5">{item.label}</td>
                                      <td className="text-right py-0.5 text-zinc-500">
                                        {Math.round(item.weight * 100)}%
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <p className="font-semibold text-bol-ink mb-1">
                                Grade thresholds
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {(
                                  [
                                    "A ≥ 85",
                                    "B ≥ 70",
                                    "C ≥ 55",
                                    "D ≥ 40",
                                    "E < 40",
                                  ] as const
                                ).map((g) => (
                                  <span
                                    key={g}
                                    className="rounded bg-zinc-100 px-1.5 py-0.5"
                                  >
                                    {g}
                                  </span>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowFormula(false)}
                                className="mt-3 text-xs text-bol-blue hover:underline"
                              >
                                Close
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-lg px-3 py-1.5 text-lg font-black text-white ${
                          GRADE_COLORS[result.grade] ?? "bg-zinc-400"
                        }`}
                      >
                        {result.grade}
                      </span>
                    </div>
                    <ScoreBreakdown result={result} />
                  </>
                )}

                {!showScore && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bol-green/10 text-bol-green">
                      <LeafIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-base font-bold text-bol-ink">
                        Sustainability details
                      </p>
                      <p className="text-sm text-zinc-500">
                        Key product data without a score ranking.
                      </p>
                    </div>
                  </div>
                )}

                {/* Key facts (no carbon-neutral row) */}
                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Fact
                    label="CO₂ footprint"
                    value={product.co2Kg != null ? `${product.co2Kg} kg` : "—"}
                  />
                  <Fact
                    label="Expected lifespan"
                    value={
                      product.lifespanYears != null
                        ? `${product.lifespanYears} yr`
                        : "—"
                    }
                  />
                  <Fact
                    label="Recyclable"
                    value={
                      product.recyclablePct != null
                        ? `${product.recyclablePct}%`
                        : "—"
                    }
                  />
                </dl>

                {/* Eco label as a stamp */}
                {ecoImg && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-bol-green/5 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ecoImg}
                      alt={product.ecoLabel}
                      className="h-12 w-12 shrink-0 rounded object-contain"
                    />
                    <div>
                      <p className="text-xs text-zinc-500">Eco label</p>
                      <p className="text-sm font-bold text-bol-green">
                        {product.ecoLabel}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Impact analogy */}
              <ImpactAnalogy analogy={analogy} />

              {/* Lifecycle */}
              <section className="rounded-xl border border-bol-border bg-white p-4">
                <h3 className="mb-3 text-base font-bold text-bol-ink">
                  Product lifecycle
                </h3>
                <ProductTimeMachine product={product} />
              </section>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}
